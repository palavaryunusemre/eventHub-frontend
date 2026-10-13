import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import type { AuditLogItem } from '../../api/audit'
import type { UseAuditLogResult } from './useAuditLog'

export function AuditLogView({ items, pageInfo, loading, page, setPage }: UseAuditLogResult) {
  const { t, i18n } = useTranslation()

  const columns: ColumnsType<AuditLogItem> = [
    { title: t('audit.time'), dataIndex: 'createdAt', render: (v: string) => new Date(v).toLocaleString(i18n.language) },
    { title: t('audit.action'), dataIndex: 'action' },
    { title: t('audit.targetType'), dataIndex: 'targetType' },
    { title: t('audit.user'), dataIndex: 'performedByEmail' },
    { title: t('audit.detail'), dataIndex: 'details' },
  ]

  return (
    <div className="page-table-wrap">
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        size="small"
        locale={{ emptyText: t('audit.noRecords') }}
        pagination={{
          current: page,
          total: pageInfo?.totalElements ?? 0,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
