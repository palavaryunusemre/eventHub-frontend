import { Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { EventCard } from '../../components/EventCard'
import type { UseEventsResult } from './useEvents'

export function EventsView({ items, categories, loading, filters, setFilters }: UseEventsResult) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="page-toolbar">
        <Select
          allowClear
          placeholder={t('events.allCategories')}
          style={{ width: 220 }}
          value={filters.category || undefined}
          onChange={(value) => setFilters({ ...filters, category: value ?? '' })}
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
        />
        <Select
          allowClear
          placeholder={t('events.allVisibility')}
          style={{ width: 220 }}
          value={filters.visibility || undefined}
          onChange={(value) => setFilters({ ...filters, visibility: value ?? '' })}
          options={[
            { label: t('events.visibilityPublic'), value: 'PUBLIC' },
            { label: t('events.visibilityInstitution'), value: 'INSTITUTION_ONLY' },
          ]}
        />
      </div>

      {loading ? (
        <Spin />
      ) : items.length === 0 ? (
        <p>{t('events.noRecords')}</p>
      ) : (
        <div className="event-grid">
          {items.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  )
}
