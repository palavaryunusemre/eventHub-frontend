import { ApiError, api } from './client'

export interface CheckInResult {
  success: boolean
  attendeeName?: string
  eventTitle?: string
  message?: string
}

// Backend CheckInOutput — sadece başarılı taramada döner (hata durumunda
// DataResult.success=false olur ve client.ts bunu ApiError olarak fırlatır).
interface CheckInOutput {
  id: string
  registrationId: string
  eventId: string
  eventTitle: string
  userId: string
  userEmail: string
  userName: string | null
  scannedAt: string
  scannedById: string | null
}

export const checkinsApi = {
  scan: async (qrToken: string): Promise<CheckInResult> => {
    try {
      const data = await api.post<CheckInOutput>('/api/checkins/scan', { qrToken })
      return { success: true, attendeeName: data.userName || data.userEmail, eventTitle: data.eventTitle }
    } catch (err) {
      return { success: false, message: err instanceof ApiError ? err.message : undefined }
    }
  },
}
