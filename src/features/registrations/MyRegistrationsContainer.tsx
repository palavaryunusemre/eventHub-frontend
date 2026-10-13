import { useMyRegistrations } from './useMyRegistrations'
import { MyRegistrationsView } from './MyRegistrationsView'

export function MyRegistrationsContainer() {
  const data = useMyRegistrations()
  return <MyRegistrationsView {...data} />
}
