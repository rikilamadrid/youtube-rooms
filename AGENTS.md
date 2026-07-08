# Agent Guide

The full project guide lives in **[CLAUDE.md](./CLAUDE.md)**. Read it first for orientation, architecture, conventions, and commands.

Quick pointers:

- Deep context lives in `context/*.md`.
- Per-feature specs live in `context/features/`.
- Keep `context/current-feature.md` current before and after feature work.
- Reusable UI should be built Storybook-first.
- Use Vitest + React Testing Library for useful behavior tests.
- Use CSS variables for design tokens.
- Work mobile-first.
- `npm run build` and `npm run build-storybook` must pass before commit.
- Ask before committing.
- Commit messages carry no AI attribution.
- Do not add YouTube API integration until a feature spec explicitly scopes it.
