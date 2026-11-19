import { ListFilter, RotateCcw, Search } from 'lucide-react'
import type { CountryRef, Language, MatterFilters } from '../data/types'
import { formatPhase } from '../lib/format'

interface FilterBarProps {
  language: Language
  filters: MatterFilters
  countries: CountryRef[]
  filteredMatterCount: number
  onChange: (patch: Partial<MatterFilters>) => void
  onClear: () => void
}

export function FilterBar({ language, filters, countries, filteredMatterCount, onChange, onClear }: FilterBarProps) {
  const copy = language === 'zh'
    ? { filter: '筛选', all: '全部', allStages: '全部阶段', search: '搜索国家、INFR 号或关键词', result: `${filteredMatterCount} 条实施程序`, clear: '清除' }
    : { filter: 'Filters', all: 'All', allStages: 'All stages', search: 'Search country, INFR number or keyword', result: `${filteredMatterCount} implementation matters`, clear: 'Clear' }

  return (
    <section className="filter-bar" aria-label={copy.filter}>
      <div className="filter-label"><ListFilter size={15} aria-hidden="true" />{copy.filter}</div>
      <div className="filter-group">
        <select value={filters.country} onChange={(event) => onChange({ country: event.target.value })} aria-label={language === 'zh' ? '国家' : 'Country'}>
          <option value="all">{copy.all}</option>
          {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name[language]}</option>)}
        </select>
        <select value={filters.phase} onChange={(event) => onChange({ phase: event.target.value as MatterFilters['phase'] })} aria-label={language === 'zh' ? '阶段' : 'Stage'}>
          <option value="all">{copy.allStages}</option>
          <option value="formal_notice">{formatPhase('formal_notice', language)}</option>
          <option value="reasoned_opinion">{formatPhase('reasoned_opinion', language)}</option>
        </select>
        <label className="search-box">
          <Search size={14} aria-hidden="true" />
          <input value={filters.query} onChange={(event) => onChange({ query: event.target.value })} placeholder={copy.search} aria-label={copy.search} />
        </label>
      </div>
      <div className="filter-summary">{copy.result}</div>
      <button className="clear-button" onClick={onClear} type="button"><RotateCcw size={13} aria-hidden="true" />{copy.clear}</button>
    </section>
  )
}
