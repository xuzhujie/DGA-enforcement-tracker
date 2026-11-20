import assert from 'node:assert/strict'
import test from 'node:test'
import {
  AUTHORITY_SNAPSHOTS,
  DATA_ALTRUISM_ORGANISATIONS,
  FOLLOW_UP_REVIEWS,
  MATTERS,
  TRANSFER_WATCH,
} from '../src/data/registry'
import { getGovernanceMetrics } from '../src/data/metrics'

test('authority snapshot covers all EU Member States without changing procedure counts', () => {
  assert.equal(AUTHORITY_SNAPSHOTS.length, 27)
  assert.equal(new Set(AUTHORITY_SNAPSHOTS.map((item) => item.country.code)).size, 27)
  assert.equal(AUTHORITY_SNAPSHOTS.find((item) => item.country.code === 'DE')?.dataIntermediation[0], 'Bundesnetzagentur (BNetzA)')
  assert.deepEqual(AUTHORITY_SNAPSHOTS.find((item) => item.country.code === 'CY')?.dataIntermediation, [])
  assert.equal(MATTERS.length, 19)
})

test('recognised data altruism organisations stay in their own register', () => {
  assert.equal(DATA_ALTRUISM_ORGANISATIONS.length, 7)
  assert.equal(new Set(DATA_ALTRUISM_ORGANISATIONS.map((item) => item.country.code)).size, 5)
  assert.equal(DATA_ALTRUISM_ORGANISATIONS.find((item) => item.organisation === 'Hinterland Systems')?.status, 'recognised')
  assert.equal(DATA_ALTRUISM_ORGANISATIONS.some((item) => item.organisation.includes('Datalog')), true)
})

test('follow-up reviews expose no-later-signal semantics without inferring closure', () => {
  assert.equal(FOLLOW_UP_REVIEWS.length, 19)
  assert.equal(FOLLOW_UP_REVIEWS.every((item) => item.status === 'not_located'), true)
  assert.equal(FOLLOW_UP_REVIEWS.every((item) => item.sources.length > 0), true)
})

test('Article 31 supports located cases while preserving current not-located state', () => {
  assert.deepEqual(TRANSFER_WATCH[0].cases, [])
  const metrics = getGovernanceMetrics(AUTHORITY_SNAPSHOTS, DATA_ALTRUISM_ORGANISATIONS, FOLLOW_UP_REVIEWS, TRANSFER_WATCH)

  assert.equal(metrics.authorityCountryCount, 27)
  assert.equal(metrics.dataAltruismOrganisationCount, 7)
  assert.equal(metrics.followUpReviewCount, 19)
  assert.equal(metrics.article31LocatedCaseCount, 0)
})
