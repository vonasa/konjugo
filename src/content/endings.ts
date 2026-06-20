import type { ArticleType, Case, Ending, GenderKey } from './types';

// ------------------------------------------------------------------ //
// The source of truth: German attributive adjective endings.
// Indexed [articleType][case][gender]. See DESIGN.md §4.2.
//
//   definite   → "weak"   declension
//   indefinite → "mixed"  declension
//   none       → "strong" declension
// ------------------------------------------------------------------ //

type Table = Record<ArticleType, Record<Case, Record<GenderKey, Ending>>>;

// Weak — after a definite article (der/die/das …). Mostly -en, -e in nom + acc(f/n).
const weak: Record<Case, Record<GenderKey, Ending>> = {
  nom: { m: 'e', f: 'e', n: 'e', pl: 'en' },
  acc: { m: 'en', f: 'e', n: 'e', pl: 'en' },
  dat: { m: 'en', f: 'en', n: 'en', pl: 'en' },
  gen: { m: 'en', f: 'en', n: 'en', pl: 'en' },
};

// Mixed — after ein/kein/possessive. Like weak, but the adjective carries the
// marker in the three "naked ein" cells: nom-m (-er), nom-n (-es), acc-n (-es).
const mixed: Record<Case, Record<GenderKey, Ending>> = {
  nom: { m: 'er', f: 'e', n: 'es', pl: 'en' },
  acc: { m: 'en', f: 'e', n: 'es', pl: 'en' },
  dat: { m: 'en', f: 'en', n: 'en', pl: 'en' },
  gen: { m: 'en', f: 'en', n: 'en', pl: 'en' },
};

// Strong — no article. The adjective carries all the case/gender information,
// so it mirrors the der-word endings. Note gen m/n is -en (noun takes -s).
const strong: Record<Case, Record<GenderKey, Ending>> = {
  nom: { m: 'er', f: 'e', n: 'es', pl: 'e' },
  acc: { m: 'en', f: 'e', n: 'es', pl: 'e' },
  dat: { m: 'em', f: 'er', n: 'em', pl: 'en' },
  gen: { m: 'en', f: 'er', n: 'en', pl: 'er' },
};

export const ENDINGS_TABLE: Table = {
  definite: weak,
  indefinite: mixed,
  none: strong,
};

export function getEnding(
  articleType: ArticleType,
  c: Case,
  gender: GenderKey,
): Ending {
  return ENDINGS_TABLE[articleType][c][gender];
}
