import { ArrowUpRight, CalendarDays, CheckCircle2, X } from 'lucide-react'
import type { DgaMatter, Language } from '../data/types'
import { formatDate, formatPhase, text } from '../lib/format'

interface MatterDrawerProps {
  language: Language
  matter: DgaMatter | null
  onClose: () => void
}

export function MatterDrawer({ language, matter, onClose }: MatterDrawerProps) {
  if (!matter) return null
  const copy = language === 'zh'
    ? { close: '关闭', status: '公开状态', note: '证据边界', impact: '业务影响', next: '下一步复核', events: '公开阶段事件', sources: '官方来源', noFine: '当前来源只支持实施程序阶段，不代表最终违规决定或罚款。' }
    : { close: 'Close', status: 'Public status', note: 'Evidence boundary', impact: 'Business impact', next: 'Next review', events: 'Public phase events', sources: 'Official sources', noFine: 'The current sources support an implementation-procedure phase, not a final infringement decision or fine.' }
  return (
    <aside className="detail-panel" aria-label={text(matter.title, language)}>
      <div className="detail-heading"><div><span className="detail-kicker">{matter.country.flag} {text(matter.country.name, language)} · {matter.infr_number}</span><h2>{text(matter.title, language)}</h2></div><button className="icon-button" onClick={onClose} type="button" aria-label={copy.close}><X size={17} aria-hidden="true" /></button></div>
      <div className="detail-status"><CheckCircle2 size={16} aria-hidden="true" /><strong>{copy.status}</strong><span className={`status-tag status-${matter.phase}`}>{formatPhase(matter.phase, language)}</span></div>
      <p className="detail-copy">{text(matter.summary, language)}</p>
      <div className="detail-callout"><strong>{copy.note}</strong><span>{text(matter.statusNote, language)}</span><span>{copy.noFine}</span></div>
      <div className="detail-two-col"><div><strong>{copy.impact}</strong><p>{text(matter.businessImpact, language)}</p></div><div><strong>{copy.next}</strong><p>{text(matter.nextAction, language)}</p></div></div>
      <div className="detail-section"><h3><CalendarDays size={14} aria-hidden="true" />{copy.events}</h3>{matter.events.map((event) => <div className="event-row" key={event.id}><div className="event-date">{formatDate(event.date, language)}</div><div><strong>{text(event.label, language)}</strong><span>{text(event.description, language)}</span></div></div>)}</div>
      <div className="detail-section"><h3>{copy.sources}</h3>{matter.sources.map((source) => <a className="source-row" href={source.url} target="_blank" rel="noreferrer" key={source.id}><span><strong>{text(source.label, language)}</strong><small>{text(source.evidenceSnapshot, language)}</small></span><ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>
    </aside>
  )
}
