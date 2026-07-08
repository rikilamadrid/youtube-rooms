# Feature Spec: Project Foundation

## Status

Not Started

## Overview

Initialize the SubRooms repository as a working Vite + React + TypeScript project with the baseline tooling the rest of the roadmap depends on: Storybook, Vitest + React Testing Library, ESLint/Prettier, GitHub Actions CI, and a Semantic Versioning + Keep a Changelog workflow. This is the scaffolding phase — no product UI yet.

## Problem

There is currently no runnable project, only documentation. Every later feature (design tokens, Storybook catalog, mock-data shell) assumes a working build, a test runner, a component catalog, and CI checks already exist. Without this foundation, later features would each need to improvise tooling decisions inconsistently.

## Goal

A developer (or AI agent) can clone the repo, run `npm install`, and immediately get a working dev server, a working Storybook instance, a passing test suite with at least one real test, and a passing build — all wired into CI.

## Requirements

* Scaffold a Vite + React + TypeScript (strict mode) project.
* Add Storybook configured for the same React/TypeScript setup.
* Add Vitest + React Testing Library + `@testing-library/user-event` + `jest-dom`, with at least one real example test (not a placeholder).
* Add ESLint + Prettier configured for TypeScript and React.
* Create the base folder structure from `context/project-overview.md` (`src/app`, `src/components/{atoms,molecules,organisms,templates}`, `src/data`, `src/hooks`, `src/services`, `src/styles`, `src/test`, `src/types`, `src/utils`, `.storybook`).
* Add a placeholder `src/styles/tokens.css` (empty or minimal) so the app and Storybook both import a single token entry point; full token content is scoped to feature 02.
* Add npm scripts: `dev`, `storybook`, `test`, `test:watch`, `lint`, `typecheck`, `build`, `build-storybook`.
* Add a GitHub Actions workflow that runs on push/PR: `npm ci`, typecheck, lint, test, build, build-storybook.
* Initialize `CHANGELOG.md` in Keep a Changelog format with an `## [Unreleased]` section documenting this foundation work.
* Initialize git (if not already) with a sensible `.gitignore` (node_modules, dist, storybook-static, .env, etc.).

## Out Of Scope

* Design tokens beyond a placeholder import (feature 02).
* Any Storybook stories beyond Storybook's own default/example story (feature 03).
* Any product components: Button, Card, RoomCard, etc. (features 04+).
* Vercel project creation/connection (can be noted as a manual follow-up, not automated here).
* Routing library installation (not needed yet).

## UX Notes

* No user-facing UI is introduced beyond Vite/Storybook default starter screens.
* Confirm the default starter screens render without console errors — this is the only "visual" check at this stage.

## Technical Notes

Likely files/directories:

* `package.json`, `tsconfig.json`, `vite.config.ts`
* `.storybook/main.ts`, `.storybook/preview.ts`
* `vitest.config.ts` or Vitest config merged into `vite.config.ts`
* `src/test/setup.ts` (jest-dom matchers, RTL cleanup)
* `.eslintrc.cjs` or `eslint.config.js`, `.prettierrc`
* `.github/workflows/ci.yml`
* `src/styles/tokens.css` (placeholder)
* `CHANGELOG.md`, `.gitignore`

Implementation notes:

* Use TypeScript strict mode from the start; do not loosen it later.
* Keep the example test meaningful (e.g., render the default `App` component and assert visible text), not a trivial `1 + 1` assertion.
* Follow the project structure and naming conventions in `context/coding-standards.md` exactly so later features don't need to restructure.

## Acceptance Criteria

* `npm run dev` starts the app locally.
* `npm run storybook` starts Storybook locally.
* `npm run build` passes.
* `npm run build-storybook` passes.
* `npm run test` passes with at least one real example test.
* `npm run lint` and `npm run typecheck` pass.
* GitHub Actions workflow exists and runs all checks on push/PR.
* `CHANGELOG.md` has an `## [Unreleased]` entry describing the foundation work.
* The base folder structure exists even where some folders are currently empty (use `.gitkeep` if needed).

## Verification

* Run `npm install` from a clean clone and confirm no errors.
* Run each of: `npm run dev`, `npm run storybook`, `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run build-storybook`.
* Push a branch and confirm the GitHub Actions workflow runs and passes.
* Confirm `tsconfig.json` has `"strict": true`.

## References

* `context/project-overview.md`
* `context/coding-standards.md`
* `context/ai-interaction.md`
* `context/current-feature.md`

## Suggested Branch

`feature/01-project-foundation`

## Suggested Commit

`chore: scaffold vite react typescript project with storybook vitest and ci`
