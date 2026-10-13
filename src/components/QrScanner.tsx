import { useEffect, useRef, useState } from 'react'
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser'
import { useTranslation } from 'react-i18next'

export interface QrScannerProps {
  /** Her başarılı karede tetiklenir — aynı değeri tekrar tekrar bildirebilir, debounce çağıran tarafta yapılır. */
  onScan: (text: string) => void
  /** Kamera açılamazsa (izin reddi vb.) tetiklenir. */
  onError?: (error: unknown) => void
  active?: boolean
}

/** Kamera görüntüsünden QR kod okuyan bileşen — @zxing/browser kullanır. */
export function QrScanner({ onScan, onError, active = true }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle')

  useEffect(() => {
    if (!active) {
      controlsRef.current?.stop()
      controlsRef.current = null
      setStatus('idle')
      return
    }

    let cancelled = false
    const reader = new BrowserQRCodeReader()
    setStatus('starting')

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result, error) => {
        if (cancelled) return
        if (result) {
          onScan(result.getText())
        } else if (error && error.name !== 'NotFoundException') {
          // Kare üzerinde kod bulunamaması normal akış — sadece diğer hatalar raporlanır.
        }
      })
      .then((controls) => {
        if (cancelled) {
          controls.stop()
          return
        }
        controlsRef.current = controls
        setStatus('running')
      })
      .catch((error) => {
        if (cancelled) return
        setStatus('error')
        onError?.(error)
      })

    return () => {
      cancelled = true
      controlsRef.current?.stop()
      controlsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <div className="qr-scanner">
      <video ref={videoRef} data-testid="qr-scanner-video" style={{ width: '100%', borderRadius: 12 }} muted />
      {status === 'error' && <p className="qr-scanner-error">{t('checkin.cameraError')}</p>}
    </div>
  )
}
