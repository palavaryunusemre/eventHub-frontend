import { useParams } from 'react-router-dom'
import { useEventDetail } from './useEventDetail'
import { EventDetailView } from './EventDetailView'

export function EventDetailContainer() {
  const { id } = useParams<{ id: string }>()
  const data = useEventDetail(id)
  return <EventDetailView {...data} />
}
