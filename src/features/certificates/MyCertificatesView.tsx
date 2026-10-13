import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { CertificateCard } from '../../components/CertificateCard'
import type { UseMyCertificatesResult } from './useMyCertificates'

export function MyCertificatesView({ items, loading, download }: UseMyCertificatesResult) {
  const { t } = useTranslation()

  if (loading) return <Spin />
  if (items.length === 0) return <p>{t('certificates.noRecords')}</p>

  return (
    <div className="certificate-list">
      {items.map((cert) => <CertificateCard key={cert.id} certificate={cert} onDownload={download} />)}
    </div>
  )
}
