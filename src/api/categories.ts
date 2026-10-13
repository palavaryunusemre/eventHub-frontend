import { api } from './client'

export interface CategoryItem {
  id: string
  name: string
  slug: string
}

export interface CategoryInput {
  name: string
}

export const categoriesApi = {
  list: () => api.get<CategoryItem[]>('/api/categories'),
  create: (body: CategoryInput) => api.post<void>('/api/categories', body),
  update: (id: string, body: CategoryInput) => api.put<void>(`/api/categories/${encodeURIComponent(id)}`, body),
  remove: (id: string) => api.delete<void>(`/api/categories/${encodeURIComponent(id)}`),
}
