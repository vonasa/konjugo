import type { GenderCuePolicy, GenderKey } from '../content/types';
import { el } from './dom';

const GENDER_CLASS: Record<GenderKey, string> = {
  m: 'g-m',
  f: 'g-f',
  n: 'g-n',
  pl: 'g-pl',
};

const GENDER_TAG: Record<GenderKey, string> = {
  m: 'm',
  f: 'f',
  n: 'n',
  pl: 'pl',
};

/** Apply the gender cue (color and/or tag) to a noun element per the policy. */
export function applyGenderCue(
  node: HTMLElement,
  gender: GenderKey,
  policy: GenderCuePolicy,
): void {
  if (policy === 'off') return;
  node.classList.add(GENDER_CLASS[gender]); // color for 'color' and 'full'
  if (policy === 'full') {
    node.append(el('sup', { class: 'g-tag', text: GENDER_TAG[gender] }));
  }
}
