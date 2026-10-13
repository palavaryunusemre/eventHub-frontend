import { useParams } from 'react-router-dom'
import { useEventForm } from './useEventForm'
import { EventFormView } from './EventFormView'

export function EventFormContainer() {
  const { id } = useParams<{ id: string }>()
  const data = useEventForm(id)
  return <EventFormView {...data} />
}
