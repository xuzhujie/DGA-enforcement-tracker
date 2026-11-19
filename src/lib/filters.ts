import type { MatterFilters, MatterPhase } from '../data/types'

export const DEFAULT_MATTER_FILTERS: MatterFilters = {
  country: 'all',
  phase: 'all',
  query: '',
}

export function updateMatterFilters(
  current: MatterFilters,
  patch: Partial<MatterFilters>,
): MatterFilters {
  return { ...current, ...patch }
}

export function isPhase(value: string): value is MatterPhase {
  return value === 'formal_notice' || value === 'reasoned_opinion'
}
