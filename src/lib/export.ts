import type {
  DgaMatter,
  DgaOverview,
  IntermediaryRecord,
  Language,
  MatterFilters,
  NonPersonalTransferWatch,
} from '../data/types'
import { formatDate, formatPhase, formatStatus, formatTrack, text } from './format'

export type ExportTrack = 'implementation' | 'intermediation' | 'article31'

export interface MatterViewExportInput {
  language: Language
  track: ExportTrack
  matters: DgaMatter[]
  intermediaries: IntermediaryRecord[]
  transferWatch: NonPersonalTransferWatch[]
  filters: MatterFilters
  overview: DgaOverview
}

export function exportMatterViewJson(input: MatterViewExportInput): string {
  return JSON.stringify({
    exported_at: new Date().toISOString(),
    language: input.language,
    track: input.track,
    filters: input.filters,
    overview: input.overview,
    matters: input.matters,
    intermediaries: input.intermediaries,
    transfer_watch: input.transferWatch,
  }, null, 2)
}

function csvCell(value: unknown): string {
  const stringValue = value == null ? '' : String(value)
  return `"${stringValue.replaceAll('"', '""')}"`
}

export function exportMatterViewCsv(input: MatterViewExportInput): string {
  const columns = ['record_type', 'id', 'country', 'title_or_provider', 'phase_or_status', 'date', 'infr_number', 'source_urls']
  const rows: string[][] = []
  if (input.track === 'implementation') {
    input.matters.forEach((matter) => rows.push([
      'implementation',
      matter.matter_id,
      text(matter.country.name, input.language),
      text(matter.title, input.language),
      formatPhase(matter.phase, input.language),
      matter.latest_date,
      matter.infr_number,
      matter.sources.map((source) => source.url).join(' | '),
    ]))
  }
  if (input.track === 'intermediation') {
    input.intermediaries.forEach((item) => rows.push([
      'intermediation',
      item.id,
      text(item.country.name, input.language),
      item.provider,
      item.registrationStatus,
      item.last_verified_at,
      '',
      item.sources.map((source) => source.url).join(' | '),
    ]))
  }
  if (input.track === 'article31') {
    input.transferWatch.forEach((item) => rows.push([
      'article31',
      item.watch_id,
      '',
      text(item.title, input.language),
      formatStatus(item.status, input.language),
      item.last_verified_at,
      '',
      item.sources.map((source) => source.url).join(' | '),
    ]))
  }
  return [columns.join(','), ...rows.map((row) => row.map(csvCell).join(','))].join('\n') + '\n'
}

export function exportMatterViewMarkdown(input: MatterViewExportInput): string {
  const language = input.language
  const heading = language === 'zh' ? '# DGA enforcement tracker 导出' : '# DGA enforcement tracker export'
  const metadata = language === 'zh'
    ? [`- 导出时间：${new Date().toISOString()}`, `- 轨道：${formatTrack(input.track === 'article31' ? 'non_personal_transfer' : input.track, language)}`, `- 国家筛选：${input.filters.country}`, `- 阶段筛选：${input.filters.phase}`]
    : [`- Exported at: ${new Date().toISOString()}`, `- Track: ${formatTrack(input.track === 'article31' ? 'non_personal_transfer' : input.track, language)}`, `- Country filter: ${input.filters.country}`, `- Phase filter: ${input.filters.phase}`]
  const sections = [
    `## ${text(input.overview.fullName, language)}\n\n${text(input.overview.summary, language)}`,
  ]
  if (input.track === 'implementation') {
    sections.push(...input.matters.map((matter) => [
      `## ${text(matter.title, language)}`,
      `- ID: ${matter.matter_id}`,
      `- ${language === 'zh' ? '国家' : 'Country'}: ${text(matter.country.name, language)}`,
      `- INFR: ${matter.infr_number}`,
      `- ${language === 'zh' ? '阶段' : 'Phase'}: ${formatPhase(matter.phase, language)}`,
      `- ${language === 'zh' ? '最新日期' : 'Latest date'}: ${formatDate(matter.latest_date, language)}`,
      `- ${language === 'zh' ? '状态' : 'Status'}: ${text(matter.status, language)}`,
      '',
      text(matter.summary, language),
      '',
      ...matter.sources.map((source) => `- ${text(source.label, language)}: ${source.url}`),
    ].join('\n')))
  }
  if (input.track === 'intermediation') {
    sections.push(`## ${language === 'zh' ? '数据中介服务登记' : 'Data-intermediation register'}\n\n${input.intermediaries.map((item) => `- ${item.provider} — ${text(item.country.name, language)}`).join('\n')}`)
  }
  if (input.track === 'article31') {
    sections.push(...input.transferWatch.map((item) => [
      `## ${text(item.title, language)}`,
      `- ${item.article}`,
      `- ${language === 'zh' ? '状态' : 'Status'}: ${formatStatus(item.status, language)}`,
      '',
      text(item.rule, language),
      '',
      text(item.scopeNote, language),
      '',
      ...item.sources.map((source) => `- ${text(source.label, language)}: ${source.url}`),
    ].join('\n')))
  }
  return `${heading}\n\n${metadata.join('\n')}\n\n${sections.join('\n\n')}`
}

export function downloadText(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
