import {
  BookOpen,
  CalendarDays,
  Database,
  LayoutDashboard,
  ListChecks,
  ShieldAlert,
} from 'lucide-react'
import type { Language } from '../data/types'
import type { AppTab } from './AppShell'

interface TopNavProps {
  language: Language
  activeTab: AppTab
  onSelectTab: (tab: AppTab) => void
}

const tabs: Array<{ key: AppTab; icon: typeof LayoutDashboard; zh: string; en: string }> = [
  { key: 'dashboard', icon: LayoutDashboard, zh: '驾驶舱', en: 'Dashboard' },
  { key: 'implementation', icon: ListChecks, zh: '实施程序', en: 'Implementation' },
  { key: 'intermediation', icon: Database, zh: '数据中介', en: 'Data intermediation' },
  { key: 'article31', icon: ShieldAlert, zh: '非个人数据出境', en: 'Article 31' },
  { key: 'timeline', icon: CalendarDays, zh: '时间线', en: 'Timeline' },
  { key: 'sources', icon: BookOpen, zh: '来源', en: 'Sources' },
]

export function TopNav({ language, activeTab, onSelectTab }: TopNavProps) {
  return (
    <nav className="tabs" aria-label={language === 'zh' ? '主导航' : 'Primary navigation'}>
      {tabs.map(({ key, icon: Icon, zh, en }) => (
        <button className={activeTab === key ? 'active' : ''} key={key} onClick={() => onSelectTab(key)} type="button">
          <Icon size={15} aria-hidden="true" />
          <span>{language === 'zh' ? zh : en}</span>
        </button>
      ))}
    </nav>
  )
}
