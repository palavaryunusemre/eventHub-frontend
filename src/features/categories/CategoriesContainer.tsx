import { useCategories } from './useCategories'
import { CategoriesView } from './CategoriesView'

export function CategoriesContainer() {
  const data = useCategories()
  return <CategoriesView {...data} />
}
