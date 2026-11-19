import { ArrowUpRight, CircleDot, Clock3 } from 'lucide-react'
import type { Language, TimelineEvent } from '../data/types'
import { formatDate, text } from '../lib/format'

interface TimelineProps {
  language: Language
  events: TimelineEvent[]
}

export function Timeline({ language, events }: TimelineProps) {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date))
  return <section className="timeline-panel"><div className="section-title-row"><div><div className="panel-kicker"><Clock3 size={14} aria-hidden="true" />{language === 'zh' ? '法规与公开程序' : 'Law and public procedure'}</div><h2>{language === 'zh' ? 'DGA 时间线' : 'DGA timeline'}</h2><p>{language === 'zh' ? '按官方日期整理法规适用、程序阶段和登记册观察节点。' : 'Official dates for applicability, procedure stages and register observations.'}</p></div></div><div className="timeline-list">{sorted.map((event) => <div className="timeline-item" key={event.id}><div className="timeline-marker"><CircleDot size={15} aria-hidden="true" /></div><div className="timeline-date">{formatDate(event.date, language)}</div><div className="timeline-content"><strong>{text(event.label, language)}</strong><span>{text(event.description, language)}</span><div className="timeline-sources">{event.sourceIds.map((sourceId) => <span key={sourceId}>{sourceId}</span>)}</div></div></div>)}</div></section>
}
