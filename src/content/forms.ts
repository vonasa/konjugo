import type { Case, Ending, Noun, NumberKind } from './types';
import { ENDINGS } from './types';

// ------------------------------------------------------------------ //
// Morphology helpers. Adjective forms are rule-generated (v1 uses regular
// stems only). Noun surface forms use stored irregular plurals + a couple
// of regular suffix rules.
// ------------------------------------------------------------------ //

/** All five inflected forms of a regular adjective stem. */
export function generateForms(stem: string): Record<Ending, string> {
  return {
    e: stem + 'e',
    en: stem + 'en',
    er: stem + 'er',
    es: stem + 'es',
    em: stem + 'em',
  };
}

/** The five answer options for a stem, in canonical order. */
export function optionForms(stem: string): { ending: Ending; word: string }[] {
  const forms = generateForms(stem);
  return ENDINGS.map((ending) => ({ ending, word: forms[ending] }));
}

/** Surface form of the noun for a given case + number. v1 uses strong nouns
 *  (no n-declension), so singular acc/dat equal the lemma. */
export function nounSurface(noun: Noun, c: Case, number: NumberKind): string {
  if (number === 'pl') {
    const base = noun.plural;
    // Dative plural adds -n unless the plural already ends in -n or -s.
    if (c === 'dat' && !/[ns]$/.test(base)) return base + 'n';
    return base;
  }
  // singular
  if (c === 'gen' && (noun.gender === 'm' || noun.gender === 'n')) {
    return noun.genitiveSg ?? noun.lemma + 's';
  }
  return noun.lemma;
}
