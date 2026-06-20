import { CONFIG } from './config';

// score = round( BASE × speedFactor × comboMult × tierMult )  — DESIGN.md §5.5

/** Fraction of the clock left when answered (1 = instant, floored so slow-but-correct still pays). */
export function speedFactor(responseMs: number, clockMs: number): number {
  if (clockMs <= 0) return CONFIG.SPEED_FLOOR;
  const left = 1 - responseMs / clockMs;
  return Math.max(CONFIG.SPEED_FLOOR, Math.min(1, left));
}

/** Consecutive-correct multiplier; `streak` is this answer's combo count. */
export function comboMultiplier(streak: number): number {
  return 1 + Math.min(Math.max(streak, 0), CONFIG.COMBO_CAP) / 10;
}

export function tierMultiplier(tier: number): number {
  return 1 + CONFIG.TIER_MULT_STEP * Math.max(0, tier - 1);
}

export function roundPoints(
  responseMs: number,
  clockMs: number,
  streak: number,
  tier: number,
): number {
  return Math.round(
    CONFIG.BASE_POINTS *
      speedFactor(responseMs, clockMs) *
      comboMultiplier(streak) *
      tierMultiplier(tier),
  );
}
