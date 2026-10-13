import { useCallback, useEffect, useState } from 'react'
import { eventsApi, type EventSummaryItem, type EventVisibility } from '../../api/events'
import { categoriesApi, type CategoryItem } from '../../api/categories'

export interface EventFilters {
  category: string
  visibility: EventVisibility | ''
}

export interface UseEventsResult {
  items: EventSummaryItem[]
  categories: CategoryItem[]
  loading: boolean
  filters: EventFilters
  setFilters: (filters: EventFilters) => void
}

export function useEvents(): UseEventsResult {
  const [items, setItems] = useState<EventSummaryItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<EventFilters>({ category: '', visibility: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // Backend discover() yalnızca search + categoryId destekler; görünürlük filtresi
      // istemci tarafında uygulanır (bkz. aşağıdaki .filter).
      const result = await eventsApi.list({ categoryId: filters.category || undefined })
      setItems(filters.visibility ? result.filter((e) => e.visibility === filters.visibility) : result)
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])
  useEffect(() => { categoriesApi.list().then(setCategories).catch(() => undefined) }, [])

  return { items, categories, loading, filters, setFilters }
}
