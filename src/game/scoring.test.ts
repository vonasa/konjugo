import { describe, it, expect } from 'vitest';
import {
  speedFactor,
  comboMultiplier,
  tierMultiplier,
  roundPoints,
} from './scoring';
import { CONFIG } from './config';

describe('speedFactor', () => {
  it('is 1 for an instant answer and floored for a slow one', () => {
    expect(speedFactor(0, 4000)).toBe(1);
    expect(speedFactor(2000, 4000)).toBeCloseTo(0.5);
    expect(speedFactor(4000, 4000)).toBe(CONFIG.SPEED_FLOOR); // used all the time
    expect(speedFactor(99999, 4000)).toBe(CONFIG.SPEED_FLOOR);
  });
});

describe('multipliers', () => {
  it('combo grows then caps at ×3', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(4)).toBeCloseTo(1.4);
    expect(comboMultiplier(1000)).toBeCloseTo(3); // capped
  });
  it('tier multiplier grows with tier', () => {
    expect(tierMultiplier(1)).toBe(1);
    expect(tierMultiplier(5)).toBeCloseTo(2);
  });
});

describe('roundPoints', () => {
  it('matches the worked example shapes', () => {
    expect(roundPoints(0, 4000, 1, 1)).toBe(110); // instant, 1-combo, tier1
    expect(roundPoints(2000, 4000, 1, 1)).toBe(55); // half-time
  });
  it('rewards speed, combo and tier monotonically', () => {
    const slow = roundPoints(3000, 4000, 1, 1);
    const fast = roundPoints(500, 4000, 1, 1);
    expect(fast).toBeGreaterThan(slow);
    expect(roundPoints(500, 4000, 8, 1)).toBeGreaterThan(fast);
    expect(roundPoints(500, 4000, 8, 4)).toBeGreaterThan(
      roundPoints(500, 4000, 8, 1),
    );
  });
});
