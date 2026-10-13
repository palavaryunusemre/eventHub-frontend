import { render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QrScanner } from './QrScanner'

const { stopMock, callbackBox } = vi.hoisted(() => ({
  stopMock: vi.fn(),
  callbackBox: {
    current: null as ((result: { getText(): string } | undefined, error?: { name: string }) => void) | null,
  },
}))

vi.mock('@zxing/browser', () => {
  return {
    BrowserQRCodeReader: class {
      decodeFromVideoDevice(
        _deviceId: string | undefined,
        _video: HTMLVideoElement | undefined,
        callback: (result: { getText(): string } | undefined, error?: { name: string }) => void,
      ) {
        callbackBox.current = callback
        return Promise.resolve({ stop: stopMock })
      }
    },
  }
})

afterEach(() => {
  callbackBox.current = null
  stopMock.mockClear()
})

describe('QrScanner', () => {
  it('invokes onScan when the reader decodes a QR code', async () => {
    const onScan = vi.fn()
    render(<QrScanner onScan={onScan} />)

    await waitFor(() => expect(callbackBox.current).not.toBeNull())
    callbackBox.current?.({ getText: () => 'qr-token-123' })

    expect(onScan).toHaveBeenCalledWith('qr-token-123')
  })

  it('ignores NotFoundException decode errors (no match in frame)', async () => {
    const onScan = vi.fn()
    render(<QrScanner onScan={onScan} />)

    await waitFor(() => expect(callbackBox.current).not.toBeNull())
    callbackBox.current?.(undefined, { name: 'NotFoundException' })

    expect(onScan).not.toHaveBeenCalled()
  })

  it('stops the scanner controls on unmount', async () => {
    const onScan = vi.fn()
    const { unmount } = render(<QrScanner onScan={onScan} />)

    await waitFor(() => expect(callbackBox.current).not.toBeNull())
    unmount()

    await waitFor(() => expect(stopMock).toHaveBeenCalled())
  })
})
