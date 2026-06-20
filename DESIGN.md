# Konjugo — Design Specification (v1)

> A fast, mobile-friendly browser arcade for drilling German grammar.
> **v1 module: adjective declension** — choosing the correct adjective ending by
> *case × gender/number × article type*. Built on a generic engine so other
> grammar modules (verb conjugation, plurals, …) can be added later without a rewrite.

---

## 1. Vision & Principles

- **Static site.** No backend, no login, no accounts. Publishable to GitHub Pages as plain files.
- **One codebase, phone + laptop.** Responsive, portrait-first, thumb-reachable; keyboard accelerators on desktop.
- **The difficulty is the grammar and the clock — never the dexterity.** Answer targets hold still and are easy to read/tap; tension comes from the timer, not from chasing moving objects.
- **Endless arcade.** Increasing difficulty, discrete lives, a speed-based high-score chase.
- **Teach in the moment.** Every mistake immediately reveals the rule that governed it.
- **Extensible by architecture, not by engine.** Adjective declension is the first content module on a module-agnostic game shell.

---

## 2. Scope

**In v1**
- Adjective-declension content module (the full endings table).
- Two cue modes: **L1** (case labeled) and **L2** (fixed-case preposition trigger).
- Endless arcade loop with tiered difficulty ramp.
- Three bundled difficulty presets on the start screen.
- Speed × combo × tier scoring; personal best in `localStorage`.
- In-round rule reveal on mistakes.
- Procedural sound effects; CSS/SVG/emoji visuals (no commissioned art).

**Out of v1 (future, see §9)**
- L3 full-sentence inference; verb conjugation & other modules; weak-spot analytics;
  post-game mistakes review; leaderboards/accounts; background music; spelling-irregular adjectives.

---

## 3. Core Gameplay Loop

```
read the prompt  →  pick the correctly-declined word from 5 options
      →  before the round timer (the advancing threat) reaches its base
      →  correct & fast = more points (combo builds); wrong or too slow = lose a heart + see the rule
      →  repeat, difficulty rising tier by tier, until all hearts are gone
      →  final score + personal best
```

The **core interaction is invariant**; the on-screen *theme* is a swappable skin over it.

---

## 4. Learning Content

### 4.1 The task in one round

The player sees a short phrase with the **adjective ending blanked** — case cue (L1) or
preposition trigger (L2), the **article**, the blanked adjective, and the **noun**:

```
‹ DATIV ›   mit dem  gut___  Mann
```

They pick the correctly-declined **whole word** (not a bare suffix) from five options.
The **ending is visually highlighted** on every option: `gut`**`en`**.
Only the adjective is blanked; the article and noun are always shown (they are themselves cues).

### 4.2 The endings tables — source of truth

German attributive adjective endings follow three patterns depending on the preceding article.
These three tables are the master data the whole game is generated from.

**Weak** — after a definite article (*der, die, das*; *dieser, jeder, welcher, …*):

| Case | Masc | Fem | Neut | Plural |
|------|:----:|:---:|:----:|:------:|
| Nom  | -e   | -e  | -e   | -en    |
| Acc  | -en  | -e  | -e   | -en    |
| Dat  | -en  | -en | -en  | -en    |
| Gen  | -en  | -en | -en  | -en    |

**Mixed** — after an indefinite article / *kein* / a possessive (*ein, eine, mein, kein, …*):

| Case | Masc | Fem | Neut | Plural |
|------|:----:|:---:|:----:|:------:|
| Nom  | -er  | -e  | -es  | -en    |
| Acc  | -en  | -e  | -es  | -en    |
| Dat  | -en  | -en | -en  | -en    |
| Gen  | -en  | -en | -en  | -en    |

**Strong** — no article (*guter Wein*; after *etwas, viel, numbers, …*):

| Case | Masc | Fem | Neut | Plural |
|------|:----:|:---:|:----:|:------:|
| Nom  | -er  | -e  | -es  | -e     |
| Acc  | -en  | -e  | -es  | -e     |
| Dat  | -em  | -er | -em  | -en    |
| Gen  | -en  | -er | -en  | -er    |

> Notes baked into the data: strong masc/neut **genitive** is **-en** (the noun carries the -s);
> the *mixed* pattern differs from *weak* in exactly three cells (Nom-masc, Nom-neut, Acc-neut).

### 4.3 The five options

Across all three tables the distinct endings are exactly five: **`-e · -en · -er · -es · -em`**.
Every round therefore presents the **same five buckets**, realized as the five inflected forms of
one stem — e.g. for *gut*: `gute · guten · guter · gutes · gutem`. Exactly one is correct for the slot.

### 4.4 Cue modes (how the player knows the case)

A bare article + noun does **not** determine the case (e.g. *der* is also dative/genitive feminine),
so the case is always either **stated** or **cued** — never blindly guessed.

- **L1 — case labeled (pure table drill).** A case chip is shown: `‹ DATIV ›  dem gut___ Mann`.
- **L2 — preposition trigger.** A fixed-case preposition supplies the case: `für einen gut___ Tag` (für → Akkusativ).
- **L3 — full-sentence inference.** *Future.* Out of v1.

### 4.5 Gender cueing (fairness)

The correct ending depends on the noun's gender. To isolate *the ending rule* from *vocabulary
gender recall*, the noun's gender is **cued** — color-coded and/or tagged:

| Gender | Color | Tag |
|--------|-------|-----|
| Masculine | blue | `m` |
| Feminine | red | `f` |
| Neuter | green | `n` |
| Plural | purple | `pl` |

The **strength of the cue is set by the chosen difficulty preset** (full → color-only → off), so at the
hardest preset the player must also recall genders. (Palette is tunable; pair colors with tags for
color-blind safety.)

### 4.6 L2 trigger inventory

L2 uses **only prepositions that govern a fixed case** (two-way prepositions are excluded because
they don't determine the case without motion context). Verb-based triggers are deferred to L3.

- **→ Dative:** *mit, aus, bei, von, zu, nach, seit, gegenüber*
- **→ Accusative:** *für, ohne, gegen, um, durch, bis*
- **→ Genitive** (high tiers only): *wegen, trotz, während, (an)statt*
- **Excluded (two-way):** *in, an, auf, über, unter, vor, hinter, neben, zwischen*

---

## 5. Game Systems

### 5.1 Timing & the threat (Model 1)

- Each round runs a **per-round countdown** visualized as the **advance-track threat**: a threat icon
  marches toward a base/flag (`👹 →→→→•••• 🏰`). Reaching the base = timeout.
- The threat is the **round timer made thematic** — it **resets every round**. It is *not* a slow
  full-screen creep (rejected for eating phone screen space and hurting readability).
- On a **miss**, the countdown **pauses** during the rule reveal (so a mistake doesn't also bleed time).

### 5.2 Lives

- **4 hearts** to start (within the 3–5 range; tunable).
- A heart is lost on **a wrong tap OR a timeout** (strict). A wrong tap flashes the correct answer.
- Hearts reach zero → game over.

### 5.3 Difficulty ramp (within a session)

- Difficulty climbs in **discrete tiers** (clean to tune; lets us flash "Tier 2!"). Advance a tier every
  **~5 correct answers** (tunable).
- **Case-major progression** (standard teaching order):
  1. Start at **definite article + Nominative**.
  2. Add cases in order **Nom → Acc → Dat → Gen** (genitive last, rarest).
  3. Then re-climb with **indefinite/possessive** (mixed), then **no article** (strong).
  4. **Plural** and **Genitive** are gated to higher tiers so beginners never meet them early.
- Each tier also **shrinks the clock** and speeds the threat.

### 5.4 Difficulty presets (start screen)

Each preset bundles cue mode + gender cue + clock + starting grammar scope, and **still ramps in tiers** from there.

| Preset | Cue mode | Gender cue | Clock | Starting scope |
|--------|----------|------------|-------|----------------|
| **Beginner** | L1 (case labeled) | full (color + tag) | generous (~6 s) | definite article, Nominative |
| **Intermediate** | L2 (prepositions) | color only | standard (~4.5 s) | + indefinite, + Accusative |
| **Advanced** | L2 (prepositions) | off | fast (~3 s) | all articles/cases sooner |

A "Custom" screen with independent toggles is a possible later addition.

### 5.5 Scoring

```
points = round( BASE × speedFactor × comboMult × tierMult )
```

- `BASE` = 100 (tunable).
- `speedFactor = timeLeft / clockLength` (instant ≈ 1.0; just-in-time ≈ small; floor ~0.1).
- `comboMult = 1 + min(streak, cap) / 10` (e.g. cap 20 → up to ×3); resets to 1 on any miss.
- `tierMult` = grows with tier (e.g. `1 + 0.25 × (tier − 1)`), rewarding deeper survival.
- Wrong / timeout = **0 points + lose a heart + combo reset**.
- **Personal best** stored in `localStorage` (the one persistence exception).

### 5.6 Feedback loop — teach in the moment

- **Correct:** brief green confirm + juice; combo ticks up; next round immediately.
- **Wrong:** tapped option flashes red, correct option flashes green, the correct form drops into the
  blank, and a compact **rule tag** appears — e.g. `DATIV · der-word · masc → -en` — for ~1 s with the
  **clock paused**. Then the next round.
- **No post-game review in v1** (teaching already happened in-round).

### 5.7 Game-over screen

Shows: **final score · personal best · accuracy % · longest combo · highest tier reached**, and a
one-tap **Restart**. Lean by design.

---

## 6. Content Data Model

### 6.1 Generic challenge schema (extensibility keystone)

The game shell consumes a **module-agnostic** challenge object. A future verb module emits the same
shape, so nothing in the renderer/loop is adjective-specific.

```ts
type Gender = 'm' | 'f' | 'n' | 'pl';
type Case = 'nom' | 'acc' | 'dat' | 'gen';
type ArticleType = 'definite' | 'indefinite' | 'none';

type PromptToken =
  | { kind: 'cue';     text: string }                 // L1 case label
  | { kind: 'trigger'; text: string }                 // L2 preposition (highlighted)
  | { kind: 'article'; text: string }
  | { kind: 'blank' }                                 // the adjective slot
  | { kind: 'noun';    text: string; gender: Gender };// gender drives the cue color/tag

type Option = { id: string; word: string; stem: string; ending: string };

type RuleExplanation = { case: Case; articleType: ArticleType; gender: Gender; ending: string };

type GrammarChallenge = {
  id: string;
  moduleId: 'adj-declension';            // future: 'verb-conjugation', …
  prompt: PromptToken[];
  options: Option[];                     // always 5
  correctOptionId: string;
  rule: RuleExplanation;                 // for the in-round reveal
  meta: { case: Case; articleType: ArticleType; gender: Gender; cueMode: 'L1' | 'L2'; tier: number };
};
```

### 6.2 Hybrid generation strategy

- Curate an **attested pool of adjective+noun pairings** (e.g. *alt + Haus*, *klein + Hund*) and a pool
  of triggers, then **systematically vary case and article type** over those real pairings.
- The **pairing is real** (naturalness + verifiability); the **inflection is by rule** (combinatorial variety).
- The five option words are **rule-generated** from the stem (`stem + {e,en,er,es,em}`), which is why
  spelling-irregular stems are excluded from v1.

### 6.3 Data files

- `endings.ts` — the three 4×4 tables from §4.2 (the source of truth).
- `adjectives.ts` — regular stems only (e.g. *gut, klein, alt, neu, schön, …*).
- `nouns.ts` — each noun with its **gender** (and the article forms needed).
- `triggers.ts` — prepositions tagged with the case they govern (§4.6).
- `pairings.ts` — curated, **attested** adjective+noun pairs (the spine of generation).

### 6.4 Verification (build-time, not runtime)

- The tractable unit is the **seed pairing**, not every inflected phrase. We confirm each pairing is a
  real collocation (dictionary example / quoted web hits / corpus), then trust the grammar for its
  inflections. Unattested pairings are pruned **while authoring**; the shipped site stays static with a
  pre-verified data file.

### 6.5 Scale targets (v1)

~**25–35 adjectives**, ~**40–60 nouns**, a curated **~150–250 attested pairings**, ~**10–15 triggers**.
Yields thousands of valid challenges while keeping every base pairing real.

---

## 7. UX, Layout & Presentation

### 7.1 Portrait layout (the binding constraint is a ~360 px phone, no scroll)

```
┌─────────────────────────────────────┐
│ ♥♥♥♥        Tier 2      1240  ×3     │  ← HUD: lives · tier · score · combo
├─────────────────────────────────────┤
│            ‹ DATIV ›                 │  ← case chip (L1) / trigger highlighted (L2)
│        mit dem  gut___  Mann         │  ← prompt card (big, crisp; noun gender-colored)
│   👹 →→→→→→→→→•••••••••  🏰           │  ← advance-track = round timer (the threat)
├─────────────────────────────────────┤
│      [  gute  ]    [  guter  ]       │
│      [  gutes ]    [  gutem  ]       │  ← five options, 2-2-1 grid, ending highlighted,
│           [   guten   ]              │     in the thumb zone
└─────────────────────────────────────┘
```

On wide screens: identical, centered, with **1–5 key hints** on the buttons.

### 7.2 HUD

Lives (hearts) · current tier · running score · current combo multiplier · mute toggle.

### 7.3 Input

- **Tap / click** the option — works everywhere, identical on phone and laptop.
- **Keys 1–5** select options; **Enter** starts/restarts (desktop accelerators only).

### 7.4 Theme & assets

- Clean, friendly default aesthetic: card UI, one emoji-ish threat marching at a base.
- **Zero image assets** — everything is CSS/SVG/emoji. Tiny payload, instant deploy.
- Effects live in a **swappable layer** so the whole thing can be reskinned (or given a canvas
  effects layer) later without touching content or logic.

### 7.5 Audio

- **Procedural Web Audio SFX** (no files): correct chime, wrong buzz, rising combo blips,
  threat-advance tick, game-over. **Mute toggle**, default on, unlocked on first tap (mobile requirement).
- No background music in v1.

### 7.6 Accessibility

- Real focusable buttons + ARIA; full keyboard play; gender cue uses **color *and* tag** (color-blind safe);
  honor `prefers-reduced-motion` (swap threat animation for a plain bar).

---

## 8. Technical Architecture

- **Stack:** DOM-first, **Vite + TypeScript**. Outputs a plain static bundle for GitHub Pages.
- **No framework required**; a small hand-rolled game loop + state machine
  (`menu → playing → roundResult → gameOver`). A tiny tween/animation helper (Web Animations API or
  anime.js) drives the threat and juice.
- **Module boundaries**
  - `content/` — data files + `buildChallenge()` generator + form generator (pure, unit-tested).
  - `game/` — loop, timer, lives, scoring, combo, tier-ramp (pure logic, testable).
  - `ui/` — prompt card, option buttons, HUD, threat, screens (render layer).
  - `fx/` — sound + particles + animation (the swappable juice layer).
  - `state/` — session state + `localStorage` personal best.
- **Persistence:** only the personal best (`localStorage`).
- **Deploy:** `vite build` → static `dist/` → GitHub Pages (Actions or `docs/` branch).

---

## 9. Non-goals / Future

- **L3 full-sentence inference** (verb-of-motion / object-case parsing).
- **Additional modules** on the same engine: verb conjugation, noun plurals, comparative/superlative.
- **Weak-spot analytics** ("you keep missing dative feminine") + targeted drilling.
- **Post-game mistakes review**, **leaderboards/accounts**, **background music**.
- **Spelling-irregular adjectives** (*hoch, teuer, dunkel, edel, nobel, sauer*) via explicit forms.
- **Custom difficulty** screen (independent toggles).

---

## 10. Tunable constants (single source for balancing)

| Constant | Default | Notes |
|----------|---------|-------|
| `STARTING_LIVES` | 4 | 3–5 |
| `TIER_ADVANCE_EVERY` | 5 correct | per tier |
| `CLOCK_BEGINNER / INTER / ADVANCED` | 6.5 / 5.2 / 3.64 s | starting round time (Phase 6 balance, +30% start) |
| `CLOCK_FLOOR` | 1.6 s | minimum as tiers climb |
| `CLOCK_STEP` | 0.4 s | clock shrink per tier |
| `BASE_POINTS` | 100 | |
| `COMBO_CAP` | 20 (→ ×3) | combo multiplier ceiling |
| `TIER_MULT_STEP` | 0.25 | `1 + step × (tier−1)` |
| `REVEAL_PAUSE` | ~1 s | clock-paused rule reveal on miss |

All values are placeholders to be tuned in the balancing pass (Phase 6).
