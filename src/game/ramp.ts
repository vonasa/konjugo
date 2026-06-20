import type { SpecConstraints } from '../content';
import { CONFIG } from './config';
import type { Preset } from './presets';

export interface TierPlan {
  constraints: SpecConstraints;
  clockMs: number;
}

/** Tier climbs one step per TIER_ADVANCE_EVERY correct answers (1-based). */
export function tierForCorrect(correctCount: number): number {
  return Math.floor(correctCount / CONFIG.TIER_ADVANCE_EVERY) + 1;
}

/** Grammar pool + round clock for the player's progress.
 *
 *  Clock is a sawtooth: each tier *starts* at 90% of the previous tier's start
 *  (`TIER_RESET_FACTOR^(tier-1) × base`), then shrinks every correct answer
 *  within the tier (`WITHIN_TIER_STEP` of the tier start per round). So speed
 *  ramps up inside a tier, then eases back on tier-up — never below the floor.
 */
export function planForProgress(preset: Preset, correctCount: number): TierPlan {
  const tier = tierForCorrect(correctCount);
  const posInTier = correctCount % CONFIG.TIER_ADVANCE_EVERY; // 0..N-1

  const tierStart =
    preset.baseClockMs * Math.pow(CONFIG.TIER_RESET_FACTOR, tier - 1);
  const clockMs = Math.max(
    CONFIG.CLOCK_FLOOR_MS,
    Math.round(tierStart * (1 - CONFIG.WITHIN_TIER_STEP * posInTier)),
  );

  const idx = Math.min(tier - 1, preset.ramp.length - 1);
  const stage = preset.ramp[idx];
  if (!stage) throw new Error('empty ramp');

  return {
    clockMs,
    constraints: {
      cueMode: preset.cueMode,
      cases: stage.cases,
      articleTypes: stage.articleTypes,
      numbers: stage.numbers,
      genderCue: preset.genderCue,
      tier,
    },
  };
}
