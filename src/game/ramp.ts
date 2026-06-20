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

/** The grammar pool + clock for a given tier (stages plateau at the last one). */
export function planForTier(preset: Preset, tier: number): TierPlan {
  const idx = Math.min(Math.max(tier, 1) - 1, preset.ramp.length - 1);
  const stage = preset.ramp[idx];
  if (!stage) throw new Error('empty ramp');
  const clockMs = Math.max(
    CONFIG.CLOCK_FLOOR_MS,
    preset.baseClockMs - (tier - 1) * CONFIG.CLOCK_STEP_MS,
  );
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
