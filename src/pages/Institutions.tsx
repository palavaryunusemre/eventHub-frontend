import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { AdminLayout } from '../components/AdminLayout'
import { InstitutionsContainer } from '../features/institutions/InstitutionsContainer'

export default function Institutions() {
  const { t } = useTranslation()
  return (
    <Layout title={t('management.institutions')}>
      <AdminLayout active="institutions">
        <InstitutionsContainer />
      </AdminLayout>
    </Layout>
  )
}
