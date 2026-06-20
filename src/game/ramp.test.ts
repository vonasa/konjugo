import { describe, it, expect } from 'vitest';
import { planForProgress, tierForCorrect } from './ramp';
import { presetById } from './presets';
import { CONFIG } from './config';

const beginner = presetById('beginner');
const intermediate = presetById('intermediate');
const N = CONFIG.TIER_ADVANCE_EVERY;

describe('tierForCorrect', () => {
  it('advances one tier every TIER_ADVANCE_EVERY correct', () => {
    expect(tierForCorrect(0)).toBe(1);
    expect(tierForCorrect(N - 1)).toBe(1);
    expect(tierForCorrect(N)).toBe(2);
    expect(tierForCorrect(N * 2)).toBe(3);
  });
});

describe('planForProgress — grammar scope', () => {
  it('Beginner starts at definite + nominative + singular, L1', () => {
    const p = planForProgress(beginner, 0);
    expect(p.constraints.cueMode).toBe('L1');
    expect(p.constraints.tier).toBe(1);
    expect(p.constraints.cases).toEqual(['nom']);
    expect(p.constraints.articleTypes).toEqual(['definite']);
  });

  it('Intermediate never starts with nominative and uses L2', () => {
    const p = planForProgress(intermediate, 0);
    expect(p.constraints.cueMode).toBe('L2');
    expect(p.constraints.cases).not.toContain('nom');
  });

  it('widens scope as tiers climb (genitive only at the top stage)', () => {
    expect(planForProgress(beginner, 0).constraints.cases).not.toContain('gen');
    const top = planForProgress(beginner, 999);
    expect(top.constraints.cases).toContain('gen');
    expect(top.constraints.articleTypes).toContain('none');
    expect(top.constraints.numbers).toContain('pl');
  });
});

describe('planForProgress — sawtooth clock', () => {
  it('tier 1 first round is the full base clock', () => {
    expect(planForProgress(beginner, 0).clockMs).toBe(beginner.baseClockMs);
  });

  it('shrinks within a tier', () => {
    const r0 = planForProgress(beginner, 0).clockMs;
    const r1 = planForProgress(beginner, 1).clockMs;
    const r2 = planForProgress(beginner, 2).clockMs;
    expect(r1).toBeLessThan(r0);
    expect(r2).toBeLessThan(r1);
  });

  it('resets UP on tier-up (relief), to 90% of the previous tier start', () => {
    const tier1End = planForProgress(beginner, N - 1).clockMs;
    const tier2Start = planForProgress(beginner, N).clockMs;
    expect(tier2Start).toBeGreaterThan(tier1End);
    expect(tier2Start).toBe(
      Math.round(beginner.baseClockMs * CONFIG.TIER_RESET_FACTOR),
    );
  });

  it('each tier start is ~10% below the previous tier start', () => {
    const s1 = planForProgress(beginner, 0).clockMs;
    const s2 = planForProgress(beginner, N).clockMs;
    const s3 = planForProgress(beginner, 2 * N).clockMs;
    expect(s2 / s1).toBeCloseTo(CONFIG.TIER_RESET_FACTOR, 2);
    expect(s3 / s2).toBeCloseTo(CONFIG.TIER_RESET_FACTOR, 2);
  });

  it('never drops below the floor', () => {
    expect(planForProgress(beginner, 9999).clockMs).toBe(CONFIG.CLOCK_FLOOR_MS);
  });
});
