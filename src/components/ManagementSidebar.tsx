import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BankOutlined, FileSearchOutlined, MenuFoldOutlined, MenuUnfoldOutlined, TagsOutlined, TeamOutlined, FileDoneOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export function ManagementSidebar({ active }: { active: string }) {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)

  const items = [
    { key: 'review', label: t('management.review'), icon: <FileDoneOutlined /> },
    { key: 'institutions', label: t('management.institutions'), icon: <BankOutlined /> },
    { key: 'categories', label: t('management.categories'), icon: <TagsOutlined /> },
    { key: 'users', label: t('management.users'), icon: <TeamOutlined /> },
    { key: 'audit', label: t('management.audit'), icon: <FileSearchOutlined /> },
  ]

  return (
    <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        {!collapsed && <span>{t('management.heading')}</span>}
        <button className="admin-sidebar-collapse" onClick={() => setCollapsed((value) => !value)} title={t('management.collapse')}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
      {items.map((item) => (
        <NavLink
          key={item.key}
          to={`/admin/${item.key}`}
          className={`admin-sidebar-item${active === item.key ? ' active' : ''}`}
          title={collapsed ? item.label : undefined}
        >
          <span className="admin-sidebar-icon">{item.icon}</span>
          {!collapsed && <span className="admin-sidebar-label">{item.label}</span>}
        </NavLink>
      ))}
    </aside>
  )
}
