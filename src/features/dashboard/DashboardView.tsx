import { useTranslation } from 'react-i18next'
import { CalendarOutlined, SafetyCertificateOutlined, FileDoneOutlined } from '@ant-design/icons'
import { SummaryCard } from '../../components/SummaryCard'
import { EventCard } from '../../components/EventCard'
import { useRole } from '../../hooks/useRole'
import type { UseDashboardResult } from './useDashboard'

export function DashboardView({ loading, upcomingCount, certificateCount, pendingReviewCount, recentEvents }: UseDashboardResult) {
  const { t } = useTranslation()
  const { canManage } = useRole()

  return (
    <div>
      <div className="summary-grid">
        <SummaryCard icon={<CalendarOutlined />} label={t('dashboard.upcomingRegistrations')} value={upcomingCount} accent="primary" />
        <SummaryCard icon={<SafetyCertificateOutlined />} label={t('dashboard.certificates')} value={certificateCount} accent="success" />
        {canManage && (
          <SummaryCard icon={<FileDoneOutlined />} label={t('dashboard.pendingReview')} value={pendingReviewCount} accent="warning" />
        )}
      </div>

      <h2>{t('dashboard.recentEvents')}</h2>
      {!loading && (
        <div className="event-grid">
          {recentEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  )
}
