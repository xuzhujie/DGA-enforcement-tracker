import { ArrowUpRight, ShieldAlert } from 'lucide-react'
import type { Language, NonPersonalTransferWatch } from '../data/types'
import { formatCountOrUnknown, formatDate, formatStatus, text } from '../lib/format'

interface TransferWatchProps {
  language: Language
  items: NonPersonalTransferWatch[]
}

export function TransferWatch({ language, items }: TransferWatchProps) {
  const copy = language === 'zh'
    ? { title: 'Article 31 · 非个人数据国际访问与转移', subtitle: '法律规则与公开个案分开显示；当前未定位到具体公开执法决定。', rule: '法律规则', cases: '公开个案观察', status: '当前状态', scope: '监测范围', next: '下一步', source: '官方法源' }
    : { title: 'Article 31 · International access and transfer', subtitle: 'Legal rule and public-case observation are shown separately; no specific public enforcement decision is currently located.', rule: 'Legal rule', cases: 'Public-case observation', status: 'Current status', scope: 'Monitoring scope', next: 'Next action', source: 'Official legal source' }
  return (
    <section className="transfer-panel">
      <div className="section-title-row"><div><div className="panel-kicker"><ShieldAlert size={14} aria-hidden="true" />{language === 'zh' ? '独立监测轨道' : 'Separate monitoring track'}</div><h2>{copy.title}</h2><p>{copy.subtitle}</p></div></div>
      {items.map((item) => <div className="transfer-card" key={item.watch_id}><div className="transfer-grid"><div><span className="detail-label">{copy.rule}</span><p className="transfer-rule">{text(item.rule, language)}</p></div><div className="transfer-status"><span className="detail-label">{copy.cases}</span><strong>{formatCountOrUnknown(item.publicCaseCount, language)}</strong><span className="status-tag status-not-located">{formatStatus(item.status, language)}</span><small>{language === 'zh' ? '当前 source set' : 'Current reviewed source set'}</small></div></div><div className="transfer-meta"><div><strong>{copy.scope}</strong><span>{text(item.scopeNote, language)}</span></div><div><strong>{copy.next}</strong><span>{text(item.nextAction, language)}</span></div></div><div className="transfer-source"><a href={item.sources[0]?.url} target="_blank" rel="noreferrer">{copy.source} <ArrowUpRight size={13} aria-hidden="true" /></a><span>{formatDate(item.last_verified_at, language)}</span></div></div>)}
    </section>
  )
}
