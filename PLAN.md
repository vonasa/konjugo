# Konjugo — Phased Build Plan

Companion to [`DESIGN.md`](DESIGN.md). Eight phases (0–7). **Guiding rule: every phase ends with a
deployable static site** — `main` is always shippable to GitHub Pages, so progress is visible at each step.

Each phase lists its **goal**, **work**, and a **"done when"** acceptance check.

---

## Phase 0 — Scaffold & deploy pipeline
**Goal:** an empty but *deployed* static site, so deployment is never the thing that's broken later.

- Init Vite + TypeScript project; strict `tsconfig`.
- Set up GitHub Pages deploy (GitHub Action on `main` → `dist/`).
- Mobile viewport meta, base CSS reset, a portrait app shell that renders "Konjugo".
- Lint/format (eslint + prettier); minimal CI (typecheck + build).

**Done when:** pushing to `main` publishes a blank shell to the Pages URL on phone and laptop.

---

## Phase 1 — Content foundation (data + generator, no game yet)
**Goal:** correct challenges can be produced and are *proven* correct. This is the riskiest correctness work, so it comes first and is unit-tested.

- Encode the three endings tables (`endings.ts`) from DESIGN §4.2.
- Form generator: `stem → {e,en,er,es,em}` (regular stems only).
- Define the generic `GrammarChallenge` schema (DESIGN §6.1).
- Author a **small** seed set (≈8 adjectives, ≈12 nouns w/ gender, the trigger list, ≈30 pairings) — enough to build on; full scale comes in Phase 6.
- `buildChallenge({ articleType, case, tier, cueMode, genderCuePolicy })` → a complete challenge.
- **Unit tests**: assert known phrases (*der gute Mann → -e*, *mit einem alten Auto → -en*, *guter Wein → -er*, plural/genitive cases, all three patterns).

**Done when:** the generator passes a table of hand-checked German phrases across weak/mixed/strong, all cases, all genders + plural.

---

## Phase 2 — One playable round (static, no pressure)
**Goal:** you can answer rounds endlessly with no timer/score — the interaction feels right.

- Prompt card: cue chip (L1) / highlighted trigger (L2) + article + blank + gender-colored noun.
- Five option buttons, 2-2-1 grid, **ending highlighted**.
- Selection by **tap/click** and **keys 1–5**.
- Correct/wrong detection; green/red flash; **in-round rule reveal** (the correct form drops in + rule tag).

**Done when:** on phone and laptop you can play unlimited untimed rounds, and a wrong answer shows the rule.

---

## Phase 3 — The arcade systems
**Goal:** the full endless loop, start → game-over, with all the systems wired.

- **Advance-track threat** as the per-round countdown; **clock-pause** during the miss reveal.
- **Lives** (4 hearts); lose on wrong/timeout; zero → game over.
- **Scoring**: speed × combo × tier; combo tracking; HUD (hearts · tier · score · combo).
- **Tier ramp engine**: case-major progression, plural/genitive gating, clock shrink, advance every N.
- **Game-over screen** (score · best · accuracy · longest combo · tier · Restart) + `localStorage` best.

**Done when:** a full run plays start to game-over with rising difficulty, correct scoring, and a saved personal best.

---

## Phase 4 — Start screen & difficulty presets
**Goal:** the front-to-back flow a player actually sees.

- Start screen with the **three bundled presets** (Beginner / Intermediate / Advanced), each wiring
  cue mode + gender-cue policy + clock + starting scope (DESIGN §5.4).
- Mute toggle surfaced; navigation menu ↔ game ↔ game-over ↔ restart.

**Done when:** choosing any preset starts a correctly-configured session, and Restart returns cleanly.

---

## Phase 5 — Juice & polish
**Goal:** it *feels* like an arcade game, not a timed quiz.

- **Procedural Web Audio SFX** (correct / wrong / combo blips / threat tick / game-over).
- Particles & animation: correct-hit pop, combo escalation, threat motion, screen feedback.
- Visual theme pass: clean cards, gender colors, the threat-vs-base skin.
- Responsive tuning phone ↔ laptop; **accessibility pass** (focus order, ARIA, `prefers-reduced-motion`, color-blind-safe cues).

**Done when:** it reads well and feels good on a real phone and a laptop, with sound and reduced-motion both correct.

---

## Phase 6 — Content expansion, verification & balancing
**Goal:** v1 content-complete, every pairing real, the curve tuned.

- Expand seed pools to target scale: ~25–35 adjectives, ~40–60 nouns, ~150–250 **attested** pairings, ~10–15 triggers.
- **Build-time verification** of each seed pairing (dictionary example / quoted web hits / corpus); prune unattested ones.
- **Balancing**: tune clock lengths, tier thresholds, scoring constants, heart count via playtesting (DESIGN §10).

**Done when:** every shipped pairing is attested, and a playtest session has a satisfying, fair difficulty curve.

---

## Phase 7 — Ship v1
**Goal:** a public, polished release.

- Cross-device QA (iOS/Android/desktop browsers); Lighthouse pass (perf/a11y).
- `README` (what it is, how to run/build, how to add content), license.
- Tag v1; confirm the live GitHub Pages build.

**Done when:** the live URL is the tuned, content-complete game, and a new contributor can add a grammar
pairing by following the README.

---

## Dependency overview

```
P0 scaffold ─▶ P1 content/generator ─▶ P2 one round ─▶ P3 arcade systems ─▶ P4 start/presets
                                                                                   │
                                                              P5 juice & polish ◀──┘
                                                                     │
                                              P6 content + verify + balance ─▶ P7 ship
```

P1 (correctness of the grammar engine) and P6 (verified content + balancing) are the two phases worth
the most care; the rest is conventional UI/game wiring on top of a proven generator.

## Extensibility checkpoint (post-v1)

Because the game shell consumes the generic `GrammarChallenge` schema, adding a **verb-conjugation**
module later means: author a new `content/` module that emits the same shape — **no changes to the
game loop, scoring, UI, or fx layers.** That is the entire payoff of the Path-1 architecture decision.
