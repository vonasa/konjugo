import type { GrammarChallenge } from '../content/types';
import { clear } from './dom';
import { renderPrompt, revealBlankIn, showRuleIn } from './promptCard';
import { renderOptions } from './options';
import { Threat } from './threat';
import { CONFIG } from '../game/config';
import { sfx } from '../fx/audio';
import { burstAt, screenFlash } from '../fx/particles';

export interface RoundResult {
  correct: boolean;
  timedOut: boolean;
  aborted?: boolean; // session abandoned mid-round (restart → menu)
  chosenId: string | null;
  correctId: string;
  responseMs: number;
}

export interface RoundOptions {
  clockMs: number;
  /** The combo streak this answer would reach if correct (drives sound pitch). */
  combo?: number;
}

export interface RoundTiming {
  correctMs: number;
  revealMs: number;
}

const DEFAULT_TIMING: RoundTiming = {
  correctMs: CONFIG.CORRECT_MS,
  revealMs: CONFIG.REVEAL_MS,
};

interface ActiveRound {
  threat: Threat;
  start: number;
  pausedAt: number; // 0 when not paused
  resolved: boolean;
  resolve: (r: RoundResult) => void; // resolver of the mount() promise
}

/** Renders one challenge with the advancing-threat clock, handles tap/click +
 *  keys 1–5, shows feedback and the (clock-paused) rule reveal on a miss or
 *  timeout, then resolves with the result. Supports pause()/resume() so the
 *  reference overlay can freeze play. */
export class RoundView {
  private keyHandler?: (e: KeyboardEvent) => void;
  private current?: ActiveRound;
  private paused = false;
  private aborted = false;

  constructor(
    private readonly container: HTMLElement,
    private readonly timing: RoundTiming = DEFAULT_TIMING,
  ) {}

  /** Pause the active round (e.g. while the reference overlay is open). */
  pause(): void {
    if (this.paused) return;
    this.paused = true;
    const s = this.current;
    if (s && !s.resolved && s.pausedAt === 0) {
      s.pausedAt = performance.now();
      s.threat.pause();
    }
  }

  /** Resume and credit back the paused time so it doesn't count against the answer. */
  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    const s = this.current;
    if (s && !s.resolved && s.pausedAt !== 0) {
      s.start += performance.now() - s.pausedAt;
      s.pausedAt = 0;
      s.threat.resume();
    }
  }

  /** Abandon the current round (restart → menu): stop the clock and resolve the
   *  pending mount with an aborted result so the session loop exits cleanly. */
  cancel(): void {
    this.aborted = true;
    const s = this.current;
    this.current = undefined;
    if (!s || s.resolved) return;
    s.resolved = true;
    s.threat.freeze();
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = undefined;
    }
    s.resolve({
      correct: false,
      timedOut: false,
      aborted: true,
      chosenId: null,
      correctId: '',
      responseMs: 0,
    });
  }

  mount(ch: GrammarChallenge, opts: RoundOptions): Promise<RoundResult> {
    if (this.aborted) {
      return Promise.resolve({
        correct: false,
        timedOut: false,
        aborted: true,
        chosenId: null,
        correctId: ch.correctOptionId,
        responseMs: 0,
      });
    }
    return new Promise<RoundResult>((resolve) => {
      clear(this.container);
      const card = renderPrompt(ch);
      const threat = new Threat();
      const state: ActiveRound = {
        threat,
        start: performance.now(),
        pausedAt: 0,
        resolved: false,
        resolve,
      };
      this.current = state;

      const { root: optionsRoot, buttons } = renderOptions(ch, (id) =>
        handlePick(id),
      );
      this.container.append(card, threat.root, optionsRoot);

      const cleanup = (): void => {
        if (this.keyHandler) {
          document.removeEventListener('keydown', this.keyHandler);
          this.keyHandler = undefined;
        }
      };

      const markButtons = (chosenId: string | null): void => {
        for (const b of buttons) {
          b.disabled = true;
          const id = b.dataset['id'];
          if (id === ch.correctOptionId) b.classList.add('correct');
          else if (id === chosenId) b.classList.add('wrong');
        }
      };

      const settle = (result: RoundResult, delay: number): void => {
        cleanup();
        window.setTimeout(() => resolve(result), delay);
      };

      const handlePick = (chosenId: string): void => {
        if (state.resolved || this.paused) return;
        state.resolved = true;
        const responseMs = performance.now() - state.start;
        threat.freeze();
        const correct = chosenId === ch.correctOptionId;
        markButtons(chosenId);
        if (correct) {
          const btn = buttons.find((b) => b.dataset['id'] === chosenId);
          if (btn) {
            const r = btn.getBoundingClientRect();
            burstAt(r.left + r.width / 2, r.top + r.height / 2, 'var(--success)');
          }
          sfx.correct(opts.combo ?? 1);
        } else {
          sfx.wrong();
          screenFlash('wrong');
          revealBlankIn(card, ch);
          showRuleIn(card, ch);
        }
        settle(
          { correct, timedOut: false, chosenId, correctId: ch.correctOptionId, responseMs },
          correct ? this.timing.correctMs : this.timing.revealMs,
        );
      };

      const handleTimeout = (): void => {
        if (state.resolved) return;
        state.resolved = true;
        markButtons(null);
        sfx.wrong();
        revealBlankIn(card, ch);
        showRuleIn(card, ch);
        settle(
          {
            correct: false,
            timedOut: true,
            chosenId: null,
            correctId: ch.correctOptionId,
            responseMs: opts.clockMs,
          },
          this.timing.revealMs,
        );
      };

      this.keyHandler = (e: KeyboardEvent): void => {
        if (this.paused) return;
        const n = Number(e.key);
        if (Number.isInteger(n) && n >= 1 && n <= ch.options.length) {
          e.preventDefault();
          const opt = ch.options[n - 1];
          if (opt) handlePick(opt.id);
        }
      };
      document.addEventListener('keydown', this.keyHandler);

      threat.start(opts.clockMs, handleTimeout);
      // If the reference overlay is already open when this round begins, start paused.
      if (this.paused) {
        state.pausedAt = performance.now();
        threat.pause();
      }
    });
  }
}
