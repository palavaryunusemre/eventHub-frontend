import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { MyCertificatesContainer } from '../features/certificates/MyCertificatesContainer'

export default function MyCertificates() {
  const { t } = useTranslation()
  return (
    <Layout title={t('nav.myCertificates')}>
      <MyCertificatesContainer />
    </Layout>
  )
}
