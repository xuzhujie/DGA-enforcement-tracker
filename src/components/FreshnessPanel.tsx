import { CheckCircle2, Database, FileClock, Link2 } from 'lucide-react'
import type { Language } from '../data/types'
import { formatDate } from '../lib/format'

interface FreshnessPanelProps {
  language: Language
  dataAsOf: string
  sourceCount: number
  matterCount: number
}

export function FreshnessPanel({ language, dataAsOf, sourceCount, matterCount }: FreshnessPanelProps) {
  const copy = language === 'zh'
    ? { title: '数据新鲜度', subtitle: '区分人工核验的登记册与后续可自动刷新的动态文件。', main: '主登记册人工核验', mainNote: '案件阶段、登记服务与 Article 31 观察项', updates: '官方来源入口', updatesNote: `${sourceCount} 个来源对象 · ${matterCount} 条当前筛选事项`, monitor: '动态监测只写入 public/data/updates.json；不会自动改变案件状态。' }
    : { title: 'Data freshness', subtitle: 'Separates manually verified registry facts from the update file that can refresh automatically.', main: 'Reviewed registry', mainNote: 'Matter phases, registered services and Article 31 watch item', updates: 'Official source set', updatesNote: `${sourceCount} source objects · ${matterCount} matters in current view`, monitor: 'Automatic monitoring writes only to public/data/updates.json; it never changes matter status.' }
  return (
    <section className="freshness-panel">
      <div className="panel-heading"><div><div className="panel-kicker"><FileClock size={14} aria-hidden="true" />{language === 'zh' ? '来源状态' : 'Source state'}</div><h2>{copy.title}</h2><p>{copy.subtitle}</p></div><CheckCircle2 size={17} aria-hidden="true" /></div>
      <div className="freshness-item"><Database size={17} aria-hidden="true" /><div><span>{copy.main}</span><strong>{formatDate(dataAsOf, language)}</strong><small>{copy.mainNote}</small></div></div>
      <div className="freshness-item"><Link2 size={17} aria-hidden="true" /><div><span>{copy.updates}</span><strong>{copy.updatesNote}</strong></div></div>
      <div className="freshness-note">{copy.monitor}</div>
    </section>
  )
}
