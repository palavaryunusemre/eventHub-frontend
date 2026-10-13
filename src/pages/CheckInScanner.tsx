import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { CheckInScannerContainer } from '../features/checkin/CheckInScannerContainer'

export default function CheckInScanner() {
  const { t } = useTranslation()
  return (
    <Layout title={t('nav.checkin')}>
      <CheckInScannerContainer />
    </Layout>
  )
}
