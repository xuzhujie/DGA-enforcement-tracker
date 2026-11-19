import { ArrowUpRight, BookOpen } from 'lucide-react'
import type { Language, OfficialSource } from '../data/types'
import { text } from '../lib/format'

interface SourceListProps {
  language: Language
  sources: OfficialSource[]
}

export function SourceList({ language, sources }: SourceListProps) {
  return <section className="sources-panel"><div className="section-title-row"><div><div className="panel-kicker"><BookOpen size={14} aria-hidden="true" />{language === 'zh' ? '可追溯来源' : 'Traceable sources'}</div><h2>{language === 'zh' ? '官方来源目录' : 'Official source directory'}</h2><p>{language === 'zh' ? '主登记册保留 URL、来源类型、证据摘要和复核日期。' : 'The registry keeps URLs, source types, evidence summaries and review dates.'}</p></div></div><div className="source-grid">{sources.map((source) => <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.id}><div><strong>{text(source.label, language)}</strong><span>{text(source.description, language)}</span></div><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div></section>
}
