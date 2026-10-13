import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useRole } from '../hooks/useRole'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { UserOutlined } from '@ant-design/icons'
import { usersApi } from '../api/users'
import { toast } from 'react-hot-toast'
import './Layout.css'

export function Layout({ title, children }: { title: string; children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { canManage } = useRole()
  const [profileOpen, setProfileOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [passwordForm] = Form.useForm<{ currentPassword: string; newPassword: string; newPasswordConfirm: string }>()

  async function changePassword() {
    try {
      const values = await passwordForm.validateFields()
      setPasswordSubmitting(true)
      await usersApi.changePassword(values)
      toast.success(t('profile.passwordUpdated'))
      setPasswordModalOpen(false)
      passwordForm.resetFields()
    } catch {
      // API ve form doğrulama hataları kendi mesajlarını gösterir.
    } finally {
      setPasswordSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topnav">
        <div className="topnav-brand">
          <div className="brand-icon">EH</div>
          <div className="brand-text">
            <span className="brand-title">{t('brand.title')}</span>
            <span className="brand-sub">{t('brand.sub')}</span>
          </div>
        </div>

        <nav className="topnav-tabs">
          <NavLink to="/" end className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            {t('nav.events')}
          </NavLink>
          <NavLink to="/my-registrations" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            {t('nav.myRegistrations')}
          </NavLink>
          <NavLink to="/my-certificates" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            {t('nav.myCertificates')}
          </NavLink>
          <NavLink to="/checkin" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            {t('nav.checkin')}
          </NavLink>
        </nav>

        <div className="topnav-right">
          {canManage && (
            <NavLink to="/admin/review" className={({ isActive }) => `admin-panel-btn${isActive ? ' active' : ''}`}>
              {t('nav.management')}
            </NavLink>
          )}
          <select
            className="lang-select"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label="Language"
          >
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>
          <div className="profile-menu">
            <button className="topnav-user" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
              <div className="user-avatar"><UserOutlined /></div>
              <span className="user-name">
                {user ? user.fullName : ''}
              </span>
              <FontAwesomeIcon className="profile-chevron" icon={faChevronDown} />
            </button>
            {profileOpen && (
              <div className="profile-popover">
                <button onClick={() => { setProfileOpen(false); navigate('/profile') }}>
                  <UserOutlined /> {t('profile.title')}
                </button>
                <button onClick={() => { setProfileOpen(false); setPasswordModalOpen(true) }}>
                  <FontAwesomeIcon icon={faKey} /> {t('profile.changePassword')}
                </button>
                <button onClick={() => logout()}>
                  <FontAwesomeIcon icon={faRightFromBracket} /> {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="breadcrumb-bar">{title}</div>
        {children}
      </main>

      <Modal
        title={t('profile.passwordTitle')}
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        onOk={changePassword}
        confirmLoading={passwordSubmitting}
        okText={t('profile.update')}
        cancelText={t('common.cancel')}
        destroyOnHidden
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item name="currentPassword" label={t('profile.currentPassword')} rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item name="newPassword" label={t('profile.newPassword')} rules={[{ required: true }, { min: 8, max: 16, message: t('common.passwordLength') }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="newPasswordConfirm"
            label={t('profile.confirmPassword')}
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue('newPassword') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('profile.passwordMismatch')))
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
