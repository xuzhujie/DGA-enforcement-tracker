import type { ReactNode } from 'react'
import { FilterBar } from './FilterBar'
import { TopNav } from './TopNav'
import type { CountryRef, Language, MatterFilters } from '../data/types'

export type AppTab = 'dashboard' | 'implementation' | 'intermediation' | 'article31' | 'governance' | 'timeline' | 'sources'

interface AppShellProps {
  language: Language
  onLanguageChange: (language: Language) => void
  activeTab: AppTab
  onSelectTab: (tab: AppTab) => void
  filters: MatterFilters
  onChangeFilters: (patch: Partial<MatterFilters>) => void
  onClearFilters: () => void
  countries: CountryRef[]
  filteredMatterCount: number
  children: ReactNode
}

export function AppShell({
  language,
  onLanguageChange,
  activeTab,
  onSelectTab,
  filters,
  onChangeFilters,
  onClearFilters,
  countries,
  filteredMatterCount,
  children,
}: AppShellProps) {
  const labels = language === 'zh'
    ? {
        portal: '欧盟委员会 · Regulation (EU) 2022/868',
        title: 'DGA 执法追踪器',
        subtitle: '跟踪数据治理法的成员国实施程序、数据中介登记，以及非个人数据国际访问/转移的公开监管信号。',
        asOf: '数据核验截至 2026-11-20',
        disclaimer: '研究参考，不构成法律意见；程序状态和法律结论以最新官方原文为准。',
      }
    : {
        portal: 'European Commission · Regulation (EU) 2022/868',
        title: 'DGA enforcement tracker',
        subtitle: 'Track Member State implementation procedures, data-intermediation registrations, and public signals on international access or transfer of non-personal data.',
        asOf: 'Data verified through 2026-11-20',
        disclaimer: 'For research use only; not legal advice. Confirm procedure status and legal conclusions against the latest official text.',
      }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="container hero-inner">
          <div className="hero-top">
            <div className="eyebrow">{labels.portal}</div>
            <div className="hero-tools">
              <span className="freshness-chip">{labels.asOf}</span>
              <div className="language-toggle" aria-label={language === 'zh' ? '语言' : 'Language'}>
                <button className={language === 'zh' ? 'active' : ''} onClick={() => onLanguageChange('zh')} type="button">中文</button>
                <button className={language === 'en' ? 'active' : ''} onClick={() => onLanguageChange('en')} type="button">EN</button>
              </div>
            </div>
          </div>
          <h1>{labels.title}</h1>
          <p className="hero-subtitle">{labels.subtitle}</p>
          <p className="hero-disclaimer">{labels.disclaimer}</p>
        </div>
      </header>

      <main className="container main-container">
        <TopNav language={language} activeTab={activeTab} onSelectTab={onSelectTab} />
        {(activeTab === 'dashboard' || activeTab === 'implementation') ? (
          <FilterBar
            language={language}
            filters={filters}
            countries={countries}
            filteredMatterCount={filteredMatterCount}
            onChange={onChangeFilters}
            onClear={onClearFilters}
          />
        ) : null}
        {children}
      </main>
    </div>
  )
}
