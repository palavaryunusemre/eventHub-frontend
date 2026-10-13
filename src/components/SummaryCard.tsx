import type { ReactNode } from 'react'
import './SummaryCard.css'

export type SummaryAccent = 'primary' | 'success' | 'warning' | 'danger'

export interface SummaryCardProps {
  icon: ReactNode
  label: string
  value: ReactNode
  accent?: SummaryAccent
  sub?: string
}

/** Dashboard özet kartı — yalnızca prop alır, veri çekmez (sunum bileşeni). */
export function SummaryCard({ icon, label, value, accent = 'primary', sub }: SummaryCardProps) {
  return (
    <div className={`summary-card summary-card--${accent}`}>
      <div className="summary-card-icon">{icon}</div>
      <div className="summary-card-body">
        <span className="summary-card-label">{label}</span>
        <span className="summary-card-value">{value}</span>
        {sub && <span className="summary-card-sub">{sub}</span>}
      </div>
    </div>
  )
}
