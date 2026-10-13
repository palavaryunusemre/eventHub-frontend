import { useMyCertificates } from './useMyCertificates'
import { MyCertificatesView } from './MyCertificatesView'

export function MyCertificatesContainer() {
  const data = useMyCertificates()
  return <MyCertificatesView {...data} />
}
