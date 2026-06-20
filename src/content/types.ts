// ------------------------------------------------------------------ //
// Core grammar types. The GrammarChallenge shape is deliberately
// module-agnostic: a future verb-conjugation module emits the same shape,
// so the game shell never needs to know it's about adjectives.
// ------------------------------------------------------------------ //

/** Lexical gender a noun actually has. */
export type LexGender = 'm' | 'f' | 'n';

/** The gender/number dimension of the endings table (plural is its own column). */
export type GenderKey = 'm' | 'f' | 'n' | 'pl';

export type Case = 'nom' | 'acc' | 'dat' | 'gen';

/** Which declension pattern the preceding article triggers. */
export type ArticleType = 'definite' | 'indefinite' | 'none';

/** The five attributive adjective endings — the only possible answers. */
export type Ending = 'e' | 'en' | 'er' | 'es' | 'em';

export type NumberKind = 'sg' | 'pl';
export type CueMode = 'L1' | 'L2';
export type GenderCuePolicy = 'full' | 'color' | 'off';

export const CASES: readonly Case[] = ['nom', 'acc', 'dat', 'gen'];
export const GENDER_KEYS: readonly GenderKey[] = ['m', 'f', 'n', 'pl'];
export const ARTICLE_TYPES: readonly ArticleType[] = [
  'definite',
  'indefinite',
  'none',
];
export const ENDINGS: readonly Ending[] = ['e', 'en', 'er', 'es', 'em'];

/** German case labels for the L1 cue chip. */
export const CASE_LABEL: Record<Case, string> = {
  nom: 'Nominativ',
  acc: 'Akkusativ',
  dat: 'Dativ',
  gen: 'Genitiv',
};

/** Short article-class label used in the in-round rule reveal. */
export const ARTICLE_CLASS_LABEL: Record<ArticleType, string> = {
  definite: 'der-word',
  indefinite: 'ein-word',
  none: 'no article',
};

// ---- The rendered challenge ----------------------------------------- //

export type PromptToken =
  | { kind: 'cue'; text: string } // L1 case label
  | { kind: 'trigger'; text: string } // L2 preposition
  | { kind: 'article'; text: string }
  | { kind: 'blank' } // the adjective slot
  | { kind: 'noun'; text: string; gender: LexGender };

export interface Option {
  id: string;
  word: string;
  stem: string;
  ending: Ending;
}

export interface RuleExplanation {
  case: Case;
  articleType: ArticleType;
  gender: GenderKey;
  ending: Ending;
}

export interface ChallengeMeta {
  case: Case;
  articleType: ArticleType;
  gender: GenderKey;
  number: NumberKind;
  cueMode: CueMode;
  genderCue: GenderCuePolicy;
  tier: number;
}

export interface GrammarChallenge {
  id: string;
  moduleId: 'adj-declension';
  prompt: PromptToken[];
  options: Option[]; // always 5
  correctOptionId: string;
  rule: RuleExplanation;
  meta: ChallengeMeta;
}

// ---- Seed data shapes ----------------------------------------------- //

export interface Adjective {
  /** Inflectable stem, e.g. "gut" → gute/guter/... (regular stems only in v1). */
  stem: string;
}

export interface Noun {
  lemma: string; // nominative singular
  gender: LexGender;
  plural: string; // irregular → stored explicitly
  /** Genitive singular for m/n nouns (e.g. "Mannes"); fem nouns don't change. */
  genitiveSg?: string;
}

export interface Trigger {
  word: string;
  case: Case;
}

/** An attested adjective+noun pairing (the spine of generation). */
export interface Pairing {
  adj: string; // adjective stem
  noun: string; // noun lemma
}
