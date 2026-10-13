import { axiosInstance } from './axiosInstance'
import { api } from './client'

export interface CertificateItem {
  id: string
  code: string
  eventId: string
  eventTitle: string
  issuedAt: string
  revoked: boolean
}

// Backend CertificateVerificationResponse
export interface CertificateVerificationResponse {
  valid: boolean
  code?: string
  eventTitle?: string
  attendeeName?: string
  issuedAt?: string
  eventStartAt?: string
  eventEndAt?: string
  message?: string
}

export const certificatesApi = {
  // Backend: GET /api/certificates/mine
  mine: () => api.get<CertificateItem[]>('/api/certificates/mine'),
  downloadPdf: async (code: string): Promise<Blob> => {
    const res = await axiosInstance.get(`/api/certificates/${encodeURIComponent(code)}/pdf`, {
      responseType: 'blob',
    })
    return res.data as Blob
  },
  // Public, kimlik doğrulama gerektirmez.
  verify: (code: string) => api.get<CertificateVerificationResponse>(`/api/verify/${encodeURIComponent(code)}`),
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
