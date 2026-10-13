import { useEventReview } from './useEventReview'
import { EventReviewView } from './EventReviewView'

export function EventReviewContainer() {
  const data = useEventReview()
  return <EventReviewView {...data} />
}
