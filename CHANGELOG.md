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
- Full design token set in `src/styles/tokens.css` (color, typography, spacing, radius, border, shadow, motion, z-index, layout widths) using `--sr-` prefixed semantic names, plus a `prefers-reduced-motion` fallback that neutralizes motion tokens.
- `src/styles/reset.css`, a minimal CSS reset.
- `src/styles/global.css` now imports tokens + reset and sets base `html`/`body` styles (including a token-based `:focus-visible` outline) from tokens only; imported by both the app entry (`src/main.tsx`) and Storybook's `.storybook/preview.tsx` so both surfaces render identically.
- Storybook foundations catalog under `src/styles/foundations/`: an "Introduction" page describing SubRooms' design system and atomic-design organization, plus `Foundations/Color`, `Foundations/Typography`, and `Foundations/Spacing` stories that render live `tokens.css` values (read via `getComputedStyle`) in a mobile-first grid/list layout.
- `Button` atom (`src/components/atoms/Button/`): a token-driven, real `<button>` (or `<a>` via `as="a"`/`href`) with `primary`/`secondary`/`ghost` variants, `sm`/`md` sizes, an accessible `loading` state (`aria-busy`, spinner, preserved accessible name), `disabled` handling for both button and link usage, and an optional leading/trailing icon slot. Includes Storybook stories for all variants/sizes/states and RTL tests covering role/name, click firing, disabled and loading behavior.
- `afterEach(cleanup)` in the Vitest setup (`src/test/setup.ts`) so multiple tests rendering the same accessible name in one file don't collide.
- `Badge` atom (`src/components/atoms/Badge/`): a token-driven, non-interactive `<span>` for short status/metadata labels, with `neutral`/`accent`/`success`/`warning` tones, an optional leading icon (hidden from assistive tech), and predictable text truncation for long labels. Includes `--sr-color-success`, `--sr-color-success-strong`, `--sr-color-warning`, and `--sr-color-warning-strong` design tokens (added to `Foundations/Color`), Storybook stories for every tone plus a long-text truncation example, and RTL tests covering rendered text, tone class application, and icon accessibility.
- `Card` atom (`src/components/atoms/Card/`): a generic, token-driven raised-surface container rendering a static `<div>` by default, or a real `<a>` (`as="a"`, requires `href`) or `<button>` (`as="button"`) when used as an interactive surface — enforced at the type level via a discriminated union, so a `div` variant can't accept an `onClick`. Supports a `none`/`sm`/`md`/`lg` `padding` prop (default `md`) built from spacing tokens, with background, border, radius, and shadow from `--sr-*` tokens. Interactive cards get a hover tint and active-state scale, and rely on the existing global `:focus-visible` ring for keyboard focus. Includes Storybook stories for a static card, interactive-as-link, interactive-as-button, and varied content lengths, plus RTL tests covering default rendering, link/button role and element, and mouse/keyboard activation.
- `@storybook/addon-docs`, wired up with `tags: ['autodocs']` on the `Card`, `Button`, and `Badge` atom stories to generate a docs page (live canvas, props/controls table, and every story) for each.
- `@storybook/addon-vitest`, wired into `vite.config.ts` as a second Vitest project (alongside the existing jsdom unit-test project) that runs every Storybook story as a headless Chromium browser test via Playwright; CI now installs Chromium (`npx playwright install chromium --with-deps`) before `npm run test`.
- `Room` domain type (`src/types/room.ts`), matching the `Room` contract in `context/project-overview.md`.
- `RoomCard` molecule (`src/components/molecules/RoomCard/`): composes `Card` and `Badge` to represent a `Room` as an interactive, route-agnostic surface (`href` renders a link, `onClick` alone renders a button). Renders the room name, optional description (clamped to two lines), and a channel-count `Badge` derived from an optional `channelCount` prop or `room.channelIds.length`, with a distinct "No channels yet" guidance state instead of "0 channels". Renders an optional icon slot resolved from `iconName` (falling back to the room name's initial) and gives the interactive surface an explicit accessible name (`Open {name} room`). Includes Storybook stories for a typical room, empty-channel room, long name/description, with/without icon, and button usage, plus RTL tests covering rendered content, accessible name, link/button rendering, keyboard activation, and the empty-channel state.
- `VideoSummary` domain type (`src/types/video.ts`), matching the contract in `context/project-overview.md`.
- `formatPublishedDate` and `formatDuration` utilities (`src/utils/`): format an ISO 8601 timestamp as a short relative date ("3h ago", falling back to an absolute UTC date like "Jun 1, 2026" once older than a week) and a YouTube-style ISO 8601 duration ("PT1H2M3S") as clock time ("1:02:03"), each with its own unit tests.
- `VideoCard` molecule (`src/components/molecules/VideoCard/`): composes `Card`, `Badge`, and `Button` to represent a `VideoSummary` — thumbnail (decorative `alt=""`, with a decorative fallback icon when `thumbnailUrl` is missing), title, channel name (passed in by the parent), published date, duration (omitted when missing), and a "Watched" `Badge` when `video.watched` is true. Exposes an `onAddToQueue(videoId)` callback via an "Add to queue" `Button` with a video-specific accessible name (`Add {title} to queue`) — stays presentational, owns no queue logic. Includes Storybook stories for a typical video, watched video, missing thumbnail, missing duration, long title, and keyboard activation, plus RTL tests covering rendered metadata, the conditional watched badge, thumbnail/fallback decorativeness, accessible name correctness, and callback firing via mouse and keyboard.
- Storybook `play` functions (via `storybook/test`, run as real browser interaction tests by `addon-vitest`) for interaction/behavior coverage: added to the new `VideoCard` stories, and retrofitted onto existing interactive stories for `Button` (click firing, disabled/loading suppressing the callback, icon-only accessible name, link role/href), `Card` (interactive-as-link href, interactive-as-button click + keyboard activation), and `RoomCard` (link href, button click + keyboard activation). Documented as the standing convention for non-visual/interaction story coverage in `context/coding-standards.md`.
- `EmptyState` molecule (`src/components/molecules/EmptyState/`): a fully prop-driven, centered placeholder for "nothing here yet" surfaces (empty room lists, empty channel assignments, empty video feeds, empty queues) — no hardcoded copy for any specific surface. Accepts a `title` (rendered as a real heading, with a `headingLevel` prop so callers can pick the level that fits the surrounding page outline), optional `description`, optional decorative `icon` (hidden from assistive tech), and an optional `actionLabel` + `onAction` pair rendered via `Button`. Includes Storybook stories for no-rooms, no-channels-in-room, no-videos-in-feed, empty-queue, a no-action informational variant, and an in-page-context story verifying correct heading nesting, plus RTL tests covering rendered title/description, action callback firing, the no-action/no-crash case, heading level selection, and icon decorativeness.
- `RoomGrid` organism (`src/components/organisms/RoomGrid/`): composes `RoomCard` and `EmptyState` into a responsive, mobile-first grid of rooms — a single column on narrow viewports, reflowing to more columns as space allows via CSS Grid `auto-fill`/`minmax` (no hand-authored breakpoints), with gaps from spacing tokens. Renders one `RoomCard` per room as a semantic `<ul>`/`<li>` list (preserving DOM/tab order regardless of column count), or an `EmptyState` with "No rooms yet" copy and an optional create-room action when the room array is empty. Stays presentational and route-agnostic: accepts either a `getHref` resolver (rooms render as links) or an `onRoomSelect` callback (rooms render as buttons), enforced at the type level via a discriminated union mirroring `RoomCard`'s own. Includes Storybook stories for empty (with and without the create action), a single room, a few rooms, many rooms (14), and button-mode selection, plus RTL tests covering rendered `RoomCard` count, link/button rendering, the empty state and its conditional action, and single/many-room rendering without crashing.

### Removed

- Default Storybook CLI boilerplate (`src/stories/` — `Button`, `Header`, `Page` components and stories).

### Fixed

- `RoomCard` was missing `tags: ['autodocs']`, so it never got a generated docs page unlike the other atoms/molecules. Added it, matching the convention set for `Button`, `Badge`, and `Card`.
- Added JSDoc component and prop descriptions to `Badge`, `Button`, `Card`, `RoomCard`, and `VideoCard` so every autodocs page has a real component description and per-prop descriptions in the generated controls table, instead of a bare canvas + untitled props list.

### Changed

- Clarified the remote merge workflow in `CLAUDE.md` and `context/ai-interaction.md`: push branch, open PR, merge on remote via `gh pr merge`, then sync `main` locally — each step is a separate checkpoint requiring confirmation.

## [0.1.0] - 2026-07-07

### Added

- Project kickoff documentation pack.
