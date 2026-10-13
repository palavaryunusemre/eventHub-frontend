import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { registrationsApi, type RegistrationItem } from '../../api/registrations'

export interface UseMyRegistrationsResult {
  items: RegistrationItem[]
  loading: boolean
  cancel: (id: string) => Promise<void>
}

export function useMyRegistrations(): UseMyRegistrationsResult {
  const { t } = useTranslation()
  const [items, setItems] = useState<RegistrationItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await registrationsApi.mine())
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function cancel(id: string) {
    try {
      await registrationsApi.cancel(id)
      toast.success(t('registrations.cancelled'))
      await load()
    } catch {
      // Hata mesajı api/client.ts tarafından toast ile gösteriliyor.
    }
  }

  return { items, loading, cancel }
}
