import {
  CASE_LABEL,
  type ArticleType,
  type Case,
  type CueMode,
  type GenderCuePolicy,
  type GenderKey,
  type GrammarChallenge,
  type Noun,
  type NumberKind,
  type PromptToken,
  type Trigger,
} from './types';
import { getEnding } from './endings';
import { getArticle } from './articles';
import { nounSurface, optionForms } from './forms';
import { PAIRINGS } from './data/pairings';
import { nounByLemma } from './data/nouns';
import { triggersForCase } from './data/triggers';
import { pick, type Rng } from '../util/rng';

export interface ChallengeSpec {
  adjStem: string;
  noun: Noun;
  articleType: ArticleType;
  case: Case;
  number: NumberKind;
  cueMode: CueMode;
  trigger?: Trigger; // required when cueMode === 'L2'
  genderCue: GenderCuePolicy;
  tier?: number;
}

/** Assemble a fully-specified challenge. Pure + deterministic. */
export function buildChallenge(spec: ChallengeSpec): GrammarChallenge {
  const { adjStem, noun, articleType, number, cueMode, genderCue } = spec;
  const c = spec.case;

  if (number === 'pl' && articleType === 'indefinite') {
    throw new Error('indefinite + plural is not supported in v1');
  }

  const gender: GenderKey = number === 'pl' ? 'pl' : noun.gender;
  const ending = getEnding(articleType, c, gender);

  const options = optionForms(adjStem).map(({ ending: e, word }) => ({
    id: `opt-${e}`,
    word,
    stem: adjStem,
    ending: e,
  }));

  const prompt: PromptToken[] = [];
  if (cueMode === 'L2') {
    const trig = spec.trigger;
    if (!trig) throw new Error('L2 challenge requires a trigger');
    if (trig.case !== c) {
      throw new Error(
        `trigger "${trig.word}" governs ${trig.case}, not ${c}`,
      );
    }
    prompt.push({ kind: 'trigger', text: trig.word });
  } else {
    prompt.push({ kind: 'cue', text: CASE_LABEL[c] });
  }

  const article = getArticle(articleType, c, gender);
  if (article) prompt.push({ kind: 'article', text: article });
  prompt.push({ kind: 'blank' });
  prompt.push({
    kind: 'noun',
    text: nounSurface(noun, c, number),
    gender: noun.gender,
  });

  return {
    id: `${adjStem}|${noun.lemma}|${articleType}|${c}|${number}|${cueMode}`,
    moduleId: 'adj-declension',
    prompt,
    options,
    correctOptionId: `opt-${ending}`,
    rule: { case: c, articleType, gender, ending },
    meta: { case: c, articleType, gender, number, cueMode, genderCue, tier: spec.tier ?? 1 },
  };
}

/** The full, correctly-declined phrase (cue label omitted; used for reveals/tests). */
export function correctPhrase(ch: GrammarChallenge): string {
  const correct = ch.options.find((o) => o.id === ch.correctOptionId);
  if (!correct) throw new Error('challenge has no correct option');
  const parts: string[] = [];
  for (const t of ch.prompt) {
    if (t.kind === 'cue') continue; // a label, not part of the phrase
    if (t.kind === 'blank') parts.push(correct.word);
    else parts.push(t.text);
  }
  return parts.join(' ');
}

// ---- Selection (used by the ramp in later phases) ------------------- //

export interface SpecConstraints {
  cueMode: CueMode;
  cases: readonly Case[];
  articleTypes: readonly ArticleType[];
  numbers: readonly NumberKind[];
  genderCue: GenderCuePolicy;
  tier: number;
}

// No German preposition governs the nominative, so L2 can only be acc/dat/gen.
const L2_CASES: readonly Case[] = ['acc', 'dat', 'gen'];

/** Pick a random valid spec under the given constraints. */
export function pickSpec(rng: Rng, c: SpecConstraints): ChallengeSpec {
  const pairing = pick(rng, PAIRINGS);
  const noun = nounByLemma(pairing.noun);

  const casePool =
    c.cueMode === 'L2' ? c.cases.filter((x) => L2_CASES.includes(x)) : c.cases;
  if (casePool.length === 0) {
    throw new Error('no valid cases (L2 requires acc/dat/gen)');
  }
  const chosenCase = pick(rng, casePool);

  // Choose article type + number together, excluding the unsupported combo.
  const combos: { at: ArticleType; num: NumberKind }[] = [];
  for (const at of c.articleTypes) {
    for (const num of c.numbers) {
      if (at === 'indefinite' && num === 'pl') continue;
      combos.push({ at, num });
    }
  }
  if (combos.length === 0) throw new Error('no valid article/number combos');
  const combo = pick(rng, combos);

  const base: ChallengeSpec = {
    adjStem: pairing.adj,
    noun,
    articleType: combo.at,
    case: chosenCase,
    number: combo.num,
    cueMode: c.cueMode,
    genderCue: c.genderCue,
    tier: c.tier,
  };
  if (c.cueMode === 'L2') {
    base.trigger = pick(rng, triggersForCase(chosenCase));
  }
  return base;
}

/** Convenience: pick + build in one call. */
export function nextChallenge(rng: Rng, c: SpecConstraints): GrammarChallenge {
  return buildChallenge(pickSpec(rng, c));
}
