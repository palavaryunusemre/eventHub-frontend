import { useDashboard } from './useDashboard'
import { DashboardView } from './DashboardView'

export function DashboardContainer() {
  const data = useDashboard()
  return <DashboardView {...data} />
}
