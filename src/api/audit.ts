import { api } from './client'
import type { PagedResult } from './client'

export interface AuditLogItem {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  details: string | null
  performedById: string | null
  performedByEmail: string | null
  institutionId: string | null
  createdAt: string
}

export const auditApi = {
  getLogs: (params: { page?: number; size?: number; from?: string; to?: string; action?: string; targetType?: string; email?: string } = {}) => {
    const qs = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') qs.set(key, String(value))
    }
    const query = qs.toString()
    return api.get<PagedResult<AuditLogItem>>(`/api/audit/logs${query ? `?${query}` : ''}`)
  },
}
