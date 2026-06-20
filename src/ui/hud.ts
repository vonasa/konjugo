import { el } from './dom';
import { comboMultiplier } from '../game/scoring';
import { prefersReducedMotion } from '../fx/particles';

export interface HudState {
  lives: number;
  maxLives: number;
  tier: number;
  score: number;
  combo: number;
}

export interface Hud {
  root: HTMLElement;
  update(s: HudState): void;
}

/** Top bar: hearts + tier on the left, combo + score (+ optional ref button) right. */
export function createHud(refButton?: HTMLElement): Hud {
  const lives = el('div', { class: 'hud-lives', attrs: { 'aria-label': 'Lives' } });
  const tier = el('div', { class: 'hud-tier' });
  const combo = el('div', { class: 'hud-combo', attrs: { 'aria-label': 'Combo' } });
  const score = el('div', { class: 'hud-score', attrs: { 'aria-label': 'Score' } });

  const right = el('div', { class: 'hud-right' }, combo, score);
  if (refButton) right.append(refButton);
  const root = el(
    'div',
    { class: 'hud' },
    el('div', { class: 'hud-left' }, lives, tier),
    right,
  );

  let lastScore = 0;
  let lastCombo = 0;
  const pulse = (node: HTMLElement): void => {
    if (prefersReducedMotion()) return;
    node.classList.remove('pulse');
    void node.offsetWidth; // restart the animation
    node.classList.add('pulse');
  };

  function update(s: HudState): void {
    const hearts: HTMLElement[] = [];
    for (let i = 0; i < s.maxLives; i++) {
      const on = i < s.lives;
      hearts.push(
        el('span', { class: `heart ${on ? 'on' : 'off'}`, text: on ? '♥' : '♡' }),
      );
    }
    lives.replaceChildren(...hearts);
    tier.textContent = `Tier ${s.tier}`;
    score.textContent = String(s.score);
    combo.textContent =
      s.combo >= 2
        ? `${s.combo >= 5 ? '🔥' : ''}×${comboMultiplier(s.combo).toFixed(1)}`
        : '';
    if (s.score !== lastScore) pulse(score);
    if (s.combo > lastCombo && s.combo >= 2) pulse(combo);
    lastScore = s.score;
    lastCombo = s.combo;
  }

  return { root, update };
}
