import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { api, ApiError } from '../api/client'
import { axiosInstance } from '../api/axiosInstance'
import { onSessionExpired } from '../api/sessionEvents'
import { getCookie, clearCookie } from '../utils/cookies'
import { decodeJwt, isJwtExpired, type JwtPayload } from '../utils/jwt'

// Kimlik doğrulama token'ı ayrı bir HttpOnly cookie'de (eventhub_jwt) tutulur —
// JS'den hiç görünmez, tarayıcı isteklere otomatik ekler. Burada okunan, sadece
// görüntüleme amaçlı, HttpOnly OLMAYAN kullanıcı bilgisi cookie'si.
const INFO_COOKIE_NAME = 'eventhub_user'

// Access/info token'lar 15dk ömürlü (bkz. JwtService.EXPIRATION_MS) — süresi
// dolmadan bu kadar önce sessizce /api/auth/refresh çağrılır.
const REFRESH_MARGIN_MS = 60_000

interface AuthUser {
  id: string
  email: string
  fullName: string
  role: string
  institutionId: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/** JWT payload'ından AuthUser üretir — backend JwtService.generateInfoToken bu alanları claim olarak koyar. */
function userFromPayload(payload: JwtPayload): AuthUser | null {
  if (!payload.email || !payload.userID) return null
  return {
    id: payload.userID,
    email: payload.email,
    fullName: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
    role: String(payload.role ?? '').replace('ROLE_', '').toUpperCase(),
    institutionId: payload.institutionId ?? null,
  }
}

/** eventhub_user cookie'sini okur; süresi dolmuşsa/bozuksa temizler. */
function readStoredUser(): AuthUser | null {
  const token = getCookie(INFO_COOKIE_NAME)
  if (!token) return null
  const payload = decodeJwt(token)
  if (!payload || isJwtExpired(payload)) {
    clearCookie(INFO_COOKIE_NAME)
    return null
  }
  return userFromPayload(payload)
}

/** eventhub_user cookie'sindeki exp claim'i (ms) — access token'la aynı anda üretildiği için süresi de aynıdır. */
function readExpiryMs(): number | null {
  const token = getCookie(INFO_COOKIE_NAME)
  const payload = token ? decodeJwt(token) : null
  return payload?.exp ? payload.exp * 1000 : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Kullanıcı bilgisi cookie'de senkron okunabildiği için ayrıca bir /auth/me
  // isteği beklemeye gerek yok — ilk render'da kullanıcı zaten belli.
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [loading] = useState(false)
  const refreshTimer = useRef<number | null>(null)

  function clearScheduledRefresh() {
    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current)
      refreshTimer.current = null
    }
  }

  function scheduleSilentRefresh() {
    clearScheduledRefresh()
    const expiryMs = readExpiryMs()
    if (!expiryMs) return
    const delay = Math.max(expiryMs - Date.now() - REFRESH_MARGIN_MS, 5_000)
    refreshTimer.current = window.setTimeout(async () => {
      try {
        // Silent refresh — kullanıcıyı rahatsız eden bir toast göstermeye gerek yok.
        await axiosInstance.post('/api/auth/refresh')
        const refreshedUser = readStoredUser()
        setUser(refreshedUser)
        if (refreshedUser) scheduleSilentRefresh()
      } catch {
        setUser(null)
      }
    }, delay)
  }

  // Kullanıcı login/refresh ile değiştikçe zamanlayıcıyı yeniden kur;
  // logout'ta (user=null) cleanup zamanlayıcıyı iptal eder.
  useEffect(() => {
    if (user) scheduleSilentRefresh()
    return clearScheduledRefresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Reaktif taraf: bir API isteği 401 alıp refresh de başarısız olursa
  // (axiosInstance.ts) buradan haber gelir — 7 günlük oturum tamamen bitmiş demektir.
  useEffect(() => onSessionExpired(() => setUser(null)), [])

  async function login(email: string, password: string) {
    // Backend üç cookie'yi de Set-Cookie header'ıyla yazıyor (auth+refresh: HttpOnly,
    // info: JS okuyabilir) — token'lar hiçbir zaman response body'sinde dönmez.
    await api.post('/api/auth/logIn', { email, password })
    const nextUser = readStoredUser()
    if (!nextUser) {
      throw new ApiError(500, 'Geçersiz oturum bilgisi alındı.')
    }
    setUser(nextUser)
  }

  async function logout() {
    try {
      // auth/refresh cookie'leri HttpOnly olduğu için JS ile silinemez —
      // backend'in Set-Cookie (Max-Age=0) ile temizlemesi ve refresh token'ı
      // DB'de iptal etmesi gerekir.
      await api.post('/api/auth/logout')
    } finally {
      clearCookie(INFO_COOKIE_NAME)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı')
  return ctx
}
