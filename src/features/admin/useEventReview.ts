import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { adminEventsApi } from '../../api/admin'
import type { EventItem } from '../../api/events'

export interface UseEventReviewResult {
  items: EventItem[]
  loading: boolean
  approve: (id: string) => Promise<void>
  reject: (id: string, reason: string) => Promise<void>
}

export function useEventReview(): UseEventReviewResult {
  const { t } = useTranslation()
  const [items, setItems] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await adminEventsApi.pending())
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function approve(id: string) {
    try {
      await adminEventsApi.approve(id)
      toast.success(t('admin.approved'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  async function reject(id: string, reason: string) {
    try {
      await adminEventsApi.reject(id, reason)
      toast.success(t('admin.rejected'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  return { items, loading, approve, reject }
}
