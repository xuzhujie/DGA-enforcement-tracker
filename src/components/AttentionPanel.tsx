import { ArrowUpRight, ClipboardList, Clock3 } from 'lucide-react'
import type { DgaMatter, Language } from '../data/types'
import { formatDate, formatPhase, text } from '../lib/format'

interface AttentionPanelProps {
  language: Language
  matters: DgaMatter[]
}

export function AttentionPanel({ language, matters }: AttentionPanelProps) {
  const items = matters.filter((matter) => matter.phase === 'reasoned_opinion').slice(0, 5)
  const copy = language === 'zh'
    ? { title: '待关注事项', subtitle: '优先显示已公开进入 reasoned opinion 的成员国；不是最终违规或罚款结论。', more: '查看全部实施程序' }
    : { title: 'Matters to review', subtitle: 'Prioritises Member States publicly moved to reasoned opinion; not final infringement or fine findings.', more: 'View all implementation matters' }
  return (
    <section className="attention-panel">
      <div className="panel-heading">
        <div><div className="panel-kicker"><ClipboardList size={14} aria-hidden="true" />{language === 'zh' ? '公开阶段' : 'Public phase'}</div><h2>{copy.title}</h2><p>{copy.subtitle}</p></div>
        <Clock3 size={17} aria-hidden="true" />
      </div>
      <div className="attention-list">
        {items.map((matter) => (
          <div className="attention-row" key={matter.matter_id}>
            <div className="attention-badges"><span className="attention-badge">{matter.country.flag} {text(matter.country.name, language)}</span><span className="attention-badge">{formatPhase(matter.phase, language)}</span><strong>{matter.infr_number}</strong></div>
            <div className="attention-title">{text(matter.title, language)}</div>
            <div className="attention-meta"><span>{formatDate(matter.latest_date, language)}</span><a href={matter.sources[0]?.url} target="_blank" rel="noreferrer">{language === 'zh' ? '官方来源' : 'Official source'} <ArrowUpRight size={12} aria-hidden="true" /></a></div>
          </div>
        ))}
      </div>
      <div className="panel-footnote">{copy.more} →</div>
    </section>
  )
}
