import type {
  ArticleType,
  Case,
  CueMode,
  GenderCuePolicy,
  NumberKind,
} from '../content/types';

// A ramp stage widens the grammar pool. Difficulty climbs by advancing stages
// (case-major: master cases on the easy definite article first, then add the
// harder article types; plural + genitive are gated to later stages).
export interface Stage {
  cases: Case[];
  articleTypes: ArticleType[];
  numbers: NumberKind[];
}

// L1 (labeled case) — includes nominative.
const RAMP_L1: Stage[] = [
  { cases: ['nom'], articleTypes: ['definite'], numbers: ['sg'] },
  { cases: ['nom', 'acc'], articleTypes: ['definite'], numbers: ['sg'] },
  { cases: ['nom', 'acc', 'dat'], articleTypes: ['definite'], numbers: ['sg'] },
  { cases: ['nom', 'acc', 'dat'], articleTypes: ['definite'], numbers: ['sg', 'pl'] },
  { cases: ['nom', 'acc', 'dat'], articleTypes: ['definite', 'indefinite'], numbers: ['sg', 'pl'] },
  { cases: ['nom', 'acc', 'dat'], articleTypes: ['definite', 'indefinite', 'none'], numbers: ['sg', 'pl'] },
  { cases: ['nom', 'acc', 'dat', 'gen'], articleTypes: ['definite', 'indefinite', 'none'], numbers: ['sg', 'pl'] },
];

// L2 (preposition trigger) — no nominative (no preposition governs it).
const RAMP_L2: Stage[] = [
  { cases: ['acc'], articleTypes: ['definite'], numbers: ['sg'] },
  { cases: ['acc', 'dat'], articleTypes: ['definite'], numbers: ['sg'] },
  { cases: ['acc', 'dat'], articleTypes: ['definite'], numbers: ['sg', 'pl'] },
  { cases: ['acc', 'dat'], articleTypes: ['definite', 'indefinite'], numbers: ['sg', 'pl'] },
  { cases: ['acc', 'dat'], articleTypes: ['definite', 'indefinite', 'none'], numbers: ['sg', 'pl'] },
  { cases: ['acc', 'dat', 'gen'], articleTypes: ['definite', 'indefinite', 'none'], numbers: ['sg', 'pl'] },
];

export interface Preset {
  id: 'beginner' | 'intermediate' | 'advanced';
  name: string;
  blurb: string;
  cueMode: CueMode;
  genderCue: GenderCuePolicy;
  baseClockMs: number;
  ramp: Stage[];
}

export const PRESETS: Preset[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    blurb: 'Case labelled · gender shown · gentle clock',
    cueMode: 'L1',
    genderCue: 'full',
    baseClockMs: 8450,
    ramp: RAMP_L1,
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    blurb: 'Preposition cues · gender coloured · standard clock',
    cueMode: 'L2',
    genderCue: 'color',
    baseClockMs: 6760,
    ramp: RAMP_L2,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    blurb: 'Preposition cues · recall the gender · fast clock',
    cueMode: 'L2',
    genderCue: 'off',
    baseClockMs: 4732,
    ramp: RAMP_L2,
  },
];

export function presetById(id: Preset['id']): Preset {
  const p = PRESETS.find((x) => x.id === id);
  if (!p) throw new Error(`unknown preset: ${id}`);
  return p;
}
