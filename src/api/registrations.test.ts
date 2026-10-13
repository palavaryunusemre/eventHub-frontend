import { describe, expect, it, vi, beforeEach } from 'vitest'

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }))

vi.mock('./axiosInstance', () => ({
  axiosInstance: { request: requestMock },
}))

import { registrationsApi } from './registrations'

function okResponse<T>(data: T) {
  return { status: 200, data: { success: true, code: 0, data } }
}

describe('registrationsApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('registers for an event', async () => {
    requestMock.mockResolvedValueOnce(okResponse({ id: 'reg-1', qrToken: 'token-abc' }))
    const result = await registrationsApi.register('evt-1')

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', url: '/api/events/evt-1/register' }),
    )
    expect(result).toEqual({ id: 'reg-1', qrToken: 'token-abc' })
  })

  it('cancels a registration', async () => {
    requestMock.mockResolvedValueOnce(okResponse(undefined))
    await registrationsApi.cancel('reg-1')

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE', url: '/api/registrations/reg-1' }),
    )
  })

  it('fetches the current user registrations', async () => {
    requestMock.mockResolvedValueOnce(okResponse([{ id: 'reg-1' }]))
    const result = await registrationsApi.mine()

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', url: '/api/registrations/mine' }),
    )
    expect(result).toEqual([{ id: 'reg-1' }])
  })
})
