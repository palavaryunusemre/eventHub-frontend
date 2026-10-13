import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInScannerContainer } from './CheckInScannerContainer'

// bkz. components/EventCard.test.tsx — @ant-design/icons'ın iki tonlu renk
// desteği Node/CJS test ortamında ESM alt modülü require ettiği için patlıyor.
vi.mock('@ant-design/icons', () => ({
  CheckCircleFilled: () => <span data-testid="icon-check" />,
  CloseCircleFilled: () => <span data-testid="icon-close" />,
}))

const { scanMock, scanHandlerBox } = vi.hoisted(() => ({
  scanMock: vi.fn(),
  scanHandlerBox: { current: null as ((text: string) => void) | null },
}))

vi.mock('../../components/QrScanner', () => ({
  QrScanner: ({ onScan }: { onScan: (text: string) => void }) => {
    scanHandlerBox.current = onScan
    return <div data-testid="mock-qr-scanner" />
  },
}))

vi.mock('../../api/checkins', () => ({
  checkinsApi: { scan: (...args: unknown[]) => scanMock(...args) },
}))

afterEach(() => {
  scanHandlerBox.current = null
  scanMock.mockReset()
})

describe('CheckInScannerContainer', () => {
  it('shows a success state when the scan succeeds', async () => {
    scanMock.mockResolvedValueOnce({ success: true, attendeeName: 'Ada Lovelace' })
    render(<CheckInScannerContainer />)

    scanHandlerBox.current?.('qr-token-1')

    await waitFor(() => expect(screen.getByTestId('checkin-result')).toBeInTheDocument())
    expect(within(screen.getByTestId('checkin-result')).getByText('Ada Lovelace')).toBeInTheDocument()
  })

  it('shows a failure state when the scan fails', async () => {
    scanMock.mockResolvedValueOnce({ success: false, message: 'Already checked in' })
    render(<CheckInScannerContainer />)

    scanHandlerBox.current?.('qr-token-2')

    await waitFor(() => expect(screen.getByTestId('checkin-result')).toBeInTheDocument())
    expect(within(screen.getByTestId('checkin-result')).getByText('Already checked in')).toBeInTheDocument()
  })
})
