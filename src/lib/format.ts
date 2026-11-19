import type {
  Bilingual,
  DgaTrack,
  Language,
  MatterPhase,
  VerificationStatus,
} from '../data/types'

export function text(value: Bilingual, language: Language): string {
  return value[language]
}

export function formatDate(value: string, language: Language): string {
  const [year, month, day] = value.slice(0, 10).split('-')
  if (!year || !month || !day) return value
  return language === 'zh'
    ? `${year}年${Number(month)}月${Number(day)}日`
    : `${day}/${month}/${year}`
}

export function formatStatus(status: VerificationStatus, language: Language): string {
  const labels: Record<VerificationStatus, Bilingual> = {
    verified: { zh: '已核验', en: 'Verified' },
    pending_review: { zh: '待复核', en: 'Pending review' },
    located: { zh: '已定位', en: 'Located' },
    not_located: { zh: '未定位到', en: 'Not located' },
  }
  return text(labels[status], language)
}

export function formatTrack(track: DgaTrack, language: Language): string {
  const labels: Record<DgaTrack, Bilingual> = {
    implementation: { zh: '实施程序', en: 'Implementation' },
    intermediation: { zh: '数据中介', en: 'Data intermediation' },
    non_personal_transfer: { zh: '非个人数据出境', en: 'Non-personal data transfer' },
  }
  return text(labels[track], language)
}

export function formatPhase(phase: MatterPhase, language: Language): string {
  const labels: Record<MatterPhase, Bilingual> = {
    formal_notice: { zh: 'formal notice', en: 'Formal notice' },
    reasoned_opinion: { zh: 'reasoned opinion', en: 'Reasoned opinion' },
  }
  return text(labels[phase], language)
}

export function formatCountOrUnknown(value: number | null, language: Language): string {
  if (value === null) return language === 'zh' ? '未定位到' : 'Not located'
  return new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-GB').format(value)
}

export function formatDateRange(start: string, end: string, language: Language): string {
  return `${formatDate(start, language)} — ${formatDate(end, language)}`
}
