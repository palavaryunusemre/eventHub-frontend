import { useEvents } from './useEvents'
import { EventsView } from './EventsView'

export function EventsContainer() {
  const data = useEvents()
  return <EventsView {...data} />
}
