import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { EventCard } from './EventCard'
import type { EventItem } from '../api/events'
import i18n from '../i18n/i18n'

// @ant-design/icons, iki tonlu ikon desteği için @ant-design/colors'ın ESM
// alt modüllerini doğrudan require() ile çağırıyor — bu, Vitest'in Node
// (CJS) ortamında "Cannot use import statement outside a module" hatası
// verir. Test amacıyla ikon bileşenlerini basit stub'larla değiştiriyoruz.
vi.mock('@ant-design/icons', () => ({
  CalendarOutlined: () => <span data-testid="icon-calendar" />,
  EnvironmentOutlined: () => <span data-testid="icon-environment" />,
  GlobalOutlined: () => <span data-testid="icon-global" />,
}))

const baseEvent: EventItem = {
  id: 'evt-1',
  title: 'React Summit',
  slug: 'react-summit',
  description: 'A great conference',
  coverImageUrl: null,
  categoryId: 'cat-1',
  categoryName: 'Tech',
  organizerId: 'user-1',
  organizerName: 'Jane Doe',
  visibility: 'PUBLIC',
  allowedInstitutionIds: [],
  format: 'IN_PERSON',
  location: 'Istanbul',
  onlineUrl: null,
  startAt: '2026-11-01T10:00:00.000Z',
  endAt: '2026-11-01T12:00:00.000Z',
  capacity: 100,
  registeredCount: 10,
  status: 'PUBLISHED',
  certificateEnabled: true,
  rejectionReason: null,
  reviewedById: null,
  reviewedAt: null,
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
}

function renderWithRouter(event: EventItem) {
  return render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>,
  )
}

describe('EventCard', () => {
  it('renders the event title and category', () => {
    renderWithRouter(baseEvent)
    expect(screen.getByText('React Summit')).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('shows the in-person location when format is not online', () => {
    renderWithRouter(baseEvent)
    expect(screen.getByText('Istanbul')).toBeInTheDocument()
  })

  it('shows the online label when format is ONLINE', () => {
    renderWithRouter({ ...baseEvent, format: 'ONLINE' })
    expect(screen.getByText(i18n.getFixedT('en')('events.online'))).toBeInTheDocument()
  })

  it('is clickable without throwing', () => {
    renderWithRouter(baseEvent)
    expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow()
  })
})
