import type { ReactNode } from 'react'
import { ManagementSidebar } from './ManagementSidebar'
import './AdminLayout.css'

/** Yönetim sayfalarının ortak iskeleti — sidebar + içerik alanı. */
export function AdminLayout({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="admin-layout">
      <ManagementSidebar active={active} />
      <div className="admin-content">{children}</div>
    </div>
  )
}
