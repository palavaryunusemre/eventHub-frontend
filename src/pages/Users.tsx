import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { AdminLayout } from '../components/AdminLayout'
import { UsersContainer } from '../features/users/UsersContainer'

export default function Users() {
  const { t } = useTranslation()
  return (
    <Layout title={t('management.users')}>
      <AdminLayout active="users">
        <UsersContainer />
      </AdminLayout>
    </Layout>
  )
}
