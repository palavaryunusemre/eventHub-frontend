import { useTranslation } from 'react-i18next'
import { CertificateVerifyContainer } from '../features/certificates/CertificateVerifyContainer'
import './CertificateVerify.css'

/** Herkese açık sertifika doğrulama sayfası — oturum gerektirmez. */
export default function CertificateVerify() {
  const { t } = useTranslation()
  return (
    <div className="verify-page">
      <div className="verify-page-brand">{t('brand.title')}</div>
      <div className="verify-page-card">
        <CertificateVerifyContainer />
      </div>
    </div>
  )
}
