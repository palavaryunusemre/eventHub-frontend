/**
 * Backend'in ürettiği JWT'nin payload'ını (email, firstName, lastName, role,
 * userID, exp) çözer — bkz. JwtService.generateToken. Ayrı bir /auth/me
 * isteğine gerek kalmaz, kullanıcı bilgisi token'ın kendisinden okunur.
 */
export interface JwtPayload {
  sub?: string
  userID?: string
  institutionId?: string | null
  email?: string
  role?: string
  firstName?: string
  lastName?: string
  exp?: number
  iat?: number
  jti?: string
}

function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  )
}

export function decodeJwt(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

export function isJwtExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false
  return Date.now() >= payload.exp * 1000
}
