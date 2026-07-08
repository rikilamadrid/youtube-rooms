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

- `context/features/02-design-token-foundation.md`

---

## Recently landed

- Project kickoff documentation pack generated on 2026-07-07.
- Feature 01 — Project Foundation (2026-07-08): scaffolded Vite + React + TypeScript (strict) app, Storybook (react-vite + a11y addon, default example stories), Vitest + React Testing Library + jest-dom + user-event with a real `App` test, ESLint (flat config) + Prettier, the base `src/` folder structure, placeholder `src/styles/tokens.css`, npm scripts, GitHub Actions CI (typecheck/lint/test/build/build-storybook), and the `CHANGELOG.md` entry. Trimmed the default `storybook init` output down to just `@storybook/addon-a11y` (dropped addon-vitest/Playwright, Chromatic, docs, and mcp addons, plus the default `Configure.mdx` welcome page which failed to build under Vite 8's rolldown bundler) to stay in scope for a lean foundation.
