import { api } from './client'

export type RegistrationStatus = 'REGISTERED' | 'CANCELLED' | 'CHECKED_IN' | 'NO_SHOW'

export interface RegistrationItem {
  id: string
  eventId: string
  eventTitle: string
  eventStartAt: string
  eventEndAt: string
  status: RegistrationStatus
  qrToken: string
  registeredAt: string
  checkedInAt: string | null
}

export const registrationsApi = {
  // Backend: POST /api/events/{id}/register -> Result<String> (veri dönmez)
  register: (eventId: string) => api.post<void>(`/api/events/${encodeURIComponent(eventId)}/register`),
  cancel: (registrationId: string) => api.delete<void>(`/api/registrations/${encodeURIComponent(registrationId)}`),
  // Backend: GET /api/registrations/mine
  mine: () => api.get<RegistrationItem[]>('/api/registrations/mine'),
}
