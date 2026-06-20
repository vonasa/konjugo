import type { Trigger } from '../types';

// L2 cue inventory: ONLY prepositions that govern a fixed case. Two-way
// prepositions (in/an/auf/…) are intentionally excluded — they don't determine
// the case without motion context. See DESIGN.md §4.6.
export const TRIGGERS: readonly Trigger[] = [
  // → Dative
  { word: 'mit', case: 'dat' },
  { word: 'aus', case: 'dat' },
  { word: 'bei', case: 'dat' },
  { word: 'von', case: 'dat' },
  { word: 'zu', case: 'dat' },
  { word: 'nach', case: 'dat' },
  { word: 'seit', case: 'dat' },
  // → Accusative
  { word: 'für', case: 'acc' },
  { word: 'ohne', case: 'acc' },
  { word: 'gegen', case: 'acc' },
  { word: 'um', case: 'acc' },
  { word: 'durch', case: 'acc' },
  // → Genitive (high tiers only)
  { word: 'wegen', case: 'gen' },
  { word: 'trotz', case: 'gen' },
  { word: 'während', case: 'gen' },
];

export function triggersForCase(c: Trigger['case']): Trigger[] {
  return TRIGGERS.filter((t) => t.case === c);
}
