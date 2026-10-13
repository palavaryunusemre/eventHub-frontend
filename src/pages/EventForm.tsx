import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { EventFormContainer } from '../features/events/EventFormContainer'

export default function EventForm() {
  const { t } = useTranslation()
  return (
    <Layout title={t('events.form.title')}>
      <EventFormContainer />
    </Layout>
  )
}
