# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [Unreleased]

### Added

- Initial project documentation for YouTube Subscription Rooms.
- AI-assisted development workflow for Component Driven Development and Test Driven Development.
- Planned React, TypeScript, Vite, Storybook, CSS variables, Vitest, React Testing Library, GitHub Actions, and Vercel stack.
- Initial feature roadmap under `context/features/`.
- Project foundation: Vite + React + TypeScript (strict mode) app scaffold.
- Storybook, configured with the same React/TypeScript setup and an accessibility addon.
- Vitest + React Testing Library + user-event + jest-dom test setup, with a real example test for `App`.
- ESLint (flat config) + Prettier for TypeScript and React.
- Base `src/` folder structure (`app`, `components/{atoms,molecules,organisms,templates}`, `data`, `hooks`, `services`, `styles`, `test`, `types`, `utils`) and a placeholder `src/styles/tokens.css`.
- npm scripts: `dev`, `storybook`, `test`, `test:watch`, `lint`, `typecheck`, `build`, `build-storybook`.
- GitHub Actions CI workflow running typecheck, lint, test, build, and Storybook build on push/PR.
- Full design token set in `src/styles/tokens.css` (color, typography, spacing, radius, border, shadow, motion, z-index, layout widths) using `--sr-` prefixed semantic names, plus a `prefers-reduced-motion` fallback that neutralizes motion tokens.
- `src/styles/reset.css`, a minimal CSS reset.
- `src/styles/global.css` now imports tokens + reset and sets base `html`/`body` styles (including a token-based `:focus-visible` outline) from tokens only; imported by both the app entry (`src/main.tsx`) and Storybook's `.storybook/preview.tsx` so both surfaces render identically.
- Storybook foundations catalog under `src/styles/foundations/`: an "Introduction" page describing SubRooms' design system and atomic-design organization, plus `Foundations/Color`, `Foundations/Typography`, and `Foundations/Spacing` stories that render live `tokens.css` values (read via `getComputedStyle`) in a mobile-first grid/list layout.
- `Button` atom (`src/components/atoms/Button/`): a token-driven, real `<button>` (or `<a>` via `as="a"`/`href`) with `primary`/`secondary`/`ghost` variants, `sm`/`md` sizes, an accessible `loading` state (`aria-busy`, spinner, preserved accessible name), `disabled` handling for both button and link usage, and an optional leading/trailing icon slot. Includes Storybook stories for all variants/sizes/states and RTL tests covering role/name, click firing, disabled and loading behavior.
- `afterEach(cleanup)` in the Vitest setup (`src/test/setup.ts`) so multiple tests rendering the same accessible name in one file don't collide.

### Removed

- Default Storybook CLI boilerplate (`src/stories/` — `Button`, `Header`, `Page` components and stories).

### Changed

- Clarified the remote merge workflow in `CLAUDE.md` and `context/ai-interaction.md`: push branch, open PR, merge on remote via `gh pr merge`, then sync `main` locally — each step is a separate checkpoint requiring confirmation.

## [0.1.0] - 2026-07-07

### Added

- Project kickoff documentation pack.
