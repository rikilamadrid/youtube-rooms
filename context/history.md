# Project History

Append-only log of completed work. Keep `context/current-feature.md` focused on what is active now, and summarize shipped work here after it lands.

## Completed work

### 2026-07-10 — Feature 13: Room Detail Layout

- Replaced the feature-12 placeholder `/rooms/:roomId` page with a real room detail view.
- Added `resolveRoomVideoFeed` (`src/utils/resolveRoomVideoFeed.ts`): resolves a room's `channelIds` to their videos from `mockVideos`, attaches each video's resolved channel title, and sorts by `publishedAt` descending; unit-tested for ordering, channel-title resolution, and the no-channels/no-videos/single-video edge cases.
- Added the `VideoFeed` organism (`src/components/organisms/VideoFeed/`): a mobile-first, single-column list of `VideoCard`s, or an `EmptyState` with caller-supplied title/description when there are none. Storybook stories cover a typical feed, a single video, and both empty-state variants; RTL tests cover rendered count, callback forwarding, and the empty state.
- `RoomDetailPage` (`src/app/routes/RoomDetailPage.tsx`) now renders a room header (name, description, channel-count `Badge`) and a "Latest videos" `VideoFeed`, with three distinct states: room not found, room with no channels, and room with channels but no recent videos. Each `VideoCard`'s "Add to queue" action is wired to a placeholder console-logged callback — the real watch queue is feature 14.
- Added `room-jazz-theory` mock room (`src/data/mockRooms.ts`): one channel assigned (`channel-adam-neely`) with zero videos, completing the "channels assigned but no recent videos" edge case that feature 11's fixtures didn't cover.
- Verified `typecheck`, `lint`, `test` (130 jsdom tests + 50 real-Chromium Storybook interaction tests via `addon-vitest`), `build`, and `build-storybook` all pass. Landed via PR #17.

### 2026-07-09 — Feature 12: Dashboard Shell

- Introduced client-side routing with `react-router-dom` (the only new dependency): `App.tsx` renders a `BrowserRouter` with a `/` dashboard route and a `/rooms/:roomId` route, both nested under a shared `AppShell` layout.
- Built `AppShell` (`src/app/AppShell.tsx`/`.css`): a minimal, token-driven app frame with a header (brand link back to `/`) and a content container, rendering route content via `Outlet`.
- Built `DashboardPage` (`src/app/routes/DashboardPage.tsx`): the `/` route, a thin composition of `RoomGrid` with `mockRooms`; selecting a room navigates to `/rooms/:roomId` via `useNavigate`.
- Built `RoomDetailPage` (`src/app/routes/RoomDetailPage.tsx`): a minimal placeholder for `/rooms/:roomId` that resolves the room from `mockRooms` by `useParams`, showing the room name or a "Room not found" state with a link back to `/`; full detail UI lands in feature 13.
- Verified `typecheck`, `lint`, `test`, and `build` all pass. Landed via PR #16.

### 2026-07-09 — Feature 11: Mock Data Models And Fixtures

- Added the `SubscriptionChannel` and `WatchQueue` domain types (`src/types/channel.ts`, `src/types/queue.ts`), matching the contracts in `context/project-overview.md` and completing the four Core Data Models alongside the existing `Room` and `VideoSummary` types.
- Added one authoritative, cross-referenced set of typed mock data fixtures under `src/data/`: `mockChannels.ts` (10 channels, all `isMock: true`), `mockRooms.ts` (6 rooms: Coding, Cooking, Sketching, Gaming, Music, and an empty "Someday" room), `mockVideos.ts` (16 videos), and `mockQueues.ts` (4 queues) — all with stable, mutually-resolving ids.
- Included deliberate edge cases: a room with zero channels, a channel with zero recent videos, videos missing a thumbnail or a duration, and a queue with no active video.
- Verified cross-referential consistency (every `channelId`, `roomId`, and video id in a queue resolves to a real record) with a one-off script; no dangling ids.
- No accessor helpers added — no concrete consumer exists yet, per the spec's guidance against speculative query APIs.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test` (110 tests), and `npm run build`.
- Landed via PR #15.

### 2026-07-09 — Feature 09: EmptyState Molecule

- Added the `EmptyState` molecule (`src/components/molecules/EmptyState/`): a fully prop-driven, centered placeholder for "nothing here yet" surfaces (empty room lists, empty channel assignments, empty video feeds, empty queues) — no hardcoded copy for any specific surface.
- Accepts a `title` (rendered as a real heading, with a `headingLevel` prop so callers can pick the level that fits the surrounding page outline), optional `description`, optional decorative `icon` (hidden from assistive tech), and an optional `actionLabel` + `onAction` pair rendered via the `Button` atom.
- Added Storybook stories for no-rooms, no-channels-in-room, no-videos-in-feed, empty-queue, a no-action informational variant, and an in-page-context story verifying correct `h1`→`h2`→`h3` heading nesting.
- Added RTL tests covering rendered title/description, action callback firing, the no-action/no-crash case, heading level selection, and icon decorativeness.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and `npm run build-storybook`.

### 2026-07-09 — Feature 08: VideoCard Molecule

- Added the `VideoSummary` domain type (`src/types/video.ts`), matching the contract in `context/project-overview.md`.
- Added the `VideoCard` molecule (`src/components/molecules/VideoCard/`), composing `Card`, `Badge`, and `Button` to represent a video: thumbnail (decorative `alt=""`, with a decorative fallback icon when `thumbnailUrl` is missing), title, channel name (passed in by the parent), published date, duration (omitted when missing), and a "Watched" `Badge` when `video.watched` is true.
- Exposes an `onAddToQueue(videoId)` callback via an "Add to queue" `Button` with a video-specific accessible name (`Add {title} to queue`) — stays presentational, owns no queue logic.
- Added `formatPublishedDate` and `formatDuration` utilities (`src/utils/`), each with their own unit tests.
- Added Storybook stories for a typical video, watched video, missing thumbnail, missing duration, long title, and keyboard activation.
- Added RTL tests covering rendered metadata, the conditional watched badge, thumbnail/fallback decorativeness, accessible name correctness, and callback firing via mouse and keyboard.
- Adopted Storybook `play` functions (via `storybook/test`) as the standing convention for interaction/behavior story coverage, documented in `context/coding-standards.md`, and retrofitted them onto existing interactive stories for `Button`, `Card`, and `RoomCard`.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
- Landed via PR #12.

### 2026-07-09 — Feature 07: RoomCard Molecule

- Added the `Room` domain type (`src/types/room.ts`), matching the `Room` contract in `context/project-overview.md`.
- Added the `RoomCard` molecule (`src/components/molecules/RoomCard/`), composing `Card` and `Badge` to represent a `Room` as an interactive, route-agnostic surface: `href` renders a link, `onClick` alone renders a button.
- Renders the room name, an optional two-line-clamped description, and a channel-count `Badge` derived from an optional `channelCount` prop or `room.channelIds.length`, with a distinct "No channels yet" guidance state instead of "0 channels".
- Renders an optional icon slot resolved from `iconName`, falling back to the room name's initial; the interactive surface has an explicit accessible name (`Open {name} room`).
- Added Storybook stories for a typical room, empty-channel room, long name/description, with/without icon, and button usage.
- Added RTL tests covering rendered content, accessible name, link/button rendering, keyboard activation, and the empty-channel state.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and `npm run build-storybook`.
- Landed via PR #11.

### 2026-07-09 — Chore: Storybook addon-docs and addon-vitest

- Added `@storybook/addon-docs` and tagged the `Card`, `Button`, and `Badge` atom stories with `tags: ['autodocs']`, generating a docs page (live canvas, props/controls table, all stories) for each.
- Added `@storybook/addon-vitest`, splitting `vite.config.ts` into two Vitest projects: the existing jsdom RTL unit-test project, and a new `storybook` project that runs every Storybook story as a headless-Chromium browser test via Playwright.
- Installed the Playwright Chromium binary locally and updated GitHub Actions CI to run `npx playwright install chromium --with-deps` before `npm run test`.
- This reverses part of the Feature 01 decision to drop addon-vitest/Playwright and addon-docs for a lean foundation — revisited now that the design-system catalog has enough components to be worth documenting and smoke-testing automatically.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test` (44 tests across 11 files), `npm run build`, and `npm run build-storybook`; visually confirmed the generated Badge autodocs page renders correctly.
- Landed via PR #10, merged to `main` independent of the (at the time in-progress) `feature/07-room-card` branch.

### 2026-07-09 — Feature 06: Card Primitive

- Added a token-driven `Card` atom (`src/components/atoms/Card/`): a generic raised-surface container rendering a static `<div>` by default, or a real `<a>` (`as="a"`, requires `href`) or `<button>` (`as="button"`) when used as an interactive surface.
- Prop shapes are enforced via a TypeScript discriminated union, so a `div` variant can't accept an `onClick`, and `as="a"` requires `href` at the type level (mirroring the `Button` primitive's approach).
- Supports a `none`/`sm`/`md`/`lg` `padding` prop (default `md`) built from spacing tokens; background, border, radius, and shadow all come from `--sr-*` tokens.
- Interactive cards get a hover tint and active-state scale, and reuse the existing global `:focus-visible` ring for keyboard focus rather than a bespoke one.
- Composition is generic via `children` only — no assumed header/media/footer slots, deferring that structure to the `RoomCard`/`VideoCard` molecules that will consume this primitive.
- Added Storybook stories for a static card, interactive-as-link, interactive-as-button, and varied content lengths.
- Added RTL tests covering default rendering, link/button role and element, and mouse/keyboard activation.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and `npm run build-storybook`.

### 2026-07-09 — Feature 05: Badge Primitive

- Added a token-driven `Badge` atom (`src/components/atoms/Badge/`): a non-interactive `<span>` for short status/metadata labels, defaulting to a `neutral` tone with `accent`/`success`/`warning` alternatives.
- Tone backgrounds and borders are derived from `--sr-*` tokens via `color-mix()`, not new literal colors; added `--sr-color-success`, `--sr-color-success-strong`, `--sr-color-warning`, and `--sr-color-warning-strong` to `tokens.css` and the `Foundations/Color` story.
- Supports an optional leading icon, hidden from assistive tech via `aria-hidden`, so the badge's accessible name always comes from its text label rather than color or icon alone.
- Long labels truncate to a single line (`text-overflow: ellipsis`) instead of wrapping or overflowing the layout.
- Added Storybook stories for every tone, with/without icon, and a long-text truncation example.
- Added RTL tests covering rendered text, default and explicit tone class application, and icon accessibility.
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.

### 2026-07-09 — Feature 04: Button Primitive

- Added a token-driven `Button` atom (`src/components/atoms/Button/`) rendering a real `<button>` or, via `as="a"`/`href`, an anchor, using a TypeScript discriminated union so invalid prop shapes (e.g. `as="a"` without `href`) fail at compile time.
- Supports `primary`/`secondary`/`ghost` variants, `sm`/`md` sizes, `disabled`, an accessible `loading` state (`aria-busy`, spinner, preserved accessible name), and optional leading/trailing icons including icon-only usage via `aria-label`.
- Styled entirely from `--sr-*` tokens, with hover/active shades derived via `color-mix()` and `prefers-reduced-motion` handling for the spinner animation.
- Added Storybook stories for every state and RTL tests covering role/name, mouse and keyboard activation, disabled, loading, anchor mode, and icon-only naming.
- Fixed a test-isolation bug by adding `afterEach(cleanup)` to `src/test/setup.ts` (a render from one test was leaking into the next).
- Added Vitest v8 coverage tooling (`@vitest/coverage-v8`, `npm run test:coverage`, HTML report under `coverage/`, ESLint ignore for the generated output).
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and `npm run build-storybook`.

### 2026-07-09 — Feature 03: Storybook Foundations Catalog

- Added `src/styles/foundations/` with an Introduction page describing SubRooms' design system and atomic-design organization, plus `Foundations/Color`, `Foundations/Typography`, and `Foundations/Spacing` stories.
- All token demo stories read live values from `tokens.css` at render time (via `getComputedStyle`, no restated literals) in a mobile-first, low-visual-noise grid/list layout.
- Removed the default Storybook CLI boilerplate (`src/stories/` — `Button`, `Header`, `Page` components and stories).
- Verified with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build-storybook`.

### 2026-07-08 — Feature 02: Design Token Foundation

- Built out the full token set in `src/styles/tokens.css`: color, typography, spacing, radius, border, shadow, motion, z-index, and layout-width groups, all `--sr-` prefixed and semantically named, each with a short comment block.
- Added a `prefers-reduced-motion` media query in `tokens.css` that zeroes out the motion tokens.
- Added `src/styles/reset.css`, a minimal CSS reset.
- Consolidated `src/styles/global.css` to `@import` tokens + reset and set base `html`/`body` styles (background, text, font) from tokens only, plus a token-based `:focus-visible` outline.
- Wired the single global stylesheet into both `src/main.tsx` and `.storybook/preview.tsx` so the app and Storybook render identically.
- Verified with `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`; confirmed the compiled CSS output is byte-identical between the app and Storybook builds, and cross-checked live via Playwright screenshots of the running dev server and a Storybook story (matching background/text colors, no console errors).

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
