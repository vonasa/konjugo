import { describe, it, expect } from 'vitest';
import { getEnding } from './endings';
import { generateForms, optionForms } from './forms';
import { ENDINGS, type ArticleType, type Case, type Ending, type GenderKey } from './types';

// The complete 48-cell table, independently transcribed from standard German
// declension references. This is the safety net: if a table cell is wrong, a
// known phrase here fails. [articleType, case, gender, expectedEnding]
const KNOWN: [ArticleType, Case, GenderKey, Ending][] = [
  // weak — definite article
  ['definite', 'nom', 'm', 'e'], ['definite', 'nom', 'f', 'e'], ['definite', 'nom', 'n', 'e'], ['definite', 'nom', 'pl', 'en'],
  ['definite', 'acc', 'm', 'en'], ['definite', 'acc', 'f', 'e'], ['definite', 'acc', 'n', 'e'], ['definite', 'acc', 'pl', 'en'],
  ['definite', 'dat', 'm', 'en'], ['definite', 'dat', 'f', 'en'], ['definite', 'dat', 'n', 'en'], ['definite', 'dat', 'pl', 'en'],
  ['definite', 'gen', 'm', 'en'], ['definite', 'gen', 'f', 'en'], ['definite', 'gen', 'n', 'en'], ['definite', 'gen', 'pl', 'en'],
  // mixed — indefinite article
  ['indefinite', 'nom', 'm', 'er'], ['indefinite', 'nom', 'f', 'e'], ['indefinite', 'nom', 'n', 'es'], ['indefinite', 'nom', 'pl', 'en'],
  ['indefinite', 'acc', 'm', 'en'], ['indefinite', 'acc', 'f', 'e'], ['indefinite', 'acc', 'n', 'es'], ['indefinite', 'acc', 'pl', 'en'],
  ['indefinite', 'dat', 'm', 'en'], ['indefinite', 'dat', 'f', 'en'], ['indefinite', 'dat', 'n', 'en'], ['indefinite', 'dat', 'pl', 'en'],
  ['indefinite', 'gen', 'm', 'en'], ['indefinite', 'gen', 'f', 'en'], ['indefinite', 'gen', 'n', 'en'], ['indefinite', 'gen', 'pl', 'en'],
  // strong — no article
  ['none', 'nom', 'm', 'er'], ['none', 'nom', 'f', 'e'], ['none', 'nom', 'n', 'es'], ['none', 'nom', 'pl', 'e'],
  ['none', 'acc', 'm', 'en'], ['none', 'acc', 'f', 'e'], ['none', 'acc', 'n', 'es'], ['none', 'acc', 'pl', 'e'],
  ['none', 'dat', 'm', 'em'], ['none', 'dat', 'f', 'er'], ['none', 'dat', 'n', 'em'], ['none', 'dat', 'pl', 'en'],
  ['none', 'gen', 'm', 'en'], ['none', 'gen', 'f', 'er'], ['none', 'gen', 'n', 'en'], ['none', 'gen', 'pl', 'er'],
];

describe('endings table', () => {
  it('covers all 48 cells', () => {
    expect(KNOWN).toHaveLength(48);
  });

  it.each(KNOWN)('%s %s %s → -%s', (at, c, g, expected) => {
    expect(getEnding(at, c, g)).toBe(expected);
  });

  it('produces the right "gut" form for a few landmark phrases', () => {
    const f = generateForms('gut');
    expect(f[getEnding('definite', 'nom', 'm')]).toBe('gute'); // der gute Mann
    expect(f[getEnding('indefinite', 'nom', 'm')]).toBe('guter'); // ein guter Mann
    expect(f[getEnding('none', 'dat', 'm')]).toBe('gutem'); // mit gutem Wein
    expect(f[getEnding('none', 'nom', 'n')]).toBe('gutes'); // gutes Bier
    expect(f[getEnding('definite', 'dat', 'pl')]).toBe('guten'); // den guten ...
  });
});

describe('form generation', () => {
  it('generates the five regular forms', () => {
    expect(generateForms('gut')).toEqual({
      e: 'gute', en: 'guten', er: 'guter', es: 'gutes', em: 'gutem',
    });
  });

  it('optionForms yields 5 distinct words covering all endings', () => {
    const opts = optionForms('klein');
    expect(opts).toHaveLength(5);
    expect(new Set(opts.map((o) => o.word)).size).toBe(5);
    expect(opts.map((o) => o.ending).sort()).toEqual([...ENDINGS].sort());
  });
});
