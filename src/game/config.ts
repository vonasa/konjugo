// Single source of tunable constants (mirrors DESIGN.md §10). Balanced in Phase 6.
export const CONFIG = {
  STARTING_LIVES: 4,
  TIER_ADVANCE_EVERY: 5, // correct answers per tier
  CLOCK_FLOOR_MS: 1600, // shortest a round clock can shrink to
  // Sawtooth difficulty curve (DESIGN §5.3): the clock shrinks each round within
  // a tier, then resets UP on tier-up to 90% of the previous tier's start clock.
  TIER_RESET_FACTOR: 0.9, // each new tier starts at 90% of the previous tier's start
  WITHIN_TIER_STEP: 0.06, // per-round clock reduction within a tier (fraction of tier start)
  BASE_POINTS: 100,
  COMBO_CAP: 20, // combo multiplier maxes at 1 + 20/10 = ×3
  TIER_MULT_STEP: 0.25, // tierMult = 1 + step·(tier-1)
  SPEED_FLOOR: 0.1, // a correct-but-slow answer still scores a little
  REVEAL_MS: 4000, // clock-paused rule reveal after a miss
  CORRECT_MS: 600, // brief pause after a correct answer
} as const;
