# Current Feature

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

Not Started

<!-- Spec: `context/features/NN-feature-name.md` -->

## Goals

<!-- Bullet points of what success looks like -->

## Notes

<!-- Additional context, constraints, or details from spec -->

---

## Up next

- 06 — Card primitive

---

## Recently landed

- Project kickoff documentation pack generated on 2026-07-07.
- Feature 01 — Project Foundation (2026-07-08): scaffolded Vite + React + TypeScript (strict) app, Storybook (react-vite + a11y addon, default example stories), Vitest + React Testing Library + jest-dom + user-event with a real `App` test, ESLint (flat config) + Prettier, the base `src/` folder structure, placeholder `src/styles/tokens.css`, npm scripts, GitHub Actions CI (typecheck/lint/test/build/build-storybook), and the `CHANGELOG.md` entry. Trimmed the default `storybook init` output down to just `@storybook/addon-a11y` (dropped addon-vitest/Playwright, Chromatic, docs, and mcp addons, plus the default `Configure.mdx` welcome page which failed to build under Vite 8's rolldown bundler) to stay in scope for a lean foundation.
- Feature 02 — Design Token Foundation (2026-07-08): built out the full `--sr-` prefixed token set in `src/styles/tokens.css` (color, typography, spacing, radius, border, shadow, motion, z-index, layout widths) with a `prefers-reduced-motion` fallback; added `src/styles/reset.css`; consolidated `src/styles/global.css` to import tokens + reset and set base `html`/`body` styles (plus a token-based `:focus-visible` ring) from tokens only; wired the single global stylesheet into both `src/main.tsx` and `.storybook/preview.tsx` so app and Storybook render identically (verified via matching compiled CSS and live screenshots).
- Feature 03 — Storybook Foundations Catalog (2026-07-09): added `src/styles/foundations/` with an Introduction page describing SubRooms' design system and atomic-design organization, plus `Foundations/Color`, `Foundations/Typography`, and `Foundations/Spacing` stories rendering live `tokens.css` values (read via `getComputedStyle`, no restated literals) in a mobile-first grid/list layout; removed the default Storybook CLI boilerplate (`src/stories/` — Button, Header, Page). Verified `typecheck`, `lint`, `test`, and `build-storybook` all pass.
- Feature 04 — Button Primitive (2026-07-09): built a token-driven `Button` atom (`src/components/atoms/Button/`) rendering a real `<button>` or, via `as="a"`/`href`, an anchor — using a TypeScript discriminated union so invalid prop shapes fail at compile time. Supports `primary`/`secondary`/`ghost` variants, `sm`/`md` sizes, `disabled`, an accessible `loading` state (`aria-busy`, spinner, preserved accessible name), and optional leading/trailing icons including icon-only usage via `aria-label`. Styled entirely from `--sr-*` tokens, with hover/active shades derived via `color-mix()` and `prefers-reduced-motion` handling for the spinner. Added Storybook stories for every state and RTL tests for role/name, mouse and keyboard activation, disabled, loading, anchor mode, and icon-only naming. Fixed a test-isolation bug by adding `afterEach(cleanup)` to `src/test/setup.ts`. Also added Vitest v8 coverage tooling (`@vitest/coverage-v8`, `npm run test:coverage`, HTML report under `coverage/`, ESLint ignore for the generated output). Verified `typecheck`, `lint`, `test`, `build`, and `build-storybook` all pass.
- Feature 05 — Badge Primitive (2026-07-09): built a token-driven `Badge` atom (`src/components/atoms/Badge/`) — a non-interactive `<span>` for short status/metadata labels with `neutral`/`accent`/`success`/`warning` tones, an optional leading icon hidden from assistive tech (`aria-hidden`) so the label text stays the accessible name, and single-line text truncation (`text-overflow: ellipsis`) so long labels don't break layouts. Tone backgrounds/borders are derived from `--sr-*` tokens via `color-mix()` rather than new literal colors; added `--sr-color-success`, `--sr-color-success-strong`, `--sr-color-warning`, and `--sr-color-warning-strong` tokens to `tokens.css` (and to the `Foundations/Color` story). Added Storybook stories for every tone, with/without icon, and a long-text truncation example, plus RTL tests covering rendered text, default/explicit tone class application, and icon accessibility. Verified `typecheck`, `lint`, `test`, and `build` all pass.
