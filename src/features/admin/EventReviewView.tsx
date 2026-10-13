import { useState } from 'react'
import { Modal, Table, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import type { EventItem } from '../../api/events'
import type { UseEventReviewResult } from './useEventReview'

export function EventReviewView({ items, loading, approve, reject }: UseEventReviewResult) {
  const { t, i18n } = useTranslation()
  const [rejecting, setRejecting] = useState<EventItem | null>(null)
  const [reason, setReason] = useState('')

  const columns: ColumnsType<EventItem> = [
    { title: t('admin.event'), dataIndex: 'title' },
    { title: t('admin.organizer'), dataIndex: 'organizerName' },
    { title: t('admin.startAt'), dataIndex: 'startAt', render: (v: string) => new Date(v).toLocaleString(i18n.language) },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: EventItem) => (
        <div className="row-actions">
          <button className="link-btn" onClick={() => approve(record.id)}>{t('admin.approve')}</button>
          <button className="link-btn link-btn--danger" onClick={() => { setRejecting(record); setReason('') }}>{t('admin.reject')}</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-table-wrap">
        <Table columns={columns} dataSource={items} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: t('admin.noRecords') }} />
      </div>
      <Modal
        title={t('admin.rejectTitle')}
        open={!!rejecting}
        onCancel={() => setRejecting(null)}
        onOk={async () => { if (rejecting) { await reject(rejecting.id, reason); setRejecting(null) } }}
        okText={t('admin.reject')}
        cancelText={t('common.cancel')}
      >
        <Input.TextArea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('admin.rejectReasonPlaceholder')} />
      </Modal>
    </div>
  )
}
