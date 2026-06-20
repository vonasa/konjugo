import {
  ARTICLE_CLASS_LABEL,
  CASE_LABEL,
  type GenderKey,
  type RuleExplanation,
} from '../content/types';

const GENDER_LABEL: Record<GenderKey, string> = {
  m: 'masc',
  f: 'fem',
  n: 'neut',
  pl: 'plural',
};

/** Compact rule shown in-round on a miss, e.g. "DATIV · der-word · masc → -en". */
export function ruleText(r: RuleExplanation): string {
  return `${CASE_LABEL[r.case].toUpperCase()} · ${ARTICLE_CLASS_LABEL[r.articleType]} · ${GENDER_LABEL[r.gender]} → -${r.ending}`;
}
