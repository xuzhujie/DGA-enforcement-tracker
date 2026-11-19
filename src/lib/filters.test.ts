import assert from 'node:assert/strict'
import test from 'node:test'
import { MATTERS } from '../data/registry'
import { filterMatters } from '../data/metrics'
import { formatCountOrUnknown, formatPhase, text } from './format'

test('empty matter query keeps the full reviewed population', () => {
  assert.equal(filterMatters(MATTERS, { country: 'all', phase: 'all', query: '' }).length, 19)
})

test('reasoned-opinion filter returns the ten progressed matters', () => {
  assert.equal(filterMatters(MATTERS, { country: 'all', phase: 'reasoned_opinion', query: '' }).length, 10)
})

test('no-match query returns an empty result without changing the registry', () => {
  assert.equal(filterMatters(MATTERS, { country: 'all', phase: 'all', query: 'not-a-real-country' }).length, 0)
  assert.equal(MATTERS.length, 19)
})

test('phase and bilingual helpers preserve the language distinction', () => {
  assert.notEqual(formatPhase('reasoned_opinion', 'zh'), formatPhase('reasoned_opinion', 'en'))
  assert.equal(text({ zh: '中文', en: 'English' }, 'en'), 'English')
})

test('unknown counts are not formatted as zero', () => {
  assert.equal(formatCountOrUnknown(null, 'zh'), '未定位到')
  assert.equal(formatCountOrUnknown(null, 'en'), 'Not located')
})
