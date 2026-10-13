import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { EventDetailContainer } from '../features/events/EventDetailContainer'

export default function EventDetail() {
  const { t } = useTranslation()
  return (
    <Layout title={t('events.detailTitle')}>
      <EventDetailContainer />
    </Layout>
  )
}
