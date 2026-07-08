# Current Feature

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

Branch: `main` until the repo is initialized. After setup, branch per task.

## Status

Current state:

- `Project kickoff and foundation planning`

### Active scope

- Create the initial Vite + React + TypeScript project.
- Add Storybook as the first visible development surface.
- Add Vitest + React Testing Library test foundation.
- Add CSS token foundation using CSS variables.
- Add CI checks for typecheck, lint, test, build, and Storybook build.
- Add Semantic Versioning and Keep a Changelog workflow.

### Definition of done

- The app runs locally with `npm run dev`.
- Storybook runs locally with `npm run storybook`.
- `npm run build` passes.
- `npm run build-storybook` passes.
- `npm run test` passes with at least one real example test.
- GitHub Actions workflow exists and runs the basic checks.
- Vercel project is connected or ready to connect.
- `CHANGELOG.md` has an `## [Unreleased]` entry for the foundation work.
- The first design token file exists and is imported by the app and Storybook.

---

## Up next

- `context/features/02-design-token-foundation.md`

---

## Recently landed

- Project kickoff documentation pack generated on 2026-07-07.

---

## Notes

- Keep YouTube API integration out of this first feature.
- The first visible win should be a working Storybook catalog, even if it only has token demos and one primitive component.
- Work mobile-first from the beginning.
