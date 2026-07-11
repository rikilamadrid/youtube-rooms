# YouTube Subscription Rooms (SubRooms)

A focused React + TypeScript portfolio project for organizing YouTube subscriptions into personal viewing rooms like Coding, Sketching, Cooking, Music, and Gaming.

The product goal is simple: make YouTube subscriptions feel intentional again. Instead of one noisy feed, users create custom rooms, see the latest videos from the channels in each room, and start a focused watch queue.

The engineering goal is equally important: build this as a Senior Frontend Engineer learning project with Component Driven Development, Test Driven Development, a real design system, CI/CD, Storybook, accessibility notes, semantic versioning, and a clean AI-assisted workflow for Claude Code, Codex, or similar tools.

## Core Stack

- React
- TypeScript strict mode
- Vite
- Storybook
- CSS variables for design tokens
- Vitest + React Testing Library
- GitHub Actions
- Vercel
- Semantic Versioning
- Keep a Changelog

## First Milestone

Ship a deployed Storybook catalog containing the foundation of the design system:

- Tokens
- Button
- IconButton
- Card
- Badge
- EmptyState
- RoomCard
- VideoCard

No YouTube API integration in the first milestone. Start with typed mock data so the UI, accessibility, tests, and design system can mature before OAuth and API constraints enter the project.

## Recommended Setup Flow

1. Create a new Vite React TypeScript app.
2. Add Storybook.
3. Add Vitest and React Testing Library.
4. Add CSS token files.
5. Add GitHub Actions for install, lint, typecheck, test, build, and Storybook build.
6. Connect the repo to Vercel.
7. Work feature-by-feature from `context/current-feature.md`.

## Deployment & CI/CD

**Production:** _pending Vercel connection — add the live URL here once the project is linked (see setup steps below)._

**How CI/CD works:**

- GitHub Actions (`.github/workflows/ci.yml`) is the source of truth for correctness. Every push to `main` and every pull request runs `typecheck`, `lint`, `test`, `build`, and `build-storybook`.
- Vercel deployments are additive, not a gate — they don't replace CI, they give a visual preview alongside it.
- Once the Vercel project is connected, every pull request gets an automatic preview deployment at a unique URL (posted as a PR check/comment by the Vercel GitHub integration), and every merge to `main` redeploys production automatically. No manual redeploy step is needed either way.

**Connecting Vercel (one-time, manual):**

1. In the [Vercel dashboard](https://vercel.com/new), import this GitHub repository.
2. Framework preset: Vite (auto-detected). Build command: `npm run build`. Output directory: `dist` (Vercel's defaults — no `vercel.json` override needed).
3. No environment variables are required yet (see below).
4. Enable the Vercel GitHub integration's PR comments so preview links show up on pull requests automatically.
5. Storybook is not deployed separately — it's covered by CI's `build-storybook` check. Revisit a dedicated Storybook deployment (e.g. a second Vercel project pointed at `storybook-static`) if a shareable Storybook link becomes useful later.

**Branch protection (recommended, configured manually in GitHub):**

- Require the CI workflow to pass before merging pull requests into `main`.
- Require branches to be up to date before merging.
- This isn't enforced by automation in this repo — set it under the repo's Settings → Branches → Branch protection rules.

**Environment variables:**

- Vite only exposes env vars prefixed `VITE_` to client code (via `import.meta.env`); unprefixed vars stay server/build-only and are never bundled.
- No real environment variables exist yet — YouTube API keys and any other secrets are out of scope until Build Phase 5 (features 17-18). When they're introduced, set them in Vercel's Project Settings → Environment Variables (scoped per Production/Preview/Development) and document the required keys here.

## Project Docs

- `context/project-overview.md` — product vision, architecture, stack, data model, roadmap
- `context/current-feature.md` — the active feature tracker
- `context/history.md` — append-only shipped work log
- `context/coding-standards.md` — code, component, styling, testing standards
- `context/ai-interaction.md` — workflow rules for AI agents
- `context/features/` — feature roadmap for CCD + TDD workflow
- `CLAUDE.md` and `AGENTS.md` — AI-agent orientation files

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

Add scripts as the repo is initialized.

## Build Philosophy

One feature. One branch. One focused diff. One clean commit.

Build the UI in Storybook first, test it, document its accessibility expectations, then integrate it into the app.
