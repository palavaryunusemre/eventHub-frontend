import { useEffect, useState } from 'react'
import { certificatesApi, type CertificateVerificationResponse } from '../../api/certificates'

export interface UseCertificateVerifyResult {
  result: CertificateVerificationResponse | null
  loading: boolean
  error: boolean
}

export function useCertificateVerify(code: string | undefined): UseCertificateVerifyResult {
  const [result, setResult] = useState<CertificateVerificationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    certificatesApi.verify(code)
      .then(setResult)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [code])

  return { result, loading, error }
}
