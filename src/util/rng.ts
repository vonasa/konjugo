// Small, fast, *seedable* PRNG (mulberry32) so gameplay variety is deterministic
// in tests and reproducible from a seed.

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pick() from empty array');
  const item = arr[Math.floor(rng() * arr.length)];
  if (item === undefined) throw new Error('pick() out of range');
  return item;
}
