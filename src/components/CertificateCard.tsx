import { useTranslation } from 'react-i18next'
import { SafetyCertificateOutlined, DownloadOutlined } from '@ant-design/icons'
import type { CertificateItem } from '../api/certificates'
import './CertificateCard.css'

export function CertificateCard({ certificate, onDownload }: { certificate: CertificateItem; onDownload: (code: string) => void }) {
  const { t, i18n } = useTranslation()

  return (
    <div className="certificate-card">
      <div className="certificate-card-icon"><SafetyCertificateOutlined /></div>
      <div className="certificate-card-body">
        <h4>{certificate.eventTitle}</h4>
        <span className="certificate-card-code">{t('certificates.code')}: {certificate.code}</span>
        <span className="certificate-card-date">{new Date(certificate.issuedAt).toLocaleDateString(i18n.language)}</span>
      </div>
      <button className="btn-primary" onClick={() => onDownload(certificate.code)}>
        <DownloadOutlined /> {t('certificates.download')}
      </button>
    </div>
  )
}
