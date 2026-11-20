import { ArrowUpRight, Building2, HeartHandshake } from 'lucide-react'
import type { AuthoritySnapshot, DataAltruismOrganisation, Language } from '../data/types'
import { getGovernanceCopy } from '../lib/governance-copy'
import { formatDate, text } from '../lib/format'

interface GovernanceRegisterProps {
  language: Language
  authorities: AuthoritySnapshot[]
  organisations: DataAltruismOrganisation[]
}

function listOrFallback(values: string[], fallback: string): string {
  return values.length ? values.join('; ') : fallback
}

export function GovernanceRegister({ language, authorities, organisations }: GovernanceRegisterProps) {
  const copy = getGovernanceCopy(language)
  return (
    <section className="governance-panel">
      <div className="section-title-row">
        <div>
          <div className="panel-kicker"><Building2 size={14} aria-hidden="true" />{copy.tab}</div>
          <h2>{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <span className="result-count">{authorities.length}</span>
      </div>
      <p className="table-note">{copy.registerNote}</p>

      <div className="governance-section">
        <div className="section-heading">
          <h3>{copy.authoritiesTitle}</h3>
          <span className="definition-date">{copy.sourceDate} 15/09/2026</span>
        </div>
        <div className="table-scroll">
          <table className="governance-table">
            <thead>
              <tr><th>{copy.country}</th><th>{copy.authorityRole}</th><th>{copy.intermediationRole}</th><th>{copy.altruismRole}</th><th>{copy.source}</th></tr>
            </thead>
            <tbody>
              {authorities.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.country.flag} {text(item.country.name, language)}</strong><small>{item.sourceUpdatedAt}</small></td>
                  <td>{listOrFallback(item.competentBody, copy.notListed)}</td>
                  <td>{listOrFallback(item.dataIntermediation, copy.notListed)}</td>
                  <td>{listOrFallback(item.dataAltruism, copy.notListed)}</td>
                  <td><a href={item.sources[0]?.url} target="_blank" rel="noreferrer" aria-label={copy.source + ': ' + text(item.country.name, language)}><ArrowUpRight size={14} aria-hidden="true" /></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="governance-section">
        <div className="section-heading">
          <h3><HeartHandshake size={14} aria-hidden="true" /> {copy.altruismTitle}</h3>
          <span className="definition-date">{organisations.length}</span>
        </div>
        <div className="table-scroll">
          <table className="governance-table">
            <thead><tr><th>{copy.country}</th><th>{copy.organisation}</th><th>{copy.status}</th><th>{copy.lastVerified}</th><th>{copy.source}</th></tr></thead>
            <tbody>
              {organisations.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.country.flag} {text(item.country.name, language)}</strong></td>
                  <td>{item.organisation}</td>
                  <td><span className="status-tag status-recognised">{language === 'zh' ? '已获认可' : 'Recognised'}</span></td>
                  <td>{formatDate(item.last_verified_at, language)}</td>
                  <td><a href={item.sources[0]?.url} target="_blank" rel="noreferrer" aria-label={copy.source + ': ' + item.organisation}><ArrowUpRight size={14} aria-hidden="true" /></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
