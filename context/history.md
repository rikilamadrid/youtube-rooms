# Project History

Append-only log of completed work. Keep `context/current-feature.md` focused on what is active now, and summarize shipped work here after it lands.

## Completed work

### 2026-07-09 — Feature 05: Badge Primitive

- Added a token-driven `Badge` atom (`src/components/atoms/Badge/`): a non-interactive `<span>` for short status/metadata labels, defaulting to a `neutral` tone with `accent`/`success`/`warning` alternatives.
- Tone backgrounds and borders are derived from `--sr-*` tokens via `color-mix()`, not new literal colors; added `--sr-color-success`, `--sr-color-success-strong`, `--sr-color-warning`, and `--sr-color-warning-strong` to `tokens.css` and the `Foundations/Color` story.
- Supports an optional leading icon, hidden from assistive tech via `aria-hidden`, so the badge's accessible name always comes from its text label rather than color or icon alone.
- Long labels truncate to a single line (`text-overflow: ellipsis`) instead of wrapping or overflowing the layout.
- Added Storybook stories for every tone, with/without icon, and a long-text truncation example.
- Added RTL tests covering rendered text, default and explicit tone class application, and icon accessibility.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.

### 2026-07-09 — Feature 04: Button Primitive

- Added a token-driven `Button` atom (`src/components/atoms/Button/`) rendering a real `<button>` or, via `as="a"`/`href`, an anchor, using a TypeScript discriminated union so invalid prop shapes (e.g. `as="a"` without `href`) fail at compile time.
- Supports `primary`/`secondary`/`ghost` variants, `sm`/`md` sizes, `disabled`, an accessible `loading` state (`aria-busy`, spinner, preserved accessible name), and optional leading/trailing icons including icon-only usage via `aria-label`.
- Styled entirely from `--sr-*` tokens, with hover/active shades derived via `color-mix()` and `prefers-reduced-motion` handling for the spinner animation.
- Added Storybook stories for every state and RTL tests covering role/name, mouse and keyboard activation, disabled, loading, anchor mode, and icon-only naming.
- Fixed a test-isolation bug by adding `afterEach(cleanup)` to `src/test/setup.ts` (a render from one test was leaking into the next).
- Added Vitest v8 coverage tooling (`@vitest/coverage-v8`, `npm run test:coverage`, HTML report under `coverage/`, ESLint ignore for the generated output).
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and `npm run build-storybook`.

### 2026-07-09 — Feature 03: Storybook Foundations Catalog

- Added `src/styles/foundations/` with an Introduction page describing SubRooms' design system and atomic-design organization, plus `Foundations/Color`, `Foundations/Typography`, and `Foundations/Spacing` stories.
- All token demo stories read live values from `tokens.css` at render time (via `getComputedStyle`, no restated literals) in a mobile-first, low-visual-noise grid/list layout.
- Removed the default Storybook CLI boilerplate (`src/stories/` — `Button`, `Header`, `Page` components and stories).
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build-storybook`.

### 2026-07-08 — Feature 02: Design Token Foundation

- Built out the full token set in `src/styles/tokens.css`: color, typography, spacing, radius, border, shadow, motion, z-index, and layout-width groups, all `--sr-` prefixed and semantically named, each with a short comment block.
- Added a `prefers-reduced-motion` media query in `tokens.css` that zeroes out the motion tokens.
- Added `src/styles/reset.css`, a minimal CSS reset.
- Consolidated `src/styles/global.css` to `@import` tokens + reset and set base `html`/`body` styles (background, text, font) from tokens only, plus a token-based `:focus-visible` outline.
- Wired the single global stylesheet into both `src/main.tsx` and `.storybook/preview.tsx` so the app and Storybook render identically.
- Verified with `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`; confirmed the compiled CSS output is byte-identical between the app and Storybook builds, and cross-checked live via Playwright screenshots of the running dev server and a Storybook story (matching background/text colors, no console errors).

### 2026-07-08 — Feature 01: Project Foundation

- Scaffolded a Vite + React + TypeScript (strict mode) app with the base `src/` folder structure (`app`, `components/{atoms,molecules,organisms,templates}`, `data`, `hooks`, `services`, `styles`, `test`, `types`, `utils`) and a placeholder `src/styles/tokens.css`.
- Added Storybook (`@storybook/react-vite`) with the default example stories and the accessibility addon; deliberately trimmed the default `storybook init` output (dropped addon-vitest/Playwright, Chromatic, docs, and mcp addons, and the default `Configure.mdx` page, which failed to build under Vite 8's rolldown bundler) to keep the foundation lean.
- Added Vitest + React Testing Library + user-event + jest-dom with a real test for `App`.
- Added ESLint (flat config) + Prettier for TypeScript and React.
- Added npm scripts (`dev`, `storybook`, `test`, `test:watch`, `lint`, `typecheck`, `build`, `build-storybook`) and a GitHub Actions CI workflow running all of them on push/PR.
- Verified `dev` and `storybook` dev servers boot, and `test`, `lint`, `typecheck`, `build`, and `build-storybook` all pass.

### 2026-07-07 — Project kickoff documentation

- Defined the product as YouTube Subscription Rooms, a focused subscription grouping and watch-queue experience.
- Selected React, TypeScript, Vite, Storybook, CSS variables, Vitest, React Testing Library, GitHub Actions, Vercel, Semantic Versioning, and Keep a Changelog as the project foundation.
- Established the build style as Component Driven Development plus Test Driven Development.
- Added AI workflow guidance for Claude Code, Codex, and similar coding agents.
- Planned YouTube API integration as a later phase after the design system and mock-data product shell are stable.

## Notes

- Keep entries concise but useful.
- Prefer user-visible outcomes over raw implementation inventory.
- If deployment details matter, record only durable facts here.
