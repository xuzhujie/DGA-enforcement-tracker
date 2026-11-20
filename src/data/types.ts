export type Language = 'zh' | 'en'

export interface Bilingual {
  zh: string
  en: string
}

export type DgaTrack = 'implementation' | 'intermediation' | 'non_personal_transfer'
export type MatterPhase = 'formal_notice' | 'reasoned_opinion'
export type VerificationStatus = 'verified' | 'pending_review' | 'located' | 'not_located'

export interface CountryRef {
  code: string
  flag: string
  name: Bilingual
}

export interface SourceRef {
  id: string
  label: Bilingual
  url: string
  sourceType: Bilingual
  evidenceSnapshot: Bilingual
  lastVerifiedAt: string
}

export interface MatterEvent {
  id: string
  date: string
  label: Bilingual
  description: Bilingual
  phase: MatterPhase
  sourceIds: string[]
}

export interface DgaMatter {
  matter_id: string
  title: Bilingual
  track: 'implementation'
  country: CountryRef
  infr_number: string
  phase: MatterPhase
  first_date: string
  latest_date: string
  status: Bilingual
  statusNote: Bilingual
  summary: Bilingual
  businessImpact: Bilingual
  nextAction: Bilingual
  legalBasis: string[]
  events: MatterEvent[]
  sources: SourceRef[]
  last_verified_at: string
}

export interface IntermediaryRecord {
  id: string
  track: 'intermediation'
  country: CountryRef
  provider: string
  registrationStatus: 'registered'
  sources: SourceRef[]
  last_verified_at: string
}

export interface Article31Case {
  case_id: string
  title: Bilingual
  status: 'located' | 'pending_review'
  date: string | null
  summary: Bilingual
  sources: SourceRef[]
  last_verified_at: string
}

export interface NonPersonalTransferWatch {
  watch_id: string
  track: 'non_personal_transfer'
  article: string
  title: Bilingual
  rule: Bilingual
  status: VerificationStatus
  publicCaseCount: number | null
  cases: Article31Case[]
  scopeNote: Bilingual
  nextAction: Bilingual
  sources: SourceRef[]
  last_verified_at: string
}

export interface AuthoritySnapshot {
  id: string
  country: CountryRef
  competentBody: string[]
  dataIntermediation: string[]
  dataAltruism: string[]
  sourceUpdatedAt: string
  note?: Bilingual
  sources: SourceRef[]
  last_verified_at: string
}

export interface DataAltruismOrganisation {
  id: string
  country: CountryRef
  organisation: string
  status: 'recognised'
  sources: SourceRef[]
  last_verified_at: string
}

export interface ProcedureFollowUp {
  id: string
  matter_id: string
  country: CountryRef
  status: 'located' | 'not_located' | 'pending_review'
  summary: Bilingual
  nextAction: Bilingual
  sources: SourceRef[]
  last_verified_at: string
}

export interface TimelineEvent {
  id: string
  date: string
  label: Bilingual
  description: Bilingual
  kind: 'law' | 'implementation' | 'procedure' | 'registry' | 'review'
  sourceIds: string[]
}

export interface OfficialSource {
  id: string
  label: Bilingual
  url: string
  sourceType: Bilingual
  description: Bilingual
}

export interface UpdateItem {
  title: string
  title_zh?: string
  link: string
  date: string
  summary: string
  summary_zh?: string
}

export interface DgaOverview {
  title: Bilingual
  fullName: Bilingual
  applicableFrom: string
  summary: Bilingual
  sections: Array<{
    label: Bilingual
    body: Bilingual
  }>
  boundaryRows: Array<{
    regulation: Bilingual
    subject: Bilingual
    signal: Bilingual
  }>
}

export interface MatterFilters {
  country: string
  phase: MatterPhase | 'all'
  query: string
}
