import { ArrowUpRight, Database, Search } from 'lucide-react'
import type { CountryRef, IntermediaryRecord, Language } from '../data/types'
import { formatDate, text } from '../lib/format'

interface IntermediaryTableProps {
  language: Language
  intermediaries: IntermediaryRecord[]
  countries: CountryRef[]
  country: string
  query: string
  onCountryChange: (country: string) => void
  onQueryChange: (query: string) => void
}

export function IntermediaryTable({ language, intermediaries, countries, country, query, onCountryChange, onQueryChange }: IntermediaryTableProps) {
  const copy = language === 'zh'
    ? { title: '数据中介服务登记册', subtitle: '登记表示成员国通知的服务条目，不等于合规认证、处罚或案件数量。', all: '全部国家', search: '搜索服务名称', countryLabel: '国家', provider: '服务提供方', status: '登记状态', source: '来源', note: '数据中介服务应保持中立，并与相关其他服务结构性分离；页面只记录公开登记快照。' }
    : { title: 'Data-intermediation register', subtitle: 'Registration reflects notified service entries; it is not a compliance certification, fine or case count.', all: 'All countries', search: 'Search provider name', countryLabel: 'Country', provider: 'Provider', status: 'Register status', source: 'Source', note: 'Data-intermediation services are expected to remain neutral and structurally separate from related services; this page records a public register snapshot.' }
  return (
    <section className="table-panel">
      <div className="section-title-row"><div><div className="panel-kicker"><Database size={14} aria-hidden="true" />{language === 'zh' ? '独立轨道' : 'Separate track'}</div><h2>{copy.title}</h2><p>{copy.subtitle}</p></div><span className="result-count">{intermediaries.length}</span></div>
      <div className="inline-filters"><select value={country} onChange={(event) => onCountryChange(event.target.value)} aria-label={copy.countryLabel}><option value="all">{copy.all}</option>{countries.map((item) => <option value={item.code} key={item.code}>{item.flag} {text(item.name, language)}</option>)}</select><label className="search-box"><Search size={14} aria-hidden="true" /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={copy.search} aria-label={copy.search} /></label></div>
      <div className="table-note">{copy.note}</div>
      <div className="table-scroll"><table><thead><tr><th>{copy.countryLabel}</th><th>{copy.provider}</th><th>{copy.status}</th><th>{copy.source}</th></tr></thead><tbody>{intermediaries.map((item) => <tr key={item.id}><td><strong>{item.country.flag} {text(item.country.name, language)}</strong></td><td><span className="table-title">{item.provider}</span></td><td><span className="status-tag status-registered">{language === 'zh' ? '已登记' : 'Registered'}</span><small>{formatDate(item.last_verified_at, language)}</small></td><td><a href={item.sources[0]?.url} target="_blank" rel="noreferrer" aria-label={`${copy.source}: ${item.provider}`}><ArrowUpRight size={14} aria-hidden="true" /></a></td></tr>)}</tbody></table>{intermediaries.length === 0 && <div className="empty-state">{language === 'zh' ? '没有符合筛选条件的服务。' : 'No services match the current filters.'}</div>}</div>
    </section>
  )
}
