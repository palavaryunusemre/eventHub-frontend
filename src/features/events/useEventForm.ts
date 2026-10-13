import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { eventsApi, type EventInput, type EventItem } from '../../api/events'
import { categoriesApi, type CategoryItem } from '../../api/categories'
import { institutionsApi, type InstitutionItem } from '../../api/institutions'

export interface UseEventFormResult {
  event: EventItem | null
  categories: CategoryItem[]
  institutions: InstitutionItem[]
  loading: boolean
  saving: boolean
  isEdit: boolean
  submit: (values: EventInput) => Promise<void>
}

export function useEventForm(eventId: string | undefined): UseEventFormResult {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([])
  const [loading, setLoading] = useState(!!eventId)
  const [saving, setSaving] = useState(false)

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
  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => undefined)
    institutionsApi.list().then(setInstitutions).catch(() => undefined)
  }, [])

  async function submit(values: EventInput) {
    setSaving(true)
    try {
      if (eventId) {
        await eventsApi.update(eventId, values)
        toast.success(t('events.updated'))
        navigate(`/events/${eventId}`)
      } else {
        const createdId = await eventsApi.create(values)
        toast.success(t('events.created'))
        navigate(`/events/${createdId}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return { event, categories, institutions, loading, saving, isEdit: !!eventId, submit }
}
