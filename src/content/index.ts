// Public surface of the content module.
export * from './types';
export { getEnding, ENDINGS_TABLE } from './endings';
export { getArticle } from './articles';
export { generateForms, optionForms, nounSurface } from './forms';
export {
  buildChallenge,
  correctPhrase,
  pickSpec,
  nextChallenge,
  type ChallengeSpec,
  type SpecConstraints,
} from './buildChallenge';
export { ADJECTIVES } from './data/adjectives';
export { NOUNS, nounByLemma } from './data/nouns';
export { TRIGGERS, triggersForCase } from './data/triggers';
export { PAIRINGS } from './data/pairings';
