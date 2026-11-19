import type { Language } from '../data/types'
import type { UpdateItem } from '../data/types'
import { formatDate } from '../lib/format'

interface UpdatesPanelProps {
  language: Language
  items: UpdateItem[]
  updatedAt: string | null
  source: string | null
}

export function UpdatesPanel({ language, items, updatedAt, source }: UpdatesPanelProps) {
  const visibleItems = items.slice(0, 3)

  return (
    <section className="updates-panel panel" aria-labelledby="updates-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{language === 'zh' ? '官方动态监测' : 'Official update monitor'}</p>
          <h2 id="updates-heading">{language === 'zh' ? '最近信号' : 'Recent signals'}</h2>
        </div>
        {updatedAt ? <span className="muted small">{language === 'zh' ? `Feed 更新 ${formatDate(updatedAt, language)}` : `Feed updated ${formatDate(updatedAt, language)}`}</span> : null}
      </div>
      {visibleItems.length ? (
        <div className="updates-list">
          {visibleItems.map((item) => (
            <article className="update-item" key={item.link}>
              <div className="update-date">{formatDate(item.date, language)}</div>
              <div>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {language === 'zh' ? item.title_zh ?? item.title : item.title}
                </a>
                <p>{language === 'zh' ? item.summary_zh ?? item.summary : item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">{language === 'zh' ? '当前 feed 没有可显示的 DGA 动态。' : 'No DGA updates are available in the current feed.'}</p>
      )}
      <p className="panel-note">
        {language === 'zh'
          ? '自动 feed 只提示待复核信号；它不会自动改变主登记中的案件、阶段或法律结论。'
          : 'The automated feed is a review queue; it never mutates reviewed matters, phases or legal conclusions.'}
        {source ? <a href={source} target="_blank" rel="noreferrer">{language === 'zh' ? '查看来源' : 'View source'}</a> : null}
      </p>
    </section>
  )
}
