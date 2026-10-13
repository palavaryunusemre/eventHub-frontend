import { describe, expect, it, vi, beforeEach } from 'vitest'

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }))

vi.mock('./axiosInstance', () => ({
  axiosInstance: { request: requestMock },
}))

import { eventsApi } from './events'

function okResponse<T>(data: T) {
  return { status: 200, data: { success: true, code: 0, data } }
}

describe('eventsApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('lists events with query params from filters', async () => {
    requestMock.mockResolvedValueOnce(okResponse([]))
    await eventsApi.list({ categoryId: 'cat-1', search: 'summit' })

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/api/events?'),
      }),
    )
    const url = requestMock.mock.calls[0][0].url as string
    expect(url).toContain('categoryId=cat-1')
    expect(url).toContain('search=summit')
  })

  it('fetches a single event by id', async () => {
    requestMock.mockResolvedValueOnce(okResponse({ id: 'evt-1' }))
    const result = await eventsApi.get('evt-1')

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', url: '/api/events/evt-1' }),
    )
    expect(result).toEqual({ id: 'evt-1' })
  })

  it('submits an event for review', async () => {
    requestMock.mockResolvedValueOnce(okResponse(undefined))
    await eventsApi.submitForReview('evt-1')

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', url: '/api/events/evt-1/submit-for-review' }),
    )
  })

  it('deletes an event', async () => {
    requestMock.mockResolvedValueOnce(okResponse(undefined))
    await eventsApi.remove('evt-1')

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE', url: '/api/events/evt-1' }),
    )
  })
})
