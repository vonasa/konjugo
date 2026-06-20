import { el } from './dom';

// The advancing-threat round timer: 👹 marches toward 🏰 over the round clock.
// Reaching the base = timeout. Visual only; the authoritative expiry is a JS
// timer so it stays correct regardless of animation.
//
//  - freeze(): permanent stop on an answer.
//  - pause()/resume(): temporary stop (e.g. while the reference overlay is open),
//    preserving the remaining time. CSS animations resume from where they paused;
//    the JS timer is re-armed for whatever time was left.
export class Threat {
  readonly root: HTMLElement;
  private readonly danger: HTMLElement;
  private readonly marcher: HTMLElement;
  private timer?: number;
  private onExpire?: () => void;
  private armedAt = 0;
  private remaining = 0;

  constructor() {
    this.danger = el('div', { class: 'threat-danger' });
    this.marcher = el('div', { class: 'threat-marcher', text: '👹' });
    this.root = el(
      'div',
      { class: 'threat', attrs: { 'aria-hidden': 'true' } },
      this.danger,
      this.marcher,
      el('div', { class: 'threat-base', text: '🏰' }),
    );
  }

  start(durationMs: number, onExpire: () => void): void {
    this.onExpire = onExpire;
    this.remaining = durationMs;
    this.root.style.setProperty('--dur', `${durationMs}ms`);
    void this.root.offsetWidth; // reflow so the animation restarts cleanly
    this.root.classList.add('running');
    this.arm(durationMs);
  }

  private arm(ms: number): void {
    this.armedAt = performance.now();
    this.timer = window.setTimeout(() => {
      this.timer = undefined;
      this.root.classList.add('struck');
      this.onExpire?.();
    }, Math.max(0, ms));
  }

  private stopVisual(): void {
    this.danger.style.animationPlayState = 'paused';
    this.marcher.style.animationPlayState = 'paused';
  }

  /** Temporary stop, preserving remaining time. */
  pause(): void {
    if (this.timer === undefined) return;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.remaining = Math.max(0, this.remaining - (performance.now() - this.armedAt));
    this.stopVisual();
  }

  /** Continue from where pause() left off. */
  resume(): void {
    if (this.timer !== undefined) return; // already running
    this.danger.style.animationPlayState = 'running';
    this.marcher.style.animationPlayState = 'running';
    this.arm(this.remaining);
  }

  /** Permanent stop (the round was answered). */
  freeze(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.stopVisual();
  }
}
