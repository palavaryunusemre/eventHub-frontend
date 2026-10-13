import { Modal, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RegistrationItem } from '../../api/registrations'
import type { UseMyRegistrationsResult } from './useMyRegistrations'

export function MyRegistrationsView({ items, loading, cancel }: UseMyRegistrationsResult) {
  const { t, i18n } = useTranslation()
  const [qrFor, setQrFor] = useState<RegistrationItem | null>(null)

  const columns: ColumnsType<RegistrationItem> = [
    { title: t('registrations.event'), dataIndex: 'eventTitle' },
    { title: t('registrations.startAt'), dataIndex: 'eventStartAt', render: (v: string) => new Date(v).toLocaleString(i18n.language) },
    { title: t('registrations.status'), dataIndex: 'status', render: (v: string) => <Tag>{t(`registrations.status.${v}`)}</Tag> },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: RegistrationItem) => (
        <div className="row-actions">
          <button className="link-btn" onClick={() => setQrFor(record)}>{t('registrations.showQr')}</button>
          {record.status === 'REGISTERED' && (
            <button className="link-btn link-btn--danger" onClick={() => cancel(record.id)}>{t('registrations.cancel')}</button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-table-wrap">
        <Table columns={columns} dataSource={items} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: t('registrations.noRecords') }} />
      </div>
      <Modal title={t('registrations.qrTitle')} open={!!qrFor} onCancel={() => setQrFor(null)} footer={null}>
        {qrFor && (
          <div style={{ textAlign: 'center' }}>
            <QRCodeSVG value={qrFor.qrToken} size={220} />
            <p>{qrFor.eventTitle}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
