import { AlertCircle, Database, FileWarning, Gavel } from 'lucide-react'
import type { DashboardMetrics } from '../data/metrics'
import type { Language } from '../data/types'
import { formatCountOrUnknown } from '../lib/format'

interface MetricStripProps {
  language: Language
  metrics: DashboardMetrics
}

export function MetricStrip({ language, metrics }: MetricStripProps) {
  const cards = language === 'zh'
    ? [
        { label: '有 formal notice 的成员国事项', value: formatCountOrUnknown(metrics.formalNoticeMatterCount, language), note: '18 国公告 + 爱尔兰独立事项', icon: FileWarning, tone: 'blue' },
        { label: '已进入 reasoned opinion', value: formatCountOrUnknown(metrics.reasonedOpinionCount, language), note: '公开阶段，不等同最终决定', icon: Gavel, tone: 'amber' },
        { label: '公开数据中介服务', value: formatCountOrUnknown(metrics.intermediaryCount, language), note: '登记册快照，不是处罚数量', icon: Database, tone: 'green' },
        { label: 'Article 31 公开个案', value: formatCountOrUnknown(metrics.article31PublicCaseCount, language), note: '未定位到 ≠ 没有发生', icon: AlertCircle, tone: 'red' },
      ]
    : [
        { label: 'Member State matters with formal notice', value: formatCountOrUnknown(metrics.formalNoticeMatterCount, language), note: '18-country notice + Ireland matter', icon: FileWarning, tone: 'blue' },
        { label: 'Reasoned-opinion stage', value: formatCountOrUnknown(metrics.reasonedOpinionCount, language), note: 'Public phase, not a final decision', icon: Gavel, tone: 'amber' },
        { label: 'Public data-intermediation services', value: formatCountOrUnknown(metrics.intermediaryCount, language), note: 'Register snapshot, not fines', icon: Database, tone: 'green' },
        { label: 'Article 31 public cases', value: formatCountOrUnknown(metrics.article31PublicCaseCount, language), note: 'Not located ≠ none occurred', icon: AlertCircle, tone: 'red' },
      ]

  return (
    <section className="stats-grid" aria-label={language === 'zh' ? '关键指标' : 'Key metrics'}>
      {cards.map(({ label, value, note, icon: Icon, tone }) => (
        <article className={`stat-card stat-${tone}`} key={label}>
          <div className="stat-label"><span>{label}</span><Icon size={16} aria-hidden="true" /></div>
          <div className="stat-value">{value}</div>
          <div className="stat-note">{note}</div>
        </article>
      ))}
    </section>
  )
}
