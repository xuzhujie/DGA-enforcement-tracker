import { ArrowUpRight, SearchCheck } from 'lucide-react'
import type { Language, ProcedureFollowUp } from '../data/types'
import { getFollowUpStatusCopy } from '../lib/governance-copy'
import { formatDate, text } from '../lib/format'

interface FollowUpTableProps {
  language: Language
  reviews: ProcedureFollowUp[]
}

export function FollowUpTable({ language, reviews }: FollowUpTableProps) {
  const copy = language === 'zh'
    ? {
        title: '后续状态检查',
        subtitle: '逐事项保留结案、升级或法院进展的检索结果；未定位到不等于已结案。',
        country: '国家',
        status: '后续信号',
        summary: '复核结论',
        next: '下一步',
        date: '复核日期',
        source: '来源',
      }
    : {
        title: 'Follow-up status review',
        subtitle: 'Each matter keeps a search result for closure, escalation or court signals; not located is not closed.',
        country: 'Country',
        status: 'Later signal',
        summary: 'Review result',
        next: 'Next action',
        date: 'Review date',
        source: 'Source',
      }
  return (
    <section className="table-panel follow-up-panel">
      <div className="section-title-row">
        <div>
          <div className="panel-kicker"><SearchCheck size={14} aria-hidden="true" />{copy.title}</div>
          <h2>{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <span className="result-count">{reviews.length}</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>{copy.country}</th><th>{copy.status}</th><th>{copy.summary}</th><th>{copy.next}</th><th>{copy.date}</th><th>{copy.source}</th></tr></thead>
          <tbody>
            {reviews.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.country.flag} {text(item.country.name, language)}</strong><small>{item.matter_id}</small></td>
                <td><span className="status-tag status-not-located">{getFollowUpStatusCopy(item.status, language)}</span></td>
                <td>{text(item.summary, language)}</td>
                <td>{text(item.nextAction, language)}</td>
                <td>{formatDate(item.last_verified_at, language)}</td>
                <td><a href={item.sources[0]?.url} target="_blank" rel="noreferrer" aria-label={copy.source + ': ' + text(item.country.name, language)}><ArrowUpRight size={14} aria-hidden="true" /></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
