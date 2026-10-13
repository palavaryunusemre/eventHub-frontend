import { useRef, useState } from 'react'
import { checkinsApi, type CheckInResult } from '../../api/checkins'

export interface ScanLogEntry extends CheckInResult {
  id: string
  scannedAt: string
}

export interface UseCheckInScannerResult {
  active: boolean
  setActive: (active: boolean) => void
  lastResult: ScanLogEntry | null
  log: ScanLogEntry[]
  handleScan: (token: string) => void
  handleCameraError: (error: unknown) => void
  cameraError: boolean
}

/** Aynı QR'ı kısa süre içinde tekrar taramayı (video karesi üst üste okunduğunda) engeller. */
const RESCAN_COOLDOWN_MS = 2500

export function useCheckInScanner(): UseCheckInScannerResult {
  const [active, setActive] = useState(true)
  const [log, setLog] = useState<ScanLogEntry[]>([])
  const [cameraError, setCameraError] = useState(false)
  const lastTokenRef = useRef<{ token: string; at: number } | null>(null)
  const inFlightRef = useRef(false)

  async function handleScan(token: string) {
    const now = Date.now()
    if (inFlightRef.current) return
    if (lastTokenRef.current?.token === token && now - lastTokenRef.current.at < RESCAN_COOLDOWN_MS) return
    lastTokenRef.current = { token, at: now }
    inFlightRef.current = true
    try {
      const result = await checkinsApi.scan(token)
      setLog((prev) => [{ ...result, id: `${now}`, scannedAt: new Date().toISOString() }, ...prev].slice(0, 20))
    } catch {
      setLog((prev) => [{ success: false, message: 'Hata', id: `${now}`, scannedAt: new Date().toISOString() }, ...prev].slice(0, 20))
    } finally {
      inFlightRef.current = false
    }
  }

  function handleCameraError() {
    setCameraError(true)
  }

  return { active, setActive, lastResult: log[0] ?? null, log, handleScan, handleCameraError, cameraError }
}
