import { useCallback, useEffect, useState } from 'react'
import { auditApi, type AuditLogItem } from '../../api/audit'
import type { PageInfo } from '../../api/client'

export interface UseAuditLogResult {
  items: AuditLogItem[]
  pageInfo: PageInfo | null
  loading: boolean
  page: number
  setPage: (page: number) => void
}

export function useAuditLog(): UseAuditLogResult {
  const [items, setItems] = useState<AuditLogItem[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await auditApi.getLogs({ page })
      setItems(result.data)
      setPageInfo(result.pageInfo)
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  return { items, pageInfo, loading, page, setPage }
}
