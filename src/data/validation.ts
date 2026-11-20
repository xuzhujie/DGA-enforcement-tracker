import type {
  AuthoritySnapshot,
  DataAltruismOrganisation,
  DgaMatter,
  IntermediaryRecord,
  NonPersonalTransferWatch,
  ProcedureFollowUp,
} from './types'

export interface RegistryValidationInput {
  matters: DgaMatter[]
  intermediaries: IntermediaryRecord[]
  transferWatch: NonPersonalTransferWatch[]
  authorities: AuthoritySnapshot[]
  organisations: DataAltruismOrganisation[]
  followUps: ProcedureFollowUp[]
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/

function addDuplicateErrors<T>(items: T[], getId: (item: T) => string, label: string, errors: string[]): void {
  const counts = new Map<string, number>()
  items.forEach((item) => counts.set(getId(item), (counts.get(getId(item)) ?? 0) + 1))
  counts.forEach((count, id) => {
    if (count > 1) errors.push('duplicate ' + label + ' id: ' + id)
  })
}

function validateSources(owner: string, sources: Array<{ url: string; lastVerifiedAt?: string; last_verified_at?: string }>, errors: string[]): void {
  if (!sources.length) errors.push(owner + ' has no source')
  sources.forEach((source) => {
    if (!source.url.trim()) errors.push(owner + ' source URL is empty')
    const verifiedAt = source.lastVerifiedAt ?? source.last_verified_at
    if (!verifiedAt || !ISO_DATE.test(verifiedAt)) errors.push(owner + ' has invalid verification date')
  })
}

export function validateRegistry(input: RegistryValidationInput): string[] {
  const errors: string[] = []
  addDuplicateErrors(input.matters, (item) => item.matter_id, 'matter', errors)
  addDuplicateErrors(input.intermediaries, (item) => item.id, 'intermediary', errors)
  addDuplicateErrors(input.authorities, (item) => item.id, 'authority', errors)
  addDuplicateErrors(input.organisations, (item) => item.id, 'organisation', errors)
  addDuplicateErrors(input.followUps, (item) => item.id, 'follow-up', errors)

  const matterIds = new Set(input.matters.map((item) => item.matter_id))
  input.matters.forEach((matter) => validateSources('matter ' + matter.matter_id, matter.sources, errors))
  input.intermediaries.forEach((item) => validateSources('intermediary ' + item.id, item.sources, errors))
  input.authorities.forEach((item) => validateSources('authority ' + item.id, item.sources, errors))
  input.organisations.forEach((item) => validateSources('organisation ' + item.id, item.sources, errors))
  input.followUps.forEach((item) => {
    validateSources('follow-up ' + item.id, item.sources, errors)
    if (!matterIds.has(item.matter_id)) errors.push('follow-up matter does not exist: ' + item.matter_id)
  })

  input.transferWatch.forEach((item) => {
    validateSources('transfer watch ' + item.watch_id, item.sources, errors)
    item.cases.forEach((caseItem) => validateSources('Article 31 case ' + caseItem.case_id, caseItem.sources, errors))
    if (item.status === 'not_located' && (item.publicCaseCount !== null || item.cases.length > 0)) {
      errors.push('Article 31 not_located item cannot have a numeric count or located cases: ' + item.watch_id)
    }
    if (item.status === 'located' && item.publicCaseCount !== item.cases.filter((caseItem) => caseItem.status === 'located').length) {
      errors.push('Article 31 located count does not match cases: ' + item.watch_id)
    }
  })

  return errors
}
