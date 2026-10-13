import { useAuditLog } from './useAuditLog'
import { AuditLogView } from './AuditLogView'

export function AuditLogContainer() {
  const data = useAuditLog()
  return <AuditLogView {...data} />
}
