import type { ReactNode } from 'react'
import { useRole } from '../hooks/useRole'

/** Yalnızca belirtilen rollerden birine sahip kullanıcıya içerik gösterir. */
export function RoleGuard({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { role } = useRole()
  if (!roles.includes(role)) return null
  return <>{children}</>
}
