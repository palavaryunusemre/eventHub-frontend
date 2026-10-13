import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { categoriesApi, type CategoryItem } from '../../api/categories'

export interface UseCategoriesResult {
  items: CategoryItem[]
  loading: boolean
  saving: boolean
  create: (name: string) => Promise<boolean>
  update: (id: string, name: string) => Promise<boolean>
  remove: (id: string) => Promise<void>
}

export function useCategories(): UseCategoriesResult {
  const { t } = useTranslation()
  const [items, setItems] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await categoriesApi.list())
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(name: string) {
    setSaving(true)
    try {
      await categoriesApi.create({ name })
      toast.success(t('categories.created'))
      await load()
      return true
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }

  async function update(id: string, name: string) {
    setSaving(true)
    try {
      await categoriesApi.update(id, { name })
      toast.success(t('categories.updated'))
      await load()
      return true
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    try {
      await categoriesApi.remove(id)
      toast.success(t('categories.deleted'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  return { items, loading, saving, create, update, remove }
}
