import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { usersApi, type UserCreateInput, type UserItem } from '../../api/users'

export interface UseUsersResult {
  items: UserItem[]
  loading: boolean
  saving: boolean
  create: (body: UserCreateInput) => Promise<boolean>
  update: (id: string, body: UserCreateInput) => Promise<boolean>
  remove: (id: string) => Promise<void>
}

export function useUsers(): UseUsersResult {
  const { t } = useTranslation()
  const [items, setItems] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await usersApi.list())
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(body: UserCreateInput) {
    setSaving(true)
    try {
      await usersApi.create(body)
      toast.success(t('users.created'))
      await load()
      return true
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }

  async function update(id: string, body: UserCreateInput) {
    setSaving(true)
    try {
      await usersApi.update(id, body)
      toast.success(t('users.updated'))
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
      await usersApi.remove(id)
      toast.success(t('users.deleted'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  return { items, loading, saving, create, update, remove }
}
