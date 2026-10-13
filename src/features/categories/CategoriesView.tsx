import { useEffect, useState } from 'react'
import { Form, Input, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { CategoryItem } from '../../api/categories'
import type { UseCategoriesResult } from './useCategories'

export function CategoriesView({ items, loading, saving, create, update, remove }: UseCategoriesResult) {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryItem | null>(null)
  const [form] = Form.useForm<{ name: string }>()

  useEffect(() => {
    if (!modalOpen) return
    form.setFieldsValue({ name: editing?.name ?? '' })
  }, [modalOpen, editing, form])

  async function handleOk() {
    const values = await form.validateFields()
    const ok = editing ? await update(editing.id, values.name) : await create(values.name)
    if (ok) setModalOpen(false)
  }

  function confirmDelete(category: CategoryItem) {
    Modal.confirm({
      title: t('categories.confirmDelete'),
      content: category.name,
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: () => remove(category.id),
    })
  }

  const columns: ColumnsType<CategoryItem> = [
    { title: t('categories.name'), dataIndex: 'name' },
    { title: t('categories.slug'), dataIndex: 'slug' },
    {
      title: '',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: CategoryItem) => (
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
        <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}><PlusOutlined /> {t('categories.add')}</button>
      </div>
      <div className="page-table-wrap">
        <Table columns={columns} dataSource={items} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: t('categories.noRecords') }} />
      </div>
      <Modal
        title={editing ? t('categories.editTitle') : t('categories.newTitle')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        confirmLoading={saving}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('categories.name')} rules={[{ required: true, message: t('common.required') }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
