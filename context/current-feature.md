# Current Feature: Project Foundation

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

Branch: `feature/01-project-foundation`

## Status

In Progress

Spec: `context/features/01-project-foundation.md`

## Goals

- Scaffold a Vite + React + TypeScript (strict mode) project.
- Add Storybook configured for the same React/TypeScript setup.
- Add Vitest + React Testing Library + `@testing-library/user-event` + `jest-dom`, with at least one real example test (not a placeholder).
- Add ESLint + Prettier configured for TypeScript and React.
- Create the base folder structure from `context/project-overview.md` (`src/app`, `src/components/{atoms,molecules,organisms,templates}`, `src/data`, `src/hooks`, `src/services`, `src/styles`, `src/test`, `src/types`, `src/utils`, `.storybook`).
- Add a placeholder `src/styles/tokens.css` so app and Storybook both import a single token entry point (full tokens are feature 02).
- Add npm scripts: `dev`, `storybook`, `test`, `test:watch`, `lint`, `typecheck`, `build`, `build-storybook`.
- Add a GitHub Actions workflow that runs on push/PR: `npm ci`, typecheck, lint, test, build, build-storybook.
- Initialize `CHANGELOG.md` in Keep a Changelog format with an `## [Unreleased]` section for this foundation work.
- Initialize git (if not already) with a sensible `.gitignore`.

### Definition of done / Acceptance Criteria

- `npm run dev` starts the app locally.
- `npm run storybook` starts Storybook locally.
- `npm run build` passes.
- `npm run build-storybook` passes.
- `npm run test` passes with at least one real example test.
- `npm run lint` and `npm run typecheck` pass.
- GitHub Actions workflow exists and runs all checks on push/PR.
- `CHANGELOG.md` has an `## [Unreleased]` entry describing the foundation work.
- Base folder structure exists (use `.gitkeep` for empty folders).
- `tsconfig.json` has `"strict": true`.

## Notes

- Out of scope: design tokens beyond a placeholder import, Storybook stories beyond the default example, any product components, Vercel connection (manual follow-up only), routing library.
- Keep the example test meaningful (e.g., render `App` and assert visible text) — not a trivial assertion.
- Follow folder/naming conventions in `context/coding-standards.md` exactly so later features don't need restructuring.
- Suggested branch: `feature/01-project-foundation`
- Suggested commit: `chore: scaffold vite react typescript project with storybook vitest and ci`
- Keep YouTube API integration out of this first feature.
- The first visible win should be a working Storybook catalog, even if it only has token demos and one primitive component.
- Work mobile-first from the beginning.

---

## Up next

- `context/features/02-design-token-foundation.md`

---

## Recently landed

- Project kickoff documentation pack generated on 2026-07-07.
