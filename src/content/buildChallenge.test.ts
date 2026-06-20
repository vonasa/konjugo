import { describe, it, expect } from 'vitest';
import {
  buildChallenge,
  correctPhrase,
  pickSpec,
  type ChallengeSpec,
  type SpecConstraints,
} from './buildChallenge';
import { nounByLemma } from './data/nouns';
import { mulberry32 } from '../util/rng';
import type { Case } from './types';

function correctWord(spec: ChallengeSpec): string {
  const ch = buildChallenge(spec);
  const c = ch.options.find((o) => o.id === ch.correctOptionId);
  return c!.word;
}

const base = {
  genderCue: 'full',
  number: 'sg',
} as const;

describe('full-phrase assembly', () => {
  it('mit dem guten Mann (definite · dat · L2)', () => {
    const ch = buildChallenge({
      ...base,
      adjStem: 'gut',
      noun: nounByLemma('Mann'),
      articleType: 'definite',
      case: 'dat',
      cueMode: 'L2',
      trigger: { word: 'mit', case: 'dat' },
    });
    expect(correctPhrase(ch)).toBe('mit dem guten Mann');
    expect(ch.options).toHaveLength(5);
  });

  it('mit gutem Wein (strong · dat · L2, no article)', () => {
    const ch = buildChallenge({
      ...base,
      adjStem: 'gut',
      noun: nounByLemma('Wein'),
      articleType: 'none',
      case: 'dat',
      cueMode: 'L2',
      trigger: { word: 'mit', case: 'dat' },
    });
    expect(correctPhrase(ch)).toBe('mit gutem Wein');
  });

  it('ein guter Mann (mixed · nom · L1) — cue is a label, not in the phrase', () => {
    const ch = buildChallenge({
      ...base,
      adjStem: 'gut',
      noun: nounByLemma('Mann'),
      articleType: 'indefinite',
      case: 'nom',
      cueMode: 'L1',
    });
    expect(correctPhrase(ch)).toBe('ein guter Mann');
    expect(ch.prompt[0]).toEqual({ kind: 'cue', text: 'Nominativ' });
  });

  it('des guten Mannes (definite · gen · sg) — inflects the noun', () => {
    expect(
      correctPhrase(
        buildChallenge({
          ...base,
          adjStem: 'gut',
          noun: nounByLemma('Mann'),
          articleType: 'definite',
          case: 'gen',
          cueMode: 'L1',
        }),
      ),
    ).toBe('des guten Mannes');
  });

  it('die kleinen Hunde / den kleinen Hunden (plural; dative adds -n)', () => {
    const nom = buildChallenge({
      genderCue: 'full', number: 'pl', adjStem: 'klein',
      noun: nounByLemma('Hund'), articleType: 'definite', case: 'nom', cueMode: 'L1',
    });
    const dat = buildChallenge({
      genderCue: 'full', number: 'pl', adjStem: 'klein',
      noun: nounByLemma('Hund'), articleType: 'definite', case: 'dat', cueMode: 'L1',
    });
    expect(correctPhrase(nom)).toBe('die kleinen Hunde');
    expect(correctPhrase(dat)).toBe('den kleinen Hunden');
  });

  it('guter Wein (strong · nom · sg, no article)', () => {
    expect(
      correctWord({
        ...base, adjStem: 'gut', noun: nounByLemma('Wein'),
        articleType: 'none', case: 'nom', cueMode: 'L1',
      }),
    ).toBe('guter');
  });
});

describe('validation', () => {
  it('rejects indefinite + plural', () => {
    expect(() =>
      buildChallenge({
        genderCue: 'full', number: 'pl', adjStem: 'gut',
        noun: nounByLemma('Hund'), articleType: 'indefinite', case: 'nom', cueMode: 'L1',
      }),
    ).toThrow(/indefinite \+ plural/);
  });

  it('rejects an L2 challenge without a trigger', () => {
    expect(() =>
      buildChallenge({
        ...base, adjStem: 'gut', noun: nounByLemma('Mann'),
        articleType: 'definite', case: 'dat', cueMode: 'L2',
      }),
    ).toThrow(/requires a trigger/);
  });

  it('rejects a trigger whose case disagrees with the challenge', () => {
    expect(() =>
      buildChallenge({
        ...base, adjStem: 'gut', noun: nounByLemma('Mann'),
        articleType: 'definite', case: 'acc', cueMode: 'L2',
        trigger: { word: 'mit', case: 'dat' },
      }),
    ).toThrow(/governs dat, not acc/);
  });
});

describe('pickSpec invariants', () => {
  const allCases: readonly Case[] = ['nom', 'acc', 'dat', 'gen'];

  it('L2 never selects nominative and always pairs a matching trigger', () => {
    const rng = mulberry32(12345);
    const c: SpecConstraints = {
      cueMode: 'L2', cases: allCases,
      articleTypes: ['definite', 'indefinite', 'none'],
      numbers: ['sg', 'pl'], genderCue: 'color', tier: 3,
    };
    for (let i = 0; i < 300; i++) {
      const spec = pickSpec(rng, c);
      expect(spec.case).not.toBe('nom');
      expect(spec.trigger?.case).toBe(spec.case);
      expect(spec.articleType === 'indefinite' && spec.number === 'pl').toBe(false);
      expect(() => buildChallenge(spec)).not.toThrow();
    }
  });

  it('L1 covers all cases and never emits indefinite+plural', () => {
    const rng = mulberry32(999);
    const c: SpecConstraints = {
      cueMode: 'L1', cases: allCases,
      articleTypes: ['definite', 'indefinite', 'none'],
      numbers: ['sg', 'pl'], genderCue: 'full', tier: 1,
    };
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const spec = pickSpec(rng, c);
      seen.add(spec.case);
      expect(spec.articleType === 'indefinite' && spec.number === 'pl').toBe(false);
      expect(() => buildChallenge(spec)).not.toThrow();
    }
    expect(seen.size).toBe(4); // all four cases appear
  });
});
