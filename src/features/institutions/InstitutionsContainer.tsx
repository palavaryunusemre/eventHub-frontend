import { useInstitutions } from './useInstitutions'
import { InstitutionsView } from './InstitutionsView'

export function InstitutionsContainer() {
  const data = useInstitutions()
  return <InstitutionsView {...data} />
}
