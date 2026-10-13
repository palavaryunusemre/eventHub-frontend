import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { certificatesApi, triggerBlobDownload, type CertificateItem } from '../../api/certificates'

export interface UseMyCertificatesResult {
  items: CertificateItem[]
  loading: boolean
  download: (code: string) => Promise<void>
}

export function useMyCertificates(): UseMyCertificatesResult {
  const { t } = useTranslation()
  const [items, setItems] = useState<CertificateItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    certificatesApi.mine()
      .then(setItems)
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [])

  async function download(code: string) {
    try {
      const blob = await certificatesApi.downloadPdf(code)
      triggerBlobDownload(blob, `sertifika-${code}.pdf`)
    } catch {
      toast.error(t('certificates.downloadError'))
    }
  }

  return { items, loading, download }
}
