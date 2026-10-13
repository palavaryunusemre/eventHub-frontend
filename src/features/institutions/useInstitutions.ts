import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { institutionsApi, type InstitutionInput, type InstitutionItem } from '../../api/institutions'

export interface UseInstitutionsResult {
  items: InstitutionItem[]
  loading: boolean
  saving: boolean
  create: (body: InstitutionInput) => Promise<boolean>
  update: (id: string, body: InstitutionInput) => Promise<boolean>
  remove: (id: string) => Promise<void>
}

export function useInstitutions(): UseInstitutionsResult {
  const { t } = useTranslation()
  const [items, setItems] = useState<InstitutionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await institutionsApi.list())
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(body: InstitutionInput) {
    setSaving(true)
    try {
      await institutionsApi.create(body)
      toast.success(t('institutions.created'))
      await load()
      return true
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }

  async function update(id: string, body: InstitutionInput) {
    setSaving(true)
    try {
      await institutionsApi.update(id, body)
      toast.success(t('institutions.updated'))
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
      await institutionsApi.remove(id)
      toast.success(t('institutions.deleted'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  return { items, loading, saving, create, update, remove }
}
