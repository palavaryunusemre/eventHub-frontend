import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEnvelope, faEye, faEyeSlash, faLock, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import './Login.css'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState(() => localStorage.getItem('eventhub_remember_email') ?? '')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [remember, setRemember] = useState(() => localStorage.getItem('eventhub_remember') === 'true')
  const [submitting, setSubmitting] = useState(false)

  // Zaten girişliyse login formunu tekrar göstermeye gerek yok.
  // (render sırasında imperative navigate() çağırmak React'in
  // "update sırasında update" uyarısına yol açar — bunun yerine
  // deklaratif <Navigate> kullanılıyor.)
  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      if (remember) {
        localStorage.setItem('eventhub_remember', 'true')
        localStorage.setItem('eventhub_remember_email', email)
      } else {
        localStorage.removeItem('eventhub_remember')
        localStorage.removeItem('eventhub_remember_email')
      }
      navigate('/', { replace: true })
    } catch {
      // Hata mesajı client.ts tarafından toast ile gösteriliyor.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-form-pane">
        <div className="login-brand">
          <div className="login-brand-icon login-brand-icon--text">RF</div>
          <div>
            <span className="login-brand-title">{t('brand.title')}</span>
            <span className="login-brand-sub">{t('login.sub')}</span>
          </div>
        </div>

        <div className="login-welcome"><h1>{t('login.welcome')}</h1><p>{t('login.welcomeSub')}</p></div>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">{t('login.email')}</label>
            <div className="login-input-wrap"><FontAwesomeIcon icon={faEnvelope} /><input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            /></div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">{t('login.password')}</label>
            <div className="login-input-wrap"><FontAwesomeIcon icon={faLock} /><input
              id="login-password"
              type={passwordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><button className="password-toggle" type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={t('login.togglePassword')}><FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} /></button></div>
          </div>

          <div className="login-options"><label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> {t('login.remember')}</label></div>

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? t('login.submitting') : <>{t('login.submit')} <FontAwesomeIcon icon={faArrowRight} /></>}
          </button>
        </form>
        <div className="login-legal">{t('login.legal')}</div>
      </section>
      <section className="login-visual-pane">
        <div className="mesh-grid" />
        <div className="login-visual-copy"><div className="visual-badge"><FontAwesomeIcon icon={faShieldHalved} /> {t('login.badge')}</div><h2>{t('login.heroLine1')}<br /><strong>{t('login.heroLine2')}</strong></h2><p>{t('login.heroDescription')}</p></div>
        <div className="visual-status"><span>{t('login.realtime')}</span><b>{t('login.behavior')}</b><span>{t('login.centralManagement')}</span><b>{t('login.secureNetwork')}</b></div>
        <div className="visual-circles"><i /><i /><i /><i /></div>
      </section>
    </div>
  )
}
