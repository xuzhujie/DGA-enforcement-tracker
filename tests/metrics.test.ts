import assert from 'node:assert/strict'
import test from 'node:test'
import { INTERMEDIARIES, MATTERS, TRANSFER_WATCH } from '../src/data/registry'
import {
  dedupeMatters,
  filterMatters,
  getDashboardMetrics,
} from '../src/data/metrics'

test('reviewed registry keeps the DGA matter and registry counts', () => {
  assert.equal(MATTERS.length, 19)
  assert.equal(MATTERS.filter((item) => item.phase === 'reasoned_opinion').length, 10)
  assert.equal(INTERMEDIARIES.length, 41)
})

test('dashboard metrics preserve the DGA track semantics', () => {
  const metrics = getDashboardMetrics(MATTERS, INTERMEDIARIES, TRANSFER_WATCH)

  assert.equal(metrics.formalNoticeMatterCount, 19)
  assert.equal(metrics.reasonedOpinionCount, 10)
  assert.equal(metrics.intermediaryCount, 41)
  assert.equal(metrics.article31Status, 'not_located')
  assert.equal(metrics.article31PublicCaseCount, null)
})

test('matter de-duplication keeps one row per matter id', () => {
  assert.equal(dedupeMatters([MATTERS[0], MATTERS[0]]).length, 1)
})

test('matter filtering can target a Member State without changing the source registry', () => {
  const filtered = filterMatters(MATTERS, { country: 'DE', phase: 'all', query: '' })

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0].country.code, 'DE')
  assert.equal(MATTERS.length, 19)
})

test('every intermediary record has a country reference', () => {
  assert.equal(INTERMEDIARIES.filter((item) => item.country.code === 'NL').length, 11)
  assert.equal(INTERMEDIARIES.every((item) => Boolean(item.country.flag && item.country.name.en)), true)
})
