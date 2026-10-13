import { api } from './client'

export type UserRole = 'USER' | 'ADMIN'

// Backend UserOutput: id,email,firstName,lastName,role,institutionId,createdAt
export interface UserItem {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  institutionId: string | null
  createdAt: string
}

// Backend SignInRequest/UpdateUserRequest: email,firstName,lastName,password,role,institutionId
export interface UserCreateInput {
  email: string
  firstName: string
  lastName: string
  password?: string
  role: UserRole
  institutionId?: string | null
}

export const usersApi = {
  list: () => api.get<UserItem[]>('/api/auth/users'),
  create: (body: UserCreateInput) => api.post<void>('/api/auth/signIn', body),
  update: (id: string, body: UserCreateInput) => api.put<void>('/api/auth/update', { id, ...body }),
  changePassword: (body: { currentPassword: string; newPassword: string; newPasswordConfirm: string }) =>
    api.put<void>('/api/auth/change-password', body),
  remove: (id: string) => api.delete<void>(`/api/auth/delete?id=${encodeURIComponent(id)}`),
}
