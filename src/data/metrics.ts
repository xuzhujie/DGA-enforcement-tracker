import type {
  AuthoritySnapshot,
  DataAltruismOrganisation,
  DgaMatter,
  IntermediaryRecord,
  MatterFilters,
  MatterPhase,
  NonPersonalTransferWatch,
  ProcedureFollowUp,
} from './types'

export interface DashboardMetrics {
  formalNoticeMatterCount: number
  reasonedOpinionCount: number
  intermediaryCount: number
  article31Status: NonPersonalTransferWatch['status']
  article31PublicCaseCount: number | null
}

export interface MatterMetrics {
  matterCount: number
  formalNoticeCount: number
  reasonedOpinionCount: number
  countries: number
}

export interface IntermediaryMetrics {
  providerCount: number
  countryCount: number
}

export interface GovernanceMetrics {
  authorityCountryCount: number
  dataAltruismOrganisationCount: number
  dataAltruismCountryCount: number
  followUpReviewCount: number
  article31LocatedCaseCount: number
}

export function getDashboardMetrics(
  matters: DgaMatter[],
  intermediaries: IntermediaryRecord[],
  transferWatch: NonPersonalTransferWatch[],
): DashboardMetrics {
  const article31 = transferWatch.find((item) => item.article === 'Article 31')
  return {
    formalNoticeMatterCount: matters.filter((matter) => matter.events.some((event) => event.phase === 'formal_notice')).length,
    reasonedOpinionCount: matters.filter((matter) => matter.phase === 'reasoned_opinion').length,
    intermediaryCount: intermediaries.length,
    article31Status: article31?.status ?? 'not_located',
    article31PublicCaseCount: article31?.publicCaseCount ?? null,
  }
}

export function getMatterMetrics(matters: DgaMatter[]): MatterMetrics {
  return {
    matterCount: matters.length,
    formalNoticeCount: matters.filter((matter) => matter.events.some((event) => event.phase === 'formal_notice')).length,
    reasonedOpinionCount: matters.filter((matter) => matter.phase === 'reasoned_opinion').length,
    countries: new Set(matters.map((matter) => matter.country.code)).size,
  }
}

export function getIntermediaryMetrics(intermediaries: IntermediaryRecord[]): IntermediaryMetrics {
  return {
    providerCount: intermediaries.length,
    countryCount: new Set(intermediaries.map((item) => item.country.code)).size,
  }
}

export function getGovernanceMetrics(
  authorities: AuthoritySnapshot[],
  organisations: DataAltruismOrganisation[],
  followUps: ProcedureFollowUp[],
  transferWatch: NonPersonalTransferWatch[],
): GovernanceMetrics {
  return {
    authorityCountryCount: new Set(authorities.map((item) => item.country.code)).size,
    dataAltruismOrganisationCount: organisations.length,
    dataAltruismCountryCount: new Set(organisations.map((item) => item.country.code)).size,
    followUpReviewCount: followUps.length,
    article31LocatedCaseCount: transferWatch.reduce((total, item) => total + item.cases.filter((item) => item.status === 'located').length, 0),
  }
}

export function dedupeMatters(matters: DgaMatter[]): DgaMatter[] {
  const seen = new Set<string>()
  return matters.filter((matter) => {
    if (seen.has(matter.matter_id)) return false
    seen.add(matter.matter_id)
    return true
  })
}

function includesQuery(matter: DgaMatter, query: string): boolean {
  if (!query.trim()) return true
  const haystack = [
    matter.matter_id,
    matter.infr_number,
    matter.title.zh,
    matter.title.en,
    matter.country.name.zh,
    matter.country.name.en,
    matter.status.zh,
    matter.status.en,
    matter.summary.zh,
    matter.summary.en,
  ].join(' ').toLocaleLowerCase()
  return haystack.includes(query.trim().toLocaleLowerCase())
}

export function filterMatters(matters: DgaMatter[], filters: MatterFilters): DgaMatter[] {
  return matters.filter((matter) => {
    const countryMatch = filters.country === 'all' || matter.country.code === filters.country
    const phaseMatch = filters.phase === 'all' || matter.phase === filters.phase
    return countryMatch && phaseMatch && includesQuery(matter, filters.query)
  })
}

export function filterIntermediaries(
  intermediaries: IntermediaryRecord[],
  filters: { country: string; query: string },
): IntermediaryRecord[] {
  const query = filters.query.trim().toLocaleLowerCase()
  return intermediaries.filter((item) => {
    const countryMatch = filters.country === 'all' || item.country.code === filters.country
    const queryMatch = !query || `${item.provider} ${item.country.name.zh} ${item.country.name.en}`.toLocaleLowerCase().includes(query)
    return countryMatch && queryMatch
  })
}

export function phaseCount(matters: DgaMatter[], phase: MatterPhase): number {
  return matters.filter((matter) => matter.phase === phase).length
}
