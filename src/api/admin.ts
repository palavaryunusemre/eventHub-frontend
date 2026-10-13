import { api } from './client'
import type { EventItem } from './events'

export const adminEventsApi = {
  pending: () => api.get<EventItem[]>('/api/admin/events/pending'),
  // Backend: POST /api/admin/events/{id}/review  { approved, rejectionReason? }
  approve: (id: string) => api.post<void>(`/api/admin/events/${encodeURIComponent(id)}/review`, { approved: true }),
  reject: (id: string, rejectionReason: string) =>
    api.post<void>(`/api/admin/events/${encodeURIComponent(id)}/review`, { approved: false, rejectionReason }),
}
