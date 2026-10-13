import { useEffect, useState } from 'react'
import { registrationsApi } from '../../api/registrations'
import { certificatesApi } from '../../api/certificates'
import { eventsApi, type EventSummaryItem } from '../../api/events'
import { useRole } from '../../hooks/useRole'
import { adminEventsApi } from '../../api/admin'

export interface UseDashboardResult {
  loading: boolean
  upcomingCount: number
  certificateCount: number
  pendingReviewCount: number
  recentEvents: EventSummaryItem[]
}

export function useDashboard(): UseDashboardResult {
  const { canManage } = useRole()
  const [loading, setLoading] = useState(true)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [certificateCount, setCertificateCount] = useState(0)
  const [pendingReviewCount, setPendingReviewCount] = useState(0)
  const [recentEvents, setRecentEvents] = useState<EventSummaryItem[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [registrations, certificates, events, pending] = await Promise.all([
          registrationsApi.mine().catch(() => []),
          certificatesApi.mine().catch(() => []),
          eventsApi.list().catch(() => []),
          canManage ? adminEventsApi.pending().catch(() => []) : Promise.resolve([]),
        ])
        if (cancelled) return
        setUpcomingCount(registrations.filter((r) => r.status === 'REGISTERED').length)
        setCertificateCount(certificates.length)
        setRecentEvents(events.filter((e) => e.status === 'PUBLISHED').slice(0, 5))
        setPendingReviewCount(pending.length)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [canManage])

  return { loading, upcomingCount, certificateCount, pendingReviewCount, recentEvents }
}
