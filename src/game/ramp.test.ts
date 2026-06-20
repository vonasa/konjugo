import { describe, it, expect } from 'vitest';
import { planForTier, tierForCorrect } from './ramp';
import { presetById } from './presets';
import { CONFIG } from './config';

const beginner = presetById('beginner');
const intermediate = presetById('intermediate');

describe('tierForCorrect', () => {
  it('advances one tier every TIER_ADVANCE_EVERY correct', () => {
    expect(tierForCorrect(0)).toBe(1);
    expect(tierForCorrect(CONFIG.TIER_ADVANCE_EVERY - 1)).toBe(1);
    expect(tierForCorrect(CONFIG.TIER_ADVANCE_EVERY)).toBe(2);
    expect(tierForCorrect(CONFIG.TIER_ADVANCE_EVERY * 2)).toBe(3);
  });
});

describe('planForTier', () => {
  it('Beginner tier 1 is definite + nominative + singular, L1, full clock', () => {
    const p = planForTier(beginner, 1);
    expect(p.constraints.cueMode).toBe('L1');
    expect(p.constraints.cases).toEqual(['nom']);
    expect(p.constraints.articleTypes).toEqual(['definite']);
    expect(p.constraints.numbers).toEqual(['sg']);
    expect(p.clockMs).toBe(beginner.baseClockMs);
  });

  it('Intermediate never starts with nominative and uses L2', () => {
    const p = planForTier(intermediate, 1);
    expect(p.constraints.cueMode).toBe('L2');
    expect(p.constraints.cases).not.toContain('nom');
  });

  it('widens scope as tiers climb (genitive only at the top stage)', () => {
    expect(planForTier(beginner, 1).constraints.cases).not.toContain('gen');
    const top = planForTier(beginner, 99);
    expect(top.constraints.cases).toContain('gen');
    expect(top.constraints.articleTypes).toContain('none');
    expect(top.constraints.numbers).toContain('pl');
  });

  it('shrinks the clock each tier and floors it', () => {
    expect(planForTier(beginner, 2).clockMs).toBe(
      beginner.baseClockMs - CONFIG.CLOCK_STEP_MS,
    );
    expect(planForTier(beginner, 999).clockMs).toBe(CONFIG.CLOCK_FLOOR_MS);
  });
});
