import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatDate } from './format'

test('formatDate accepts an ISO timestamp from the update feed', () => {
  assert.equal(formatDate('2026-11-20T00:00:00+08:00', 'zh'), '2026年11月20日')
  assert.equal(formatDate('2026-11-20T00:00:00+08:00', 'en'), '20/11/2026')
})
