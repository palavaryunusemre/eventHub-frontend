import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { AdminLayout } from '../components/AdminLayout'
import { AuditLogContainer } from '../features/audit/AuditLogContainer'

export default function AuditLog() {
  const { t } = useTranslation()
  return (
    <Layout title={t('audit.title')}>
      <AdminLayout active="audit">
        <AuditLogContainer />
      </AdminLayout>
    </Layout>
  )
}
