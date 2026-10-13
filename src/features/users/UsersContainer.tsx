import { useUsers } from './useUsers'
import { UsersView } from './UsersView'

export function UsersContainer() {
  const data = useUsers()
  return <UsersView {...data} />
}
