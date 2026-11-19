import { ArrowUpRight, BookOpen, Scale } from 'lucide-react'
import type { DgaOverview, Language } from '../data/types'
import { formatDate, text } from '../lib/format'

interface DefinitionPanelProps {
  language: Language
  overview: DgaOverview
}

export function DefinitionPanel({ language, overview }: DefinitionPanelProps) {
  const copy = language === 'zh'
    ? { apply: '开始适用', boundary: '和 DMA / DSA 的边界', source: '官方定义' }
    : { apply: 'Applies from', boundary: 'Boundary with DMA / DSA', source: 'Official definition' }
  return (
    <section className="definition-panel panel-span-2">
      <div className="panel-heading">
        <div>
          <div className="panel-kicker"><Scale size={14} aria-hidden="true" />{copy.source}</div>
          <h2>{text(overview.title, language)}</h2>
          <p className="definition-full-name">{text(overview.fullName, language)}</p>
        </div>
        <a className="source-link" href="https://eur-lex.europa.eu/eli/reg/2022/868/oj" target="_blank" rel="noreferrer">
          <BookOpen size={14} aria-hidden="true" /> EUR-Lex <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <p className="definition-summary">{text(overview.summary, language)}</p>
      <div className="definition-grid">
        {overview.sections.map((section) => (
          <div className="definition-item" key={section.label.en}>
            <strong>{text(section.label, language)}</strong>
            <span>{text(section.body, language)}</span>
          </div>
        ))}
      </div>
      <div className="boundary-block">
        <div className="section-heading"><h3>{copy.boundary}</h3><span className="definition-date">{copy.apply} {formatDate(overview.applicableFrom, language)}</span></div>
        <div className="boundary-table" role="table">
          {overview.boundaryRows.map((row) => (
            <div className={`boundary-row boundary-${row.regulation.en.toLowerCase()}`} key={row.regulation.en} role="row">
              <strong role="cell">{text(row.regulation, language)}</strong>
              <span role="cell">{text(row.subject, language)}</span>
              <span role="cell">{text(row.signal, language)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
