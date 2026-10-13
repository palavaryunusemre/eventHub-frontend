import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { AdminLayout } from '../components/AdminLayout'
import { EventReviewContainer } from '../features/admin/EventReviewContainer'

export default function AdminEventReview() {
  const { t } = useTranslation()
  return (
    <Layout title={t('management.review')}>
      <AdminLayout active="review">
        <EventReviewContainer />
      </AdminLayout>
    </Layout>
  )
}
