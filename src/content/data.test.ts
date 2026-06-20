import { describe, it, expect } from 'vitest';
import { PAIRINGS } from './data/pairings';
import { NOUNS, nounByLemma } from './data/nouns';
import { ADJECTIVES } from './data/adjectives';
import { buildChallenge } from './buildChallenge';
import { ARTICLE_TYPES, CASES } from './types';

const adjSet = new Set(ADJECTIVES.map((a) => a.stem));
const nounSet = new Set(NOUNS.map((n) => n.lemma));

describe('content data integrity', () => {
  it('every pairing references a known noun and a known adjective', () => {
    for (const p of PAIRINGS) {
      expect(nounSet.has(p.noun), `noun "${p.noun}"`).toBe(true);
      expect(adjSet.has(p.adj), `adj "${p.adj}"`).toBe(true);
    }
  });

  it('has a healthy, varied pool', () => {
    expect(PAIRINGS.length).toBeGreaterThanOrEqual(150);
    expect(new Set(PAIRINGS.map((p) => p.noun)).size).toBeGreaterThanOrEqual(40);
    expect(ADJECTIVES.length).toBeGreaterThanOrEqual(25);
  });

  it('every pairing builds a valid challenge across all cases × articles (sg)', () => {
    for (const p of PAIRINGS) {
      const noun = nounByLemma(p.noun);
      for (const articleType of ARTICLE_TYPES) {
        for (const c of CASES) {
          const ch = buildChallenge({
            adjStem: p.adj, noun, articleType, case: c,
            number: 'sg', cueMode: 'L1', genderCue: 'full',
          });
          expect(ch.options).toHaveLength(5);
          expect(ch.options.some((o) => o.id === ch.correctOptionId)).toBe(true);
        }
      }
    }
  });

  it('every pairing builds in plural (definite + strong)', () => {
    for (const p of PAIRINGS) {
      const noun = nounByLemma(p.noun);
      for (const articleType of ['definite', 'none'] as const) {
        for (const c of CASES) {
          expect(() =>
            buildChallenge({
              adjStem: p.adj, noun, articleType, case: c,
              number: 'pl', cueMode: 'L1', genderCue: 'full',
            }),
          ).not.toThrow();
        }
      }
    }
  });
});
