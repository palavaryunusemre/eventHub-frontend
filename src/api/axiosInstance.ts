import axios, { type InternalAxiosRequestConfig } from 'axios'
import { notifySessionExpired } from './sessionEvents'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  // Backend JWT'leri cookie'ye yazıyor (bkz. JwtService) — tarayıcı bunları
  // her isteğe otomatik ekler, elle Authorization header'ı gerekmez.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

// Aynı anda birden fazla istek 401 alırsa hepsi TEK refresh çağrısını paylaşır.
let refreshPromise: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post('/api/auth/refresh')
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// Access token süresi dolduğunda (15dk) backend 401 döner — burada sessizce
// eventhub_refresh cookie'siyle /api/auth/refresh çağrılıp orijinal istek
// bir kez tekrarlanır. Refresh de başarısız olursa (7 günlük oturum bitmiş)
// AuthContext'e haber verilir.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetriableConfig | undefined
    const isAuthEndpoint = config?.url?.includes('/api/auth/')

    if (error.response?.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true
      const refreshed = await refreshSession()
      if (refreshed) {
        return axiosInstance(config)
      }
      notifySessionExpired()
    }

    return Promise.reject(error)
  },
)
