import { ArrowUpRight, ChevronRight } from 'lucide-react'
import type { DgaMatter, Language } from '../data/types'
import { formatDate, formatPhase, text } from '../lib/format'

interface MatterTableProps {
  language: Language
  matters: DgaMatter[]
  onSelectMatter: (matter: DgaMatter) => void
}

export function MatterTable({ language, matters, onSelectMatter }: MatterTableProps) {
  const copy = language === 'zh'
    ? { title: '实施程序登记', subtitle: '按成员国一条主记录；阶段变化保留在详情事件链中。', country: '国家', matter: '事项', phase: '公开阶段', latest: '最新公开信号', source: '来源', open: '打开详情', empty: '没有符合当前筛选的实施程序。' }
    : { title: 'Implementation register', subtitle: 'One matter per Member State; phase changes remain in the detail event chain.', country: 'Country', matter: 'Matter', phase: 'Public phase', latest: 'Latest public signal', source: 'Source', open: 'Open detail', empty: 'No implementation matters match the current filters.' }
  return (
    <section className="table-panel">
      <div className="section-title-row"><div><h2>{copy.title}</h2><p>{copy.subtitle}</p></div><span className="result-count">{matters.length}</span></div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>{copy.country}</th><th>{copy.matter}</th><th>{copy.phase}</th><th>{copy.latest}</th><th>{copy.source}</th><th aria-label={copy.open} /></tr></thead>
          <tbody>
            {matters.map((matter) => (
              <tr key={matter.matter_id} onClick={() => onSelectMatter(matter)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onSelectMatter(matter) }}>
                <td><strong>{matter.country.flag} {text(matter.country.name, language)}</strong><small>{matter.infr_number}</small></td>
                <td><span className="table-title">{text(matter.title, language)}</span><small>{text(matter.statusNote, language)}</small></td>
                <td><span className={`status-tag status-${matter.phase}`}>{formatPhase(matter.phase, language)}</span></td>
                <td>{formatDate(matter.latest_date, language)}</td>
                <td><a href={matter.sources[0]?.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`${copy.source}: ${text(matter.title, language)}`}><ArrowUpRight size={14} aria-hidden="true" /></a></td>
                <td><button className="icon-button" type="button" aria-label={copy.open} onClick={(event) => { event.stopPropagation(); onSelectMatter(matter) }}><ChevronRight size={16} aria-hidden="true" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {matters.length === 0 && <div className="empty-state">{copy.empty}</div>}
      </div>
    </section>
  )
}
