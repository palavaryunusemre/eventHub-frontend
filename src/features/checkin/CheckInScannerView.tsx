import { useTranslation } from 'react-i18next'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { QrScanner } from '../../components/QrScanner'
import type { UseCheckInScannerResult } from './useCheckInScanner'

export function CheckInScannerView({ active, lastResult, log, handleScan, handleCameraError, cameraError }: UseCheckInScannerResult) {
  const { t, i18n } = useTranslation()

  return (
    <div className="checkin-scanner">
      <div className="checkin-scanner-camera">
        {!cameraError && <QrScanner active={active} onScan={handleScan} onError={handleCameraError} />}
      </div>

      {lastResult && (
        <div className={`checkin-result checkin-result--${lastResult.success ? 'success' : 'failure'}`} data-testid="checkin-result">
          {lastResult.success ? <CheckCircleFilled /> : <CloseCircleFilled />}
          <div>
            <strong>{lastResult.success ? t('checkin.success') : t('checkin.failure')}</strong>
            {lastResult.attendeeName && <p>{lastResult.attendeeName}</p>}
            {lastResult.message && <p>{lastResult.message}</p>}
          </div>
        </div>
      )}

      <ul className="checkin-log">
        {log.map((entry) => (
          <li key={entry.id} className={entry.success ? 'checkin-log-ok' : 'checkin-log-fail'}>
            <span>{new Date(entry.scannedAt).toLocaleTimeString(i18n.language)}</span>
            <span>{entry.attendeeName ?? entry.message ?? (entry.success ? t('checkin.success') : t('checkin.failure'))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
