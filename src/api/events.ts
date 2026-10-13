import { api } from './client'

export type EventVisibility = 'PUBLIC' | 'INSTITUTION_ONLY'
export type EventFormat = 'ONLINE' | 'IN_PERSON' | 'HYBRID'
export type EventStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'

// Backend EventOutput — GET /api/events/{id}, /api/events/mine, /api/admin/events/pending
export interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  coverImageUrl: string | null
  categoryId: string | null
  categoryName: string | null
  organizerId: string
  organizerName: string | null
  visibility: EventVisibility
  allowedInstitutionIds: string[]
  format: EventFormat
  location: string | null
  onlineUrl: string | null
  startAt: string
  endAt: string
  capacity: number | null
  registeredCount: number
  status: EventStatus
  certificateEnabled: boolean
  rejectionReason: string | null
  reviewedById: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

// Backend EventSummaryOutput — GET /api/events (herkese açık keşif/listeleme uç noktası)
export interface EventSummaryItem {
  id: string
  title: string
  slug: string
  coverImageUrl: string | null
  categoryName: string | null
  format: EventFormat
  location: string | null
  startAt: string
  endAt: string
  status: EventStatus
  visibility: EventVisibility
}

export interface EventInput {
  title: string
  description: string
  coverImageUrl?: string | null
  categoryId?: string | null
  visibility: EventVisibility
  allowedInstitutionIds?: string[]
  format: EventFormat
  location?: string | null
  onlineUrl?: string | null
  startAt: string
  endAt: string
  capacity?: number | null
  certificateEnabled: boolean
}

export interface EventListParams {
  search?: string
  categoryId?: string
}

export const eventsApi = {
  // Backend: GET /api/events?search=&categoryId= -> DataResult<List<EventSummaryOutput>>
  list: (params: EventListParams = {}) => {
    const qs = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') qs.set(key, String(value))
    }
    const query = qs.toString()
    return api.get<EventSummaryItem[]>(`/api/events${query ? `?${query}` : ''}`)
  },
  // Backend: GET /api/events/mine -> DataResult<List<EventOutput>> (kendi oluşturduğu etkinlikler)
  mine: () => api.get<EventItem[]>('/api/events/mine'),
  get: (id: string) => api.get<EventItem>(`/api/events/${encodeURIComponent(id)}`),
  // Backend: POST /api/events -> DataResult<UUID> (oluşturulan etkinliğin id'si)
  create: (body: EventInput) => api.post<string>('/api/events', body),
  // Backend: PUT /api/events (id path'te değil, body içinde) -> Result<String>
  update: (id: string, body: EventInput) => api.put<void>('/api/events', { id, ...body }),
  remove: (id: string) => api.delete<void>(`/api/events/${encodeURIComponent(id)}`),
  submitForReview: (id: string) => api.post<void>(`/api/events/${encodeURIComponent(id)}/submit-for-review`),
}
