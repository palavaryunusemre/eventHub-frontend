import { useEffect, useState } from 'react'
import { Form, Input, Modal, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { UserCreateInput, UserItem } from '../../api/users'
import type { UseUsersResult } from './useUsers'

export function UsersView({ items, loading, saving, create, update, remove }: UseUsersResult) {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserItem | null>(null)
  const [form] = Form.useForm<UserCreateInput>()

  useEffect(() => {
    if (!modalOpen) return
    form.setFieldsValue(editing ? { ...editing, password: undefined } : { email: '', firstName: '', lastName: '', role: 'USER' })
  }, [modalOpen, editing, form])

  async function handleOk() {
    const values = await form.validateFields()
    const ok = editing ? await update(editing.id, values) : await create(values)
    if (ok) setModalOpen(false)
  }

  function confirmDelete(user: UserItem) {
    Modal.confirm({
      title: t('users.confirmDelete'),
      content: user.email,
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: () => remove(user.id),
    })
  }

  const columns: ColumnsType<UserItem> = [
    { title: t('users.email'), dataIndex: 'email' },
    { title: t('users.firstName'), dataIndex: 'firstName' },
    { title: t('users.lastName'), dataIndex: 'lastName' },
    { title: t('users.role'), dataIndex: 'role' },
    {
      title: '',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: UserItem) => (
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
        <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}><PlusOutlined /> {t('users.add')}</button>
      </div>
      <div className="page-table-wrap">
        <Table columns={columns} dataSource={items} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: t('users.noRecords') }} />
      </div>
      <Modal
        title={editing ? t('users.editTitle') : t('users.newTitle')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        confirmLoading={saving}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="email" label={t('users.email')} rules={[{ required: true, type: 'email', message: t('users.invalidEmail') }]}>
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="firstName" label={t('users.firstName')} rules={[{ required: true, message: t('common.required') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t('users.lastName')} rules={[{ required: true, message: t('common.required') }]}>
            <Input />
          </Form.Item>
          {!editing && (
            <Form.Item name="password" label={t('users.password')} rules={[{ required: true }, { min: 8, max: 16, message: t('common.passwordLength') }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="role" label={t('users.role')} rules={[{ required: true }]}>
            <Select options={[
              { label: t('users.roleUser'), value: 'USER' },
              { label: t('users.roleAdmin'), value: 'ADMIN' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
