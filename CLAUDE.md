# YouTube Subscription Rooms

SubRooms is a React + TypeScript + Vite project for organizing YouTube subscriptions into custom viewing rooms and focused watch queues.

It is also a deliberate Senior Frontend Engineer learning project focused on design systems, Storybook, TDD, accessibility, CI/CD, semantic versioning, and AI-assisted development.

## Orientation — Read This First

- Deep context lives in `context/`:
  - `context/project-overview.md` — product vision, stack, architecture, constraints, roadmap
  - `context/coding-standards.md` — TypeScript, React, styling, testing, accessibility, file conventions
  - `context/ai-interaction.md` — workflow rules for Claude, Codex, and similar agents
  - `context/current-feature.md` — the active feature tracker; keep it current
  - `context/history.md` — append-only log of completed work
- Per-feature specs live in `context/features/`.
- Read only the docs needed for the task; do not load everything by default.

## Default Stack

- React
- TypeScript strict mode
- Vite
- Storybook
- CSS variables
- Vitest + React Testing Library
- GitHub Actions
- Vercel
- Semantic Versioning
- Keep a Changelog

Do not introduce Next.js, Tailwind, shadcn/ui, Zustand, a backend, or YouTube OAuth unless a feature spec explicitly calls for it and the user approves.

## Architecture Notes

- Storybook-first for reusable UI.
- Typed mock data before live API integration.
- CSS variables for design tokens.
- Mobile-first layout.
- Semantic HTML before ARIA.
- Small focused feature branches.
- Keep YouTube API work isolated in `src/services/` and normalize external data into internal types.

## Workflow

Before implementing any feature, restate:

1. The goal
2. Files expected to change
3. Risks
4. Verification plan
5. What will not be done
6. Current branch
7. Intended feature branch
8. Whether the working tree is clean

Then:

1. Update `context/current-feature.md` if needed.
2. Create or switch to the feature branch.
3. Implement only the scoped work.
4. Add Storybook stories for reusable UI.
5. Add meaningful tests.
6. Run verification commands.
7. Update `CHANGELOG.md` under `## [Unreleased]`.
8. Ask before committing.
9. Push the branch and open a pull request (ask first).
10. Once the user gives the go-ahead, merge the PR on the remote via `gh pr merge` (ask first).
11. Pull `main` locally to sync, then delete the merged local branch.
12. Update `context/current-feature.md` and `context/history.md`.

## Commands

```bash
npm run dev
npm run storybook
npm run test
npm run test:watch
npm run lint
npm run typecheck
npm run build
npm run build-storybook
```

Add or adjust scripts once the repo exists.

## Versioning

- Use Semantic Versioning: `MAJOR.MINOR.PATCH`.
- Keep `CHANGELOG.md` in Keep a Changelog format.
- Add changes under `## [Unreleased]` as the work happens.
- Do not bump versions automatically without approval.

## Git Rules

- Branch per feature or fix.
- Ask before committing.
- Build must pass before commit.
- Commit messages must not include AI attribution, co-author trailers, or generated-by footers.
- Never commit or merge directly on `main`; land work through a pushed branch and a pull request.
- Merge flow: push the local branch → open a PR → merge the PR on the remote (via `gh pr merge`, only after the user gives the go-ahead) → pull `main` locally to stay in sync.
- Ask before pushing and before merging; do not chain push → PR → merge without checkpoints.

## Current Product Boundary

The project should first prove:

1. Design-system foundation
2. Storybook catalog
3. Mock-data rooms dashboard
4. Mock-data room detail and queue
5. Room/channel organization
6. Only then YouTube OAuth and API integration
