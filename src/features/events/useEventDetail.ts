import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { eventsApi, type EventItem } from '../../api/events'
import { registrationsApi } from '../../api/registrations'

export interface UseEventDetailResult {
  event: EventItem | null
  loading: boolean
  registering: boolean
  register: () => Promise<void>
  submitForReview: () => Promise<void>
  remove: () => Promise<boolean>
}

export function useEventDetail(eventId: string | undefined): UseEventDetailResult {
  const { t } = useTranslation()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  const load = useCallback(async () => {
    if (!eventId) return
    setLoading(true)
    try {
      setEvent(await eventsApi.get(eventId))
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => { load() }, [load])

  async function register() {
    if (!eventId) return
    setRegistering(true)
    try {
      await registrationsApi.register(eventId)
      toast.success(t('events.registerSuccess'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setRegistering(false)
    }
  }

  async function submitForReview() {
    if (!eventId) return
    try {
      await eventsApi.submitForReview(eventId)
      toast.success(t('events.submittedForReview'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  async function remove() {
    if (!eventId) return false
    try {
      await eventsApi.remove(eventId)
      toast.success(t('events.deleted'))
      return true
    } catch {
      return false
    }
  }

  return { event, loading, registering, register, submitForReview, remove }
}
