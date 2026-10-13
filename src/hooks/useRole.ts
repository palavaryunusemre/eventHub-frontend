import { useAuth } from '../context/AuthContext'

export interface RoleInfo {
  role: string
  isAdmin: boolean
  isUser: boolean
  /** ADMIN — yönetim/onay alanlarına erişebilir. */
  canManage: boolean
}

/** Oturum açan kullanıcının rolünü ve türetilmiş yetki bayraklarını döner. */
export function useRole(): RoleInfo {
  const { user } = useAuth()
  const role = user?.role ?? ''
  const isAdmin = role === 'ADMIN'
  const isUser = role === 'USER'
  return { role, isAdmin, isUser, canManage: isAdmin }
}
