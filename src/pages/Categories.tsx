import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { AdminLayout } from '../components/AdminLayout'
import { CategoriesContainer } from '../features/categories/CategoriesContainer'

export default function Categories() {
  const { t } = useTranslation()
  return (
    <Layout title={t('management.categories')}>
      <AdminLayout active="categories">
        <CategoriesContainer />
      </AdminLayout>
    </Layout>
  )
}
