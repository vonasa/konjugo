# Konjugo

A fast, mobile-friendly browser arcade for drilling German grammar.
**v1 module: adjective declension** — pick the correct adjective ending by
*case × gender/number × article type*, against the clock.

See **[DESIGN.md](DESIGN.md)** for the full spec and **[PLAN.md](PLAN.md)** for the phased build plan.

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # unit tests (grammar generator)
npm run typecheck  # strict TS check
npm run build      # static production bundle → dist/
```

## Deploy (GitHub Pages)

Pushing to `main` runs typecheck + tests + build and publishes `dist/` via GitHub Actions
(`.github/workflows/deploy.yml`). One-time setup on GitHub:

1. Create the repo and push (default branch `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**

> The production base path is `/konjugo/` (see `vite.config.ts`). If you name the repo
> something else, update `base` to match `/<repo-name>/`.

## Tech

Plain DOM + CSS, **Vite + TypeScript**, no framework. Zero image/audio assets
(CSS/SVG/emoji visuals, procedural Web Audio). Built on a module-agnostic
challenge schema so other grammar modules can be added without touching the game shell.
