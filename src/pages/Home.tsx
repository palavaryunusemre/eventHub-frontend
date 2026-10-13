import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { DashboardContainer } from '../features/dashboard/DashboardContainer'
import { EventsContainer } from '../features/events/EventsContainer'

export default function Home() {
  const { t } = useTranslation()
  return (
    <Layout title={t('nav.events')}>
      <DashboardContainer />
      <h2>{t('events.discover')}</h2>
      <EventsContainer />
    </Layout>
  )
}
