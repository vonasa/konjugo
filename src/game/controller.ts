import { nextChallenge } from '../content';
import type { Rng } from '../util/rng';
import type { Hud } from '../ui/hud';
import type { RoundView } from '../ui/round';
import type { GameStats } from '../ui/gameOver';
import { CONFIG } from './config';
import { planForProgress, tierForCorrect } from './ramp';
import type { Preset } from './presets';
import { roundPoints } from './scoring';

export interface SessionDeps {
  rng: Rng;
  hud: Hud;
  view: RoundView;
}

/** Runs one game: rounds with a rising tier ramp until lives are gone. */
export async function runSession(
  preset: Preset,
  deps: SessionDeps,
): Promise<GameStats | null> {
  let lives = CONFIG.STARTING_LIVES;
  let score = 0;
  let combo = 0;
  let longestCombo = 0;
  let correct = 0;
  let answered = 0;
  let maxTier = 1;

  for (;;) {
    const plan = planForProgress(preset, correct);
    const tier = plan.constraints.tier;
    maxTier = Math.max(maxTier, tier);

    deps.hud.update({ lives, maxLives: CONFIG.STARTING_LIVES, tier, score, combo });

    const challenge = nextChallenge(deps.rng, plan.constraints);
    const res = await deps.view.mount(challenge, {
      clockMs: plan.clockMs,
      combo: combo + 1, // streak reached if this answer is correct
    });
    if (res.aborted) return null; // restart → back to menu
    answered++;

    if (res.correct) {
      correct++;
      combo++;
      longestCombo = Math.max(longestCombo, combo);
      score += roundPoints(res.responseMs, plan.clockMs, combo, tier);
    } else {
      lives--;
      combo = 0;
    }

    deps.hud.update({
      lives,
      maxLives: CONFIG.STARTING_LIVES,
      tier: tierForCorrect(correct),
      score,
      combo,
    });

    if (lives <= 0) {
      return { level: preset.name, score, answered, correct, longestCombo, tierReached: maxTier };
    }
  }
}
