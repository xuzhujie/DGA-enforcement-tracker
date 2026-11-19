import assert from 'node:assert/strict'
import test from 'node:test'
import { DGA_OVERVIEW, INTERMEDIARIES, MATTERS, TRANSFER_WATCH } from '../data/registry'
import { exportMatterViewCsv, exportMatterViewJson, exportMatterViewMarkdown } from './export'

const baseInput = {
  language: 'zh' as const,
  matters: [MATTERS[0]],
  intermediaries: [INTERMEDIARIES[0]],
  transferWatch: TRANSFER_WATCH,
  filters: { country: 'DE', phase: 'all' as const, query: '' },
  overview: DGA_OVERVIEW,
}

test('JSON export preserves filters and Article 31 not-located status', () => {
  const payload = JSON.parse(exportMatterViewJson({ ...baseInput, track: 'article31' }))

  assert.deepEqual(payload.filters, baseInput.filters)
  assert.equal(payload.transfer_watch[0].status, 'not_located')
  assert.equal(payload.transfer_watch[0].publicCaseCount, null)
})

test('CSV export escapes provider names with commas and quotes', () => {
  const csv = exportMatterViewCsv({
    ...baseInput,
    track: 'intermediation',
    intermediaries: [{ ...INTERMEDIARIES[0], provider: 'A, "Quoted" Provider' }],
  })

  assert.match(csv, /"A, ""Quoted"" Provider"/)
})

test('Markdown export includes the DGA definition, selected matter and source URL', () => {
  const markdown = exportMatterViewMarkdown({ ...baseInput, track: 'implementation' })

  assert.match(markdown, /DGA/)
  assert.match(markdown, new RegExp(MATTERS[0].matter_id))
  assert.match(markdown, new RegExp(MATTERS[0].sources[0].url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})
