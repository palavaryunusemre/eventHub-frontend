import { useCheckInScanner } from './useCheckInScanner'
import { CheckInScannerView } from './CheckInScannerView'

export function CheckInScannerContainer() {
  const data = useCheckInScanner()
  return <CheckInScannerView {...data} />
}
