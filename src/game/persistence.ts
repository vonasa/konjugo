// The only persisted state: a personal best (DESIGN.md §5.5). Defensive around
// environments where localStorage is unavailable (private mode, SSR, tests).

const KEY = 'konjugo.best.v1';

export function getBest(): number {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Store `score` if it beats the current best. Returns true if it's a new best. */
export function setBest(score: number): boolean {
  try {
    if (score > getBest()) {
      localStorage.setItem(KEY, String(score));
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
