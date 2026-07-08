# Project History

Append-only log of completed work. Keep `context/current-feature.md` focused on what is active now, and summarize shipped work here after it lands.

## Completed work

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
