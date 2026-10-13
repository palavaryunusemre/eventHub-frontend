import { useTranslation } from 'react-i18next'
import { Descriptions } from 'antd'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <Layout title={t('profile.title')}>
      <Descriptions column={1} bordered size="small" style={{ maxWidth: 480 }}>
        <Descriptions.Item label={t('users.fullName')}>{user?.fullName}</Descriptions.Item>
        <Descriptions.Item label={t('users.email')}>{user?.email}</Descriptions.Item>
        <Descriptions.Item label={t('users.role')}>{user?.role}</Descriptions.Item>
      </Descriptions>
    </Layout>
  )
}
