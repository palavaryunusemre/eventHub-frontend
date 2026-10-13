import { api } from './client'

export interface RegisterInput {
  email: string
  firstName: string
  lastName: string
  password: string
}

/**
 * Kendi kendine kayıt — login/logout/refresh akışı AuthContext içinde
 * (cookie tabanlı oturum) yönetildiği için burada sadece hesap oluşturma var.
 */
export const authApi = {
  register: (body: RegisterInput) => api.post<void>('/api/auth/signIn', { ...body, role: 'USER' }),
}
