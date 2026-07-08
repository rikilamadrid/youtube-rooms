# YouTube Subscription Rooms — Project Overview

> SubRooms is a personal YouTube subscription organizer that turns a noisy subscription feed into intentional viewing rooms. Users group subscribed channels into rooms like Coding, Sketching, Cooking, Music, and Gaming, then open each room as a focused latest-video feed and watch queue.

---

## Table of Contents

- [Vision](#vision)
- [Target Audience](#target-audience)
- [Core Product Idea](#core-product-idea)
- [Learning Goals](#learning-goals)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Data Models](#core-data-models)
- [Design System](#design-system)
- [UX Principles](#ux-principles)
- [Routing](#routing)
- [YouTube API Strategy](#youtube-api-strategy)
- [Accessibility](#accessibility)
- [Testing Strategy](#testing-strategy)
- [CI/CD](#cicd)
- [Performance](#performance)
- [Build Phases](#build-phases)
- [Conventions And Rules](#conventions-and-rules)
- [Things To Avoid](#things-to-avoid)

---

## Vision

The product should feel like opening clean, intentional rooms inside YouTube instead of being thrown into an endless algorithmic feed.

| Goal | Description |
| --- | --- |
| Memorable | The room metaphor makes subscriptions feel organized, calm, and personal. |
| Useful | Users can quickly jump into a focused feed: Coding, Cooking, Sketching, Gaming, Music, etc. |
| Cohesive | A token-driven design system keeps the app and Storybook visually consistent. |
| Fast | The first useful screen should render quickly with typed local/mock data before API work begins. |
| Portfolio-worthy | The project should demonstrate senior frontend architecture, design-system thinking, testing, accessibility, CI/CD, and AI-assisted workflow. |

---

## Target Audience

| Persona | What they should feel or accomplish |
| --- | --- |
| Primary users | YouTube-heavy users who subscribe to many channels and want themed viewing sessions. |
| Secondary users | Developers, designers, recruiters, and interviewers reviewing the project as a portfolio piece. |
| Stakeholders | The builder, using this project to polish Senior Frontend Engineer + Design System + AI Workflow skills. |

Primary measure of success: a user can create or understand rooms quickly, open a room, and see a polished, accessible, testable, mobile-first interface that feels intentional.

---

## Core Product Idea

Users import or mock their subscribed YouTube channels, organize them into custom rooms, and view the latest videos for each room as a focused queue.

Main surfaces:

- Storybook design-system catalog
- App shell
- Rooms dashboard
- Room detail feed
- Watch queue panel
- Channel management surface
- Settings/API connection surface

Core flows:

1. Open app.
2. See rooms.
3. Open a room.
4. Review latest videos.
5. Start a queue.
6. Later: connect YouTube and sync real subscription data.

> Every feature decision should support focused viewing rooms, not a generic YouTube clone.

---

## Learning Goals

This project is intentionally designed to sharpen interview-relevant skills:

- Component Driven Development with Storybook
- Test Driven Development with Vitest and React Testing Library
- TypeScript modeling and strict-mode ergonomics
- Design-system tokens with CSS variables
- Accessible component APIs
- Mobile-first responsive design
- CI/CD from the beginning
- Semantic Versioning and changelog discipline
- Clean feature branches and conventional commits
- AI workflow with Claude Code, Codex, or similar tools
- Small scoped PRs and senior-level implementation notes

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Build Tool | Vite |
| UI Runtime | React |
| Language | TypeScript strict mode |
| Component Catalog | Storybook |
| Styling | CSS variables + plain CSS modules or colocated CSS files |
| Testing | Vitest + React Testing Library + user-event + jest-dom |
| Lint/Format | ESLint + Prettier |
| CI | GitHub Actions |
| Deployment | Vercel |
| Versioning | Semantic Versioning |
| Changelog | Keep a Changelog |
| Data Phase 1 | Typed mock data |
| Data Phase 2 | YouTube Data API + OAuth, only after UI foundations are stable |

Notes:

- Do not introduce Tailwind, shadcn/ui, Next.js, or a backend unless the user explicitly changes the stack.
- The first deployable artifact should be Storybook.
- The app should remain useful with mock data before API integration.

---

## Project Structure

```text
.
├── .github/
│   └── workflows/
├── context/
│   ├── features/
│   ├── ai-interaction.md
│   ├── coding-standards.md
│   ├── current-feature.md
│   ├── history.md
│   └── project-overview.md
├── src/
│   ├── app/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── test/
│   ├── types/
│   └── utils/
├── .storybook/
├── CHANGELOG.md
├── AGENTS.md
├── CLAUDE.md
└── README.md
```

Adjust this structure only when the actual repo needs it.

---

## Core Data Models

Treat these models as early contracts. They can evolve, but changes should be deliberate.

```ts
export interface SubscriptionChannel {
  id: string;
  youtubeChannelId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  topicTags: string[];
  isMock?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  channelIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoSummary {
  id: string;
  youtubeVideoId: string;
  channelId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  duration?: string;
  watched?: boolean;
}

export interface WatchQueue {
  id: string;
  roomId: string;
  videoIds: string[];
  activeVideoId?: string;
}
```

---

## Design System

The design system should feel modern, calm, slightly cinematic, and practical. Think clean media dashboard, not loud social app.

Token categories:

- Color
- Typography
- Spacing
- Radius
- Border
- Shadow
- Motion
- Z-index
- Layout widths

Initial token sketch:

```css
:root {
  --sr-color-bg: #0f1117;
  --sr-color-surface: #171a23;
  --sr-color-surface-raised: #202433;
  --sr-color-text: #f5f7fb;
  --sr-color-text-muted: #a9b0c3;
  --sr-color-border: rgba(255, 255, 255, 0.12);
  --sr-color-accent: #7c8cff;
  --sr-color-accent-strong: #aab3ff;

  --sr-font-family-base: Inter, ui-sans-serif, system-ui, sans-serif;
  --sr-font-size-sm: 0.875rem;
  --sr-font-size-md: 1rem;
  --sr-font-size-lg: 1.125rem;
  --sr-font-size-xl: 1.5rem;

  --sr-space-1: 0.25rem;
  --sr-space-2: 0.5rem;
  --sr-space-3: 0.75rem;
  --sr-space-4: 1rem;
  --sr-space-6: 1.5rem;
  --sr-space-8: 2rem;

  --sr-radius-sm: 0.5rem;
  --sr-radius-md: 0.875rem;
  --sr-radius-lg: 1.25rem;
  --sr-radius-pill: 999px;

  --sr-shadow-soft: 0 20px 60px rgba(0, 0, 0, 0.28);
  --sr-motion-fast: 120ms ease;
  --sr-motion-base: 180ms ease;
}
```

Rules:

- Tokens first, one-off values last.
- Components should expose intent-based props, not raw style escape hatches.
- Every reusable UI component should have a Storybook story and at least basic tests.

---

## UX Principles

- Mobile-first, then progressively enhanced.
- Prioritize focused viewing over infinite browsing.
- Make rooms feel personal and easy to scan.
- Do not mimic YouTube’s clutter.
- Empty, loading, and error states are part of the product, not afterthoughts.
- Use motion only for orientation, feedback, or state transitions.
- Keep every interactive target touch-friendly.

---

## Routing

| Route | Purpose |
| --- | --- |
| `/` | Rooms dashboard and project landing surface. |
| `/rooms/:roomId` | Room detail with latest videos and queue actions. |
| `/channels` | Manage channels and assign them to rooms. |
| `/settings` | YouTube connection, sync status, and preferences. |

Routes can be simple React Router routes or app-level state until routing is needed. Do not add a router before a feature requires it.

---

## YouTube API Strategy

Start with typed mock data. Add real YouTube integration only after the design system, room flows, and queue UI are stable.

Important constraints:

- YouTube Data API has daily quota limits and per-method costs.
- Use read-only OAuth scope where possible.
- Avoid `search.list` for routine latest-video fetching when a lower-cost uploads playlist strategy works.
- Do not download, rehost, or bypass YouTube playback.
- Use the YouTube IFrame Player API or embedded player for playback.
- Treat autoplay carefully because browser autoplay rules may require muted playback or user interaction.
- Cache only in ways allowed by YouTube API policies.

Potential integration approach:

1. Use OAuth to read subscriptions.
2. Store user-created room/group assignments locally or in a small backend later.
3. Fetch channel upload playlist IDs.
4. Fetch recent uploads from playlist items.
5. Normalize videos into `VideoSummary`.
6. Build a room queue from the normalized list.

---

## Accessibility

Minimum expectations:

- Semantic headings and landmarks
- Visible focus states
- Keyboard-accessible buttons, cards, menus, tabs, dialogs, and queue controls
- Sufficient contrast for text, borders, and focus rings
- No hover-only behavior
- Touch targets around 44px where practical
- `prefers-reduced-motion` support when animation exists
- Form fields have labels and useful errors
- Status messages for loading, empty, and error states

Each component story should include short accessibility notes.

---

## Testing Strategy

Use testing to support confidence, not noise.

Recommended test levels:

- Token and utility tests when logic exists
- Component behavior tests with React Testing Library
- Accessibility-minded tests for labels, roles, focus, disabled states, and keyboard interactions
- Mock-data tests for sorting/filtering latest videos
- Light integration tests for room dashboard and room detail flows

Preferred sequence for a component:

1. Define behavior and props.
2. Write or outline tests.
3. Build the component.
4. Add Storybook stories.
5. Verify mobile layout in Storybook.

---

## CI/CD

CI should exist from the beginning.

Required GitHub Actions checks:

- Install dependencies with `npm ci`
- Typecheck
- Lint
- Unit/component tests
- Vite build
- Storybook build

Deployment:

- Vercel should deploy the app and/or Storybook preview early.
- The first public visible milestone can be Storybook if the app shell is not ready yet.
- Pull requests should produce preview deployments once Vercel is connected.

---

## Performance

- Keep first milestone mock-data-only and fast.
- Avoid large dependencies for simple UI.
- Prefer CSS transitions over heavy animation libraries at first.
- Keep Storybook stories focused and not overloaded.
- Lazy-load YouTube embeds/player surfaces later.
- Avoid fetching every subscribed channel too often once real API work starts.

---

## Build Phases

| Phase | Deliverable |
| --- | --- |
| 1 | Project foundation: Vite, TypeScript, Storybook, Vitest, tokens, CI/CD, changelog. |
| 2 | Design-system primitives and Storybook catalog. |
| 3 | Mock-data product shell: rooms dashboard, room detail, latest-video feed, queue UI. |
| 4 | Local state and persistence: create/edit rooms, assign channels, persist preferences. |
| 5 | YouTube API proof of concept: OAuth, subscriptions read, uploads fetching, quota-safe sync. |
| 6 | Polish: accessibility pass, responsive QA, performance, interview narrative, portfolio write-up. |

## Feature Roadmap Creation

Before implementing product features, Claude Code or Codex should create a sequential feature roadmap inside:

```text
context/features/
```

The roadmap must be generated from this project overview and must follow the structure shown in:

```text
context/example-feature-spec.md
```

Each feature file should represent one focused, reviewable slice of work that can be completed on its own feature branch.

Feature files must include:

- Feature name
- Status
- Overview
- Problem
- Goal
- Requirements
- Out of scope
- UX notes
- Technical notes
- Acceptance criteria
- Verification steps
- References
- Suggested branch
- Suggested commit

Each feature should be small enough to support:

- Component Driven Development
- Test Driven Development
- Storybook-first UI development
- Accessibility review
- Mobile-first implementation
- A clean Git diff
- One focused feature branch
- One focused commit

Suggested branch names should follow this format:

```text
feature/[phase-number]-[feature-slug]
```

Examples:

```text
feature/01-project-foundation
feature/02-design-tokens
feature/03-storybook-foundations
feature/04-button-primitive
feature/05-room-card
```

The roadmap should follow the build phases already defined in this document:

1. Project foundation
2. Design-system primitives and Storybook catalog
3. Mock-data product shell
4. Local state and persistence
5. YouTube API proof of concept
6. Polish, accessibility, performance, and portfolio narrative

The early roadmap should prioritize the Storybook catalog and design system before product functionality or YouTube API integration.

Recommended early feature sequence:

1. Project foundation
2. Design tokens and global CSS variables
3. Storybook foundations catalog
4. Button primitive
5. Badge primitive
6. Card primitive
7. RoomCard molecule
8. VideoCard molecule
9. EmptyState molecule
10. Room grid organism
11. Mock data models and fixtures
12. Dashboard shell
13. Room detail layout
14. Watch queue UI
15. Accessibility and responsive QA pass
16. CI/CD and Vercel preview polish
17. YouTube API exploration spike
18. YouTube API integration

Roadmap creation rules:

- Do not implement the features while creating the roadmap.
- Do not install packages during roadmap creation.
- Do not create React components during roadmap creation.
- Do not integrate the YouTube API during roadmap creation.
- Only create or update markdown files inside `context/features/`.
- If `context/features/` does not exist, create it.
- Use `context/example-feature-spec.md` as the required format reference.
- Keep features small, sequential, and easy for AI agents to execute later.
- Every feature should include a `Suggested Branch` section.
- Every feature should include a `Suggested Commit` section.

After creating the feature roadmap, summarize:

- Feature file name
- One-line purpose
- Build phase
- Suggested branch
- Suggested commit
- Whether it creates a visible Storybook or app win

---

## Conventions And Rules

- Production quality by default.
- Storybook-first for reusable UI.
- Tests close to components and utilities.
- CSS variables for tokens.
- Mobile-first CSS.
- Semantic HTML before ARIA.
- Keep external API integration out of early UI foundation work.
- Keep changes small enough for one focused branch and one clean commit.
- Update `CHANGELOG.md` under `## [Unreleased]` during work.
- Update `context/current-feature.md` before starting and after finishing each feature.
- Update `context/history.md` after a feature lands.

---

## Things To Avoid

- Building a generic YouTube clone.
- Starting with OAuth before the UI architecture is proven.
- Desktop-first layouts.
- Adding Tailwind, shadcn/ui, Next.js, Zustand, or backend services without explicit approval.
- Huge AI-agent prompts that ask for too much at once.
- Commits with AI attribution, co-author trailers, or generated-by footers.
- Unscoped refactors.
- One-off styles that bypass tokens.
- Test files that only assert implementation details.
