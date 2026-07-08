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

### Changed

- Clarified the remote merge workflow in `CLAUDE.md` and `context/ai-interaction.md`: push branch, open PR, merge on remote via `gh pr merge`, then sync `main` locally — each step is a separate checkpoint requiring confirmation.

## [0.1.0] - 2026-07-07

### Added

- Project kickoff documentation pack.
