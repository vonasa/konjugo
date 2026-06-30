import type { GrammarChallenge } from '../content/types';
import { el, mustEl } from './dom';
import { applyGenderCue } from './genderCue';
import { ruleText } from './ruleReveal';

function correctOption(ch: GrammarChallenge) {
  const c = ch.options.find((o) => o.id === ch.correctOptionId);
  if (!c) throw new Error('challenge has no correct option');
  return c;
}

/** Render the prompt card: optional cue chip, then the phrase line with a blank. */
export function renderPrompt(ch: GrammarChallenge): HTMLElement {
  const card = el('div', { class: 'prompt-card' });
  const header = el('div', { class: 'prompt-header' });
  const line = el('div', { class: 'prompt-line' });

  for (const t of ch.prompt) {
    switch (t.kind) {
      case 'cue':
        header.append(el('span', { class: 'cue-chip', text: t.text }));
        break;
      case 'trigger':
        line.append(el('span', { class: 'tok trigger', text: t.text }));
        break;
      case 'article':
        line.append(el('span', { class: 'tok article', text: t.text }));
        break;
      case 'blank': {
        const slot = el('span', { class: 'tok adj-slot' });
        slot.append(
          el('span', { class: 'adj-stem', text: correctOption(ch).stem }),
          el('span', { class: 'adj-blank' }),
        );
        line.append(slot);
        break;
      }
      case 'noun': {
        const noun = el('span', { class: 'tok noun', text: t.text });
        applyGenderCue(noun, ch.meta.gender, ch.meta.genderCue);
        line.append(noun);
        break;
      }
    }
  }

  if (header.childElementCount > 0) card.append(header);
  card.append(line);
  return card;
}

/** On a miss: drop the correct form into the blank, ending highlighted. */
export function revealBlankIn(card: HTMLElement, ch: GrammarChallenge): void {
  const slot = card.querySelector<HTMLElement>('.adj-slot');
  if (!slot) return;
  const correct = correctOption(ch);
  slot.replaceChildren(
    el('span', { class: 'adj-stem', text: correct.stem }),
    el('span', { class: 'hl', text: correct.ending }),
  );
  slot.classList.add('revealed');
}

/** On a miss: append the compact rule tag below the phrase. */
export function showRuleIn(card: HTMLElement, ch: GrammarChallenge): void {
  card.append(el('div', { class: 'rule-tag', text: ruleText(ch.rule) }));
}

/** On a miss: a dim hint that holding (mouse/touch anywhere, or Space) freezes
 *  the auto-advance so the player can study the revealed answer. */
export function showInspectHintIn(card: HTMLElement): void {
  card.append(
    el(
      'div',
      { class: 'inspect-hint' },
      el(
        'span',
        { class: 'when-idle' },
        '⏸ Hold anywhere',
        el('span', { class: 'kbd-only', text: ' or Space' }),
        ' to study',
      ),
      el('span', { class: 'when-held', text: 'Paused — release to continue' }),
    ),
  );
}

export { mustEl };
