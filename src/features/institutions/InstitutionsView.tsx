import { useEffect, useState } from 'react'
import { Form, Input, Modal, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { InstitutionInput, InstitutionItem } from '../../api/institutions'
import type { UseInstitutionsResult } from './useInstitutions'

export function InstitutionsView({ items, loading, saving, create, update, remove }: UseInstitutionsResult) {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<InstitutionItem | null>(null)
  const [form] = Form.useForm<InstitutionInput>()

  useEffect(() => {
    if (!modalOpen) return
    form.setFieldsValue(editing ?? { name: '', emailDomain: '', type: 'UNIVERSITY' })
  }, [modalOpen, editing, form])

  async function handleOk() {
    const values = await form.validateFields()
    const ok = editing ? await update(editing.id, values) : await create(values)
    if (ok) setModalOpen(false)
  }

  function confirmDelete(institution: InstitutionItem) {
    Modal.confirm({
      title: t('institutions.confirmDelete'),
      content: institution.name,
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: () => remove(institution.id),
    })
  }

  const columns: ColumnsType<InstitutionItem> = [
    { title: t('institutions.name'), dataIndex: 'name' },
    { title: t('institutions.emailDomain'), dataIndex: 'emailDomain' },
    { title: t('institutions.type'), dataIndex: 'type' },
    {
      title: '',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: InstitutionItem) => (
        <div className="row-actions">
          <button className="link-btn" onClick={() => { setEditing(record); setModalOpen(true) }}>{t('common.edit')}</button>
          <button className="link-btn link-btn--danger" onClick={() => confirmDelete(record)}>{t('common.delete')}</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-toolbar">
        <span className="page-toolbar-spacer" />
        <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}><PlusOutlined /> {t('institutions.add')}</button>
      </div>
      <div className="page-table-wrap">
        <Table columns={columns} dataSource={items} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: t('institutions.noRecords') }} />
      </div>
      <Modal
        title={editing ? t('institutions.editTitle') : t('institutions.newTitle')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        confirmLoading={saving}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('institutions.name')} rules={[{ required: true, message: t('common.required') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="emailDomain" label={t('institutions.emailDomain')} rules={[{ required: true, message: t('common.required') }]}>
            <Input placeholder="ogrenci.xxx.edu.tr" />
          </Form.Item>
          <Form.Item name="type" label={t('institutions.type')} rules={[{ required: true }]}>
            <Select options={[
              { label: 'UNIVERSITY', value: 'UNIVERSITY' },
              { label: 'COMPANY', value: 'COMPANY' },
              { label: 'NGO', value: 'NGO' },
              { label: 'OTHER', value: 'OTHER' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
