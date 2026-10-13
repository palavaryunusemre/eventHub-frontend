import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { MyRegistrationsContainer } from '../features/registrations/MyRegistrationsContainer'

export default function MyRegistrations() {
  const { t } = useTranslation()
  return (
    <Layout title={t('nav.myRegistrations')}>
      <MyRegistrationsContainer />
    </Layout>
  )
}
