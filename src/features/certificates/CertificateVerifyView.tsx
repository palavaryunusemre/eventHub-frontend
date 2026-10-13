import { Spin } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { UseCertificateVerifyResult } from './useCertificateVerify'

export function CertificateVerifyView({ result, loading, error }: UseCertificateVerifyResult) {
  const { t, i18n } = useTranslation()

  if (loading) return <Spin />

  if (error || !result || !result.valid) {
    return (
      <div className="verify-result verify-result--invalid">
        <CloseCircleFilled />
        <h2>{t('verify.invalid')}</h2>
      </div>
    )
  }

  return (
    <div className="verify-result verify-result--valid">
      <CheckCircleFilled />
      <h2>{t('verify.valid')}</h2>
      <p><strong>{result.attendeeName}</strong></p>
      <p>{result.eventTitle}</p>
      {result.issuedAt && <p>{new Date(result.issuedAt).toLocaleDateString(i18n.language)}</p>}
    </div>
  )
}
