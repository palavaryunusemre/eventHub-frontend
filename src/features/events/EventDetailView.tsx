import { Spin, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import type { UseEventDetailResult } from './useEventDetail'

export function EventDetailView({ event, loading, registering, register, submitForReview, remove }: UseEventDetailResult) {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (loading) return <Spin />
  if (!event) return <p>{t('events.notFound')}</p>

  const isOwner = user?.id === event.organizerId
  const canEdit = isOwner && (event.status === 'DRAFT' || event.status === 'REJECTED')

  return (
    <div className="event-detail">
      {event.coverImageUrl && <img className="event-detail-cover" src={event.coverImageUrl} alt={event.title} />}
      <div className="event-detail-header">
        <h1>{event.title}</h1>
        <Tag color={event.status === 'PUBLISHED' ? 'green' : event.status === 'REJECTED' ? 'red' : 'default'}>
          {t(`events.status.${event.status}`)}
        </Tag>
      </div>

      <div className="event-detail-meta">
        <span>{new Date(event.startAt).toLocaleString(i18n.language)} — {new Date(event.endAt).toLocaleString(i18n.language)}</span>
        <span>{event.format === 'ONLINE' ? t('events.online') : event.location}</span>
        {event.categoryName && <span>{event.categoryName}</span>}
        {event.capacity != null && <span>{t('events.capacity', { count: event.capacity })}</span>}
      </div>

      <p className="event-detail-description">{event.description}</p>

      {event.rejectionReason && (
        <p className="event-detail-rejection">{t('events.rejectionReason')}: {event.rejectionReason}</p>
      )}

      <div className="event-detail-actions">
        {!isOwner && event.status === 'PUBLISHED' && (
          <button className="btn-primary" onClick={register} disabled={registering}>
            {registering ? t('events.registering') : t('events.register')}
          </button>
        )}
        {canEdit && (
          <>
            <button className="btn-secondary" onClick={() => navigate(`/events/${event.id}/edit`)}>{t('common.edit')}</button>
            {event.status === 'DRAFT' && (
              <button className="btn-primary" onClick={submitForReview}>{t('events.submitForReview')}</button>
            )}
            <button
              className="btn-secondary"
              onClick={async () => { if (await remove()) navigate('/') }}
            >
              {t('common.delete')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
