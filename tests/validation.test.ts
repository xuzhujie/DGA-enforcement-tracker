import assert from 'node:assert/strict'
import test from 'node:test'
import {
  AUTHORITY_SNAPSHOTS,
  DATA_ALTRUISM_ORGANISATIONS,
  FOLLOW_UP_REVIEWS,
  INTERMEDIARIES,
  MATTERS,
  TRANSFER_WATCH,
} from '../src/data/registry'
import { validateRegistry } from '../src/data/validation'

const validInput = {
  matters: MATTERS,
  intermediaries: INTERMEDIARIES,
  transferWatch: TRANSFER_WATCH,
  authorities: AUTHORITY_SNAPSHOTS,
  organisations: DATA_ALTRUISM_ORGANISATIONS,
  followUps: FOLLOW_UP_REVIEWS,
}

test('validates the reviewed registry without errors', () => {
  assert.deepEqual(validateRegistry(validInput), [])
})

test('rejects duplicate record identifiers', () => {
  const errors = validateRegistry({
    ...validInput,
    organisations: [DATA_ALTRUISM_ORGANISATIONS[0], DATA_ALTRUISM_ORGANISATIONS[0]],
  })

  assert.match(errors.join('\n'), /duplicate organisation id/)
})

test('rejects records without official source URLs', () => {
  const errors = validateRegistry({
    ...validInput,
    authorities: [{ ...AUTHORITY_SNAPSHOTS[0], sources: [{ ...AUTHORITY_SNAPSHOTS[0].sources[0], url: '' }] }],
  })

  assert.match(errors.join('\n'), /source URL is empty/)
})

test('rejects Article 31 numeric counts when the status is not located', () => {
  const errors = validateRegistry({
    ...validInput,
    transferWatch: [{ ...TRANSFER_WATCH[0], publicCaseCount: 0 }],
  })

  assert.match(errors.join('\n'), /Article 31/)
})

test('rejects follow-up records that do not point to a matter', () => {
  const errors = validateRegistry({
    ...validInput,
    followUps: [{ ...FOLLOW_UP_REVIEWS[0], matter_id: 'missing-matter' }],
  })

  assert.match(errors.join('\n'), /follow-up matter/)
})
