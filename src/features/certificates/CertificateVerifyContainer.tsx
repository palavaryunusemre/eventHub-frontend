import { useParams } from 'react-router-dom'
import { useCertificateVerify } from './useCertificateVerify'
import { CertificateVerifyView } from './CertificateVerifyView'

export function CertificateVerifyContainer() {
  const { code } = useParams<{ code: string }>()
  const data = useCertificateVerify(code)
  return <CertificateVerifyView {...data} />
}
