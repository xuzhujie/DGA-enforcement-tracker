import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import type { Language } from '../data/types'

interface ExportActionsProps {
  language: Language
  onExport: (format: 'json' | 'csv' | 'markdown') => void
}

export function ExportActions({ language, onExport }: ExportActionsProps) {
  return <div className="export-tools"><span><Download size={13} aria-hidden="true" />{language === 'zh' ? '导出当前视图' : 'Export current view'}</span><button type="button" onClick={() => onExport('json')}><FileJson size={13} aria-hidden="true" />JSON</button><button type="button" onClick={() => onExport('csv')}><FileSpreadsheet size={13} aria-hidden="true" />CSV</button><button type="button" onClick={() => onExport('markdown')}><FileText size={13} aria-hidden="true" />MD</button></div>
}
