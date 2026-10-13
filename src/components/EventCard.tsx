import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons'
import type { EventSummaryItem } from '../api/events'
import './EventCard.css'

export function EventCard({ event }: { event: EventSummaryItem }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const dateLabel = new Date(event.startAt).toLocaleString(i18n.language, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className="event-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/events/${event.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/events/${event.id}`) }}
    >
      <div className="event-card-cover" style={event.coverImageUrl ? { backgroundImage: `url(${event.coverImageUrl})` } : undefined}>
        {!event.coverImageUrl && <span>{event.title.slice(0, 1).toUpperCase()}</span>}
      </div>
      <div className="event-card-body">
        {event.categoryName && <span className="event-card-category">{event.categoryName}</span>}
        <h3 className="event-card-title">{event.title}</h3>
        <div className="event-card-meta">
          <span><CalendarOutlined /> {dateLabel}</span>
          {event.format === 'ONLINE' ? (
            <span><GlobalOutlined /> {t('events.online')}</span>
          ) : (
            <span><EnvironmentOutlined /> {event.location ?? t('events.inPerson')}</span>
          )}
        </div>
      </div>
    </div>
  )
}
