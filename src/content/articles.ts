import type { ArticleType, Case, GenderKey } from './types';

// Surface forms of the article shown in the prompt. (Strong / "none" has no article.)

const definite: Record<Case, Record<GenderKey, string>> = {
  nom: { m: 'der', f: 'die', n: 'das', pl: 'die' },
  acc: { m: 'den', f: 'die', n: 'das', pl: 'die' },
  dat: { m: 'dem', f: 'der', n: 'dem', pl: 'den' },
  gen: { m: 'des', f: 'der', n: 'des', pl: 'der' },
};

// Indefinite is singular-only in v1 ("ein" has no plural). Plural indefinite
// (keine/meine …) is deferred — see DESIGN.md §6.2.
const indefiniteSg: Record<Case, Record<Exclude<GenderKey, 'pl'>, string>> = {
  nom: { m: 'ein', f: 'eine', n: 'ein' },
  acc: { m: 'einen', f: 'eine', n: 'ein' },
  dat: { m: 'einem', f: 'einer', n: 'einem' },
  gen: { m: 'eines', f: 'einer', n: 'eines' },
};

/** The article word to show, or null when there is no article (strong). */
export function getArticle(
  articleType: ArticleType,
  c: Case,
  gender: GenderKey,
): string | null {
  if (articleType === 'none') return null;
  if (articleType === 'definite') return definite[c][gender];
  if (gender === 'pl') {
    throw new Error('indefinite + plural is not supported in v1');
  }
  return indefiniteSg[c][gender];
}
