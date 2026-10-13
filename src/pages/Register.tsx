import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import './Login.css'

export default function Register() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await authApi.register({ email, firstName, lastName, password })
      toast.success(t('register.success'))
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-form-pane">
        <div className="login-brand">
          <div className="login-brand-icon login-brand-icon--text">EH</div>
          <div>
            <span className="login-brand-title">{t('brand.title')}</span>
            <span className="login-brand-sub">{t('register.sub')}</span>
          </div>
        </div>

        <div className="login-welcome"><h1>{t('register.welcome')}</h1><p>{t('register.welcomeSub')}</p></div>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="register-firstname">{t('register.firstName')}</label>
            <div className="login-input-wrap">
              <input id="register-firstname" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoFocus />
            </div>
          </div>
          <div className="login-field">
            <label htmlFor="register-lastname">{t('register.lastName')}</label>
            <div className="login-input-wrap">
              <input id="register-lastname" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="login-field">
            <label htmlFor="register-email">{t('login.email')}</label>
            <div className="login-input-wrap">
              <input id="register-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="login-field">
            <label htmlFor="register-password">{t('login.password')}</label>
            <div className="login-input-wrap">
              <input id="register-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={16} />
            </div>
          </div>
          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? t('register.submitting') : t('register.submit')}
          </button>
        </form>
        <p className="login-legal"><Link to="/login">{t('register.haveAccount')}</Link></p>
      </section>
      <section className="login-visual-pane">
        <div className="mesh-grid" />
        <div className="login-visual-copy"><h2>{t('register.heroLine1')}<br /><strong>{t('register.heroLine2')}</strong></h2></div>
      </section>
    </div>
  )
}
