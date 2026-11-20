import {
  AUTHORITY_SNAPSHOTS,
  DATA_ALTRUISM_ORGANISATIONS,
  FOLLOW_UP_REVIEWS,
  INTERMEDIARIES,
  MATTERS,
  TRANSFER_WATCH,
} from '../src/data/registry'
import { validateRegistry } from '../src/data/validation'

const errors = validateRegistry({
  matters: MATTERS,
  intermediaries: INTERMEDIARIES,
  transferWatch: TRANSFER_WATCH,
  authorities: AUTHORITY_SNAPSHOTS,
  organisations: DATA_ALTRUISM_ORGANISATIONS,
  followUps: FOLLOW_UP_REVIEWS,
})

if (errors.length) {
  console.error('DGA registry validation failed:')
  errors.forEach((error) => console.error('- ' + error))
  process.exitCode = 1
} else {
  console.log('DGA registry validation passed: reviewed IDs, official sources, dates and status semantics are consistent.')
}
