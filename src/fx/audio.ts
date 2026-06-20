import { isMuted } from '../game/settings';

// Procedural sound effects via Web Audio — zero asset files. Mute-aware, and
// the context is only resumed after a user gesture (mobile autoplay policy).

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

/** Resume the audio context on the first user gesture. */
export function initAudioUnlock(): void {
  const resume = (): void => {
    const c = context();
    if (c && c.state === 'suspended') void c.resume();
  };
  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
}

interface ToneOpts {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
}

function tone(c: AudioContext, o: ToneOpts): void {
  const t0 = c.currentTime + (o.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + o.dur);
  const peak = o.gain ?? 0.18;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.02);
}

export const sfx = {
  /** Two-note chime; pitch rises with the combo streak. */
  correct(combo = 1): void {
    if (isMuted()) return;
    const c = context();
    if (!c) return;
    const base = 520 + Math.min(combo, 12) * 28;
    tone(c, { freq: base, dur: 0.12, type: 'triangle', gain: 0.16 });
    tone(c, { freq: base * 1.5, dur: 0.14, type: 'triangle', gain: 0.12, delay: 0.085 });
  },
  /** Low descending buzz. */
  wrong(): void {
    if (isMuted()) return;
    const c = context();
    if (!c) return;
    tone(c, { freq: 220, dur: 0.26, type: 'sawtooth', gain: 0.13, slideTo: 110 });
  },
  /** Descending three-note motif. */
  gameOver(): void {
    if (isMuted()) return;
    const c = context();
    if (!c) return;
    [392, 311, 233].forEach((f, i) =>
      tone(c, { freq: f, dur: 0.32, type: 'triangle', gain: 0.15, delay: i * 0.17 }),
    );
  },
};
