# Current Feature

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

Branch: `main` until a new feature branch is created.

## Status

Not Started

<!-- Spec: `context/features/NN-feature-slug.md` -->

## Goals

<!-- - Bullet points of what success looks like -->

## Notes

<!-- Additional context, constraints, or details from spec -->

---

## Up next

- `context/features/03-storybook-foundations.md`

---

## Recently landed

- Project kickoff documentation pack generated on 2026-07-07.
- Feature 01 — Project Foundation (2026-07-08): scaffolded Vite + React + TypeScript (strict) app, Storybook (react-vite + a11y addon, default example stories), Vitest + React Testing Library + jest-dom + user-event with a real `App` test, ESLint (flat config) + Prettier, the base `src/` folder structure, placeholder `src/styles/tokens.css`, npm scripts, GitHub Actions CI (typecheck/lint/test/build/build-storybook), and the `CHANGELOG.md` entry. Trimmed the default `storybook init` output down to just `@storybook/addon-a11y` (dropped addon-vitest/Playwright, Chromatic, docs, and mcp addons, plus the default `Configure.mdx` welcome page which failed to build under Vite 8's rolldown bundler) to stay in scope for a lean foundation.
- Feature 02 — Design Token Foundation (2026-07-08): built out the full `--sr-` prefixed token set in `src/styles/tokens.css` (color, typography, spacing, radius, border, shadow, motion, z-index, layout widths) with a `prefers-reduced-motion` fallback; added `src/styles/reset.css`; consolidated `src/styles/global.css` to import tokens + reset and set base `html`/`body` styles (plus a token-based `:focus-visible` ring) from tokens only; wired the single global stylesheet into both `src/main.tsx` and `.storybook/preview.tsx` so app and Storybook render identically (verified via matching compiled CSS and live screenshots).
