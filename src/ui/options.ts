import type { GrammarChallenge } from '../content/types';
import { el } from './dom';

export interface OptionsView {
  root: HTMLElement;
  buttons: HTMLButtonElement[];
}

/** Five answer buttons (2-2-1 grid), each showing stem + highlighted ending
 *  and a 1–5 key hint (desktop). `onPick` fires with the option id. */
export function renderOptions(
  ch: GrammarChallenge,
  onPick: (optionId: string) => void,
): OptionsView {
  const root = el('div', { class: 'options' });
  const buttons = ch.options.map((o, i) => {
    const btn = el('button', {
      class: 'option',
      attrs: { type: 'button', 'data-id': o.id, 'aria-label': o.word },
    });
    btn.append(
      el('span', { class: 'opt-word' },
        el('span', { class: 'opt-stem', text: o.stem }),
        el('span', { class: 'opt-hl', text: o.ending }),
      ),
      el('span', { class: 'key-hint', text: String(i + 1) }),
    );
    btn.addEventListener('click', () => onPick(o.id));
    root.append(btn);
    return btn;
  });
  return { root, buttons };
}
