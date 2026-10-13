import { useEffect } from 'react'
import { Form, Input, InputNumber, Select, Switch, DatePicker, Spin } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import type { EventInput } from '../../api/events'
import type { UseEventFormResult } from './useEventForm'

const { RangePicker } = DatePicker

export function EventFormView({ event, categories, institutions, loading, saving, isEdit, submit }: UseEventFormResult) {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (!event) return
    form.setFieldsValue({
      title: event.title,
      description: event.description,
      coverImageUrl: event.coverImageUrl,
      categoryId: event.categoryId,
      visibility: event.visibility,
      allowedInstitutionIds: event.allowedInstitutionIds,
      format: event.format,
      location: event.location,
      onlineUrl: event.onlineUrl,
      range: [dayjs(event.startAt), dayjs(event.endAt)],
      capacity: event.capacity,
      certificateEnabled: event.certificateEnabled,
    })
  }, [event, form])

  async function handleFinish(values: Record<string, unknown>) {
    const [startAt, endAt] = values.range as [dayjs.Dayjs, dayjs.Dayjs]
    const input: EventInput = {
      title: values.title as string,
      description: values.description as string,
      coverImageUrl: (values.coverImageUrl as string) || null,
      categoryId: (values.categoryId as string) || null,
      visibility: values.visibility as EventInput['visibility'],
      allowedInstitutionIds: (values.allowedInstitutionIds as string[]) ?? [],
      format: values.format as EventInput['format'],
      location: (values.location as string) || null,
      onlineUrl: (values.onlineUrl as string) || null,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      capacity: (values.capacity as number) || null,
      certificateEnabled: !!values.certificateEnabled,
    }
    await submit(input)
  }

  if (loading) return <Spin />

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ visibility: 'PUBLIC', format: 'IN_PERSON', certificateEnabled: false }}>
      <Form.Item name="title" label={t('events.form.title')} rules={[{ required: true, message: t('common.required') }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label={t('events.form.description')} rules={[{ required: true, message: t('common.required') }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="coverImageUrl" label={t('events.form.coverImageUrl')}>
        <Input />
      </Form.Item>
      <Form.Item name="categoryId" label={t('events.form.category')}>
        <Select allowClear options={categories.map((c) => ({ label: c.name, value: c.id }))} />
      </Form.Item>
      <Form.Item name="format" label={t('events.form.format')} rules={[{ required: true }]}>
        <Select options={[
          { label: t('events.formatOnline'), value: 'ONLINE' },
          { label: t('events.formatInPerson'), value: 'IN_PERSON' },
          { label: t('events.formatHybrid'), value: 'HYBRID' },
        ]} />
      </Form.Item>
      <Form.Item name="location" label={t('events.form.location')}>
        <Input />
      </Form.Item>
      <Form.Item name="onlineUrl" label={t('events.form.onlineUrl')}>
        <Input />
      </Form.Item>
      <Form.Item name="range" label={t('events.form.dateRange')} rules={[{ required: true, message: t('common.required') }]}>
        <RangePicker showTime style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="capacity" label={t('events.form.capacity')}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="visibility" label={t('events.form.visibility')} rules={[{ required: true }]}>
        <Select options={[
          { label: t('events.visibilityPublic'), value: 'PUBLIC' },
          { label: t('events.visibilityInstitution'), value: 'INSTITUTION_ONLY' },
        ]} />
      </Form.Item>
      <Form.Item name="allowedInstitutionIds" label={t('events.form.allowedInstitutions')}>
        <Select mode="multiple" options={institutions.map((i) => ({ label: i.name, value: i.id }))} />
      </Form.Item>
      <Form.Item name="certificateEnabled" label={t('events.form.certificateEnabled')} valuePropName="checked">
        <Switch />
      </Form.Item>
      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? t('common.saving') : isEdit ? t('common.save') : t('events.form.create')}
      </button>
    </Form>
  )
}
