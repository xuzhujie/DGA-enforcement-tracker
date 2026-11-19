import { useEffect, useMemo, useState } from 'react'
import { AttentionPanel } from './components/AttentionPanel'
import { AppShell, type AppTab } from './components/AppShell'
import { DefinitionPanel } from './components/DefinitionPanel'
import { ExportActions } from './components/ExportActions'
import { FreshnessPanel } from './components/FreshnessPanel'
import { IntermediaryTable } from './components/IntermediaryTable'
import { MatterDrawer } from './components/MatterDrawer'
import { MatterTable } from './components/MatterTable'
import { MetricStrip } from './components/MetricStrip'
import { SourceList } from './components/SourceList'
import { Timeline } from './components/Timeline'
import { TransferWatch } from './components/TransferWatch'
import { UpdatesPanel } from './components/UpdatesPanel'
import { MATTERS, DGA_OVERVIEW, DATA_AS_OF, INTERMEDIARIES, OFFICIAL_SOURCES, TIMELINE_EVENTS, TRANSFER_WATCH } from './data/registry'
import { filterIntermediaries, filterMatters, getDashboardMetrics } from './data/metrics'
import type { DgaMatter, Language, UpdateItem } from './data/types'
import { downloadText, exportMatterViewCsv, exportMatterViewJson, exportMatterViewMarkdown, type ExportTrack } from './lib/export'
import { DEFAULT_MATTER_FILTERS } from './lib/filters'

const LANGUAGE_STORAGE_KEY = 'dga-tracker-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh'
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'zh'
}

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard')
  const [filters, setFilters] = useState(DEFAULT_MATTER_FILTERS)
  const [selectedMatter, setSelectedMatter] = useState<DgaMatter | null>(null)
  const [intermediaryCountry, setIntermediaryCountry] = useState('all')
  const [intermediaryQuery, setIntermediaryQuery] = useState('')
  const [updates, setUpdates] = useState<{ updatedAt: string | null; source: string | null; items: UpdateItem[] }>({ updatedAt: null, source: null, items: [] })

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/updates.json`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('updates feed unavailable')))
      .then((payload: { updated_at?: string; source?: string; items?: UpdateItem[] }) => {
        if (!cancelled) setUpdates({ updatedAt: payload.updated_at ?? null, source: payload.source ?? null, items: payload.items ?? [] })
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const metrics = useMemo(
    () => getDashboardMetrics(MATTERS, INTERMEDIARIES, TRANSFER_WATCH),
    [],
  )
  const filteredMatters = useMemo(() => filterMatters(MATTERS, filters), [filters])
  const filteredIntermediaries = useMemo(
    () => filterIntermediaries(INTERMEDIARIES, { country: intermediaryCountry, query: intermediaryQuery }),
    [intermediaryCountry, intermediaryQuery],
  )
  const countries = useMemo(
    () => Array.from(new Map(MATTERS.map((matter) => [matter.country.code, matter.country])).values()).sort((a, b) => a.name.zh.localeCompare(b.name.zh)),
    [],
  )
  const intermediaryCountries = useMemo(
    () => Array.from(new Map(INTERMEDIARIES.map((item) => [item.country.code, item.country])).values()).sort((a, b) => a.name.zh.localeCompare(b.name.zh)),
    [],
  )

  const copy = language === 'zh'
    ? {
        empty: '没有符合当前筛选的记录。',
        emptyNote: '请调整筛选条件或清除筛选。',
      }
    : {
        empty: 'This evidence view is being assembled next.',
        emptyNote: 'Your current filters remain active in the page state.',
      }

  return (
    <AppShell
      language={language}
      onLanguageChange={setLanguage}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      filters={filters}
      onChangeFilters={(patch) => setFilters((current) => ({ ...current, ...patch }))}
      onClearFilters={() => setFilters(DEFAULT_MATTER_FILTERS)}
      countries={countries}
      filteredMatterCount={filteredMatters.length}
    >
      {activeTab === 'dashboard' ? (
        <>
          <MetricStrip language={language} metrics={metrics} />
          <div className="dashboard-grid">
            <DefinitionPanel language={language} overview={DGA_OVERVIEW} />
            <AttentionPanel language={language} matters={MATTERS} />
            <FreshnessPanel
              language={language}
              dataAsOf={DATA_AS_OF}
              sourceCount={OFFICIAL_SOURCES.length}
              matterCount={filteredMatters.length}
            />
          </div>
          <UpdatesPanel language={language} items={updates.items} updatedAt={updates.updatedAt} source={updates.source} />
        </>
      ) : activeTab === 'implementation' ? (
        <>
          <div className="section-toolbar"><div><h2>{language === 'zh' ? '实施程序事项' : 'Implementation matters'}</h2><p>{language === 'zh' ? '每个成员国一条主记录，阶段事件和来源在详情中展开。' : 'One reviewed row per Member State, with phase events and sources in the detail panel.'}</p></div><ExportActions language={language} onExport={(format) => handleExport(format, 'implementation', language, filters, filteredMatters, INTERMEDIARIES, TRANSFER_WATCH)} /></div>
          <MatterTable language={language} matters={filteredMatters} onSelectMatter={setSelectedMatter} />
          <MatterDrawer language={language} matter={selectedMatter} onClose={() => setSelectedMatter(null)} />
        </>
      ) : activeTab === 'intermediation' ? (
        <>
          <div className="section-toolbar"><div><h2>{language === 'zh' ? '数据中介服务' : 'Data intermediation'}</h2><p>{language === 'zh' ? '登记册独立于实施程序和 Article 31 监测。' : 'The register is separate from implementation matters and Article 31 monitoring.'}</p></div><ExportActions language={language} onExport={(format) => handleExport(format, 'intermediation', language, filters, filteredMatters, filteredIntermediaries, TRANSFER_WATCH)} /></div>
          <IntermediaryTable language={language} intermediaries={filteredIntermediaries} countries={intermediaryCountries} country={intermediaryCountry} query={intermediaryQuery} onCountryChange={setIntermediaryCountry} onQueryChange={setIntermediaryQuery} />
        </>
      ) : activeTab === 'article31' ? (
        <>
          <div className="section-toolbar"><div><h2>{language === 'zh' ? '非个人数据国际访问 / 转移' : 'International access / transfer of non-personal data'}</h2><p>{language === 'zh' ? '仅在官方来源明确指向 DGA Article 31 的具体行动或决定时定位个案。' : 'Locate a case only when an official source expressly ties a concrete action or decision to DGA Article 31.'}</p></div><ExportActions language={language} onExport={(format) => handleExport(format, 'article31', language, filters, filteredMatters, INTERMEDIARIES, TRANSFER_WATCH)} /></div>
          <TransferWatch language={language} items={TRANSFER_WATCH} />
        </>
      ) : activeTab === 'timeline' ? (
        <Timeline language={language} events={TIMELINE_EVENTS} />
      ) : activeTab === 'sources' ? (
        <SourceList language={language} sources={OFFICIAL_SOURCES} />
      ) : (
        <section className="placeholder-panel" aria-live="polite">
          <p className="eyebrow">{activeTab}</p>
          <h2>{copy.empty}</h2>
          <p>{copy.emptyNote}</p>
        </section>
      )}
    </AppShell>
  )
}

function handleExport(
  format: 'json' | 'csv' | 'markdown',
  track: ExportTrack,
  language: Language,
  filters: typeof DEFAULT_MATTER_FILTERS,
  matters: DgaMatter[],
  intermediaries: typeof INTERMEDIARIES,
  transferWatch: typeof TRANSFER_WATCH,
) {
  const input = { language, track, filters, matters, intermediaries, transferWatch, overview: DGA_OVERVIEW }
  const prefix = `dga-${track}-${new Date().toISOString().slice(0, 10)}`
  if (format === 'json') downloadText(`${prefix}.json`, exportMatterViewJson(input), 'application/json')
  if (format === 'csv') downloadText(`${prefix}.csv`, exportMatterViewCsv(input), 'text/csv;charset=utf-8')
  if (format === 'markdown') downloadText(`${prefix}.md`, exportMatterViewMarkdown(input), 'text/markdown;charset=utf-8')
}

export default App
