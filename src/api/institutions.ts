import { api } from './client'

export type InstitutionType = 'UNIVERSITY' | 'COMPANY' | 'NGO' | 'OTHER'

export interface InstitutionItem {
  id: string
  name: string
  emailDomain: string
  type: InstitutionType
  verified: boolean
  createdAt: string
}

export interface InstitutionInput {
  name: string
  emailDomain: string
  type: InstitutionType
}

export const institutionsApi = {
  list: () => api.get<InstitutionItem[]>('/api/institutions'),
  create: (body: InstitutionInput) => api.post<void>('/api/institutions', body),
  update: (id: string, body: InstitutionInput) => api.put<void>(`/api/institutions/${encodeURIComponent(id)}`, body),
  remove: (id: string) => api.delete<void>(`/api/institutions/${encodeURIComponent(id)}`),
}
