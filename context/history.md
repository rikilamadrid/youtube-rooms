# Project History

Append-only log of completed work. Keep `context/current-feature.md` focused on what is active now, and summarize shipped work here after it lands.

## Completed work

### 2026-07-11 — Feature 21: Channel Assignment UX

- `ChannelAssignmentList` now has a live, client-side title filter (`Filter channels` input, no submit button) with a visually-hidden `role="status"` region announcing the visible result count.
- Channels are split into "Assigned"/"Unassigned" fieldset groups (or a single "All channels" group when nothing is assigned yet) instead of one flat checkbox list, so assigned channels are visually distinguishable at a glance.
- Filtering to zero matches shows its own inline empty state ("No channels match '{query}'"), distinct from the existing "no synced channels yet" state, which is unchanged.
- Checkbox toggle interaction, keyboard behavior, and `RoomDetailPage`'s usage/props contract are unchanged.
- Verified `test`, `typecheck`, `lint`, and `build` all pass.

### 2026-07-11 — Feature 20: Room Detail Navigation

- Added a reusable `Tabs` molecule (`src/components/molecules/Tabs/`): a WAI-ARIA tablist widget with roving `tabindex` and Left/Right/Home/End keyboard support, panels rendered by the caller.
- `RoomDetailPage` now splits Channels/Videos/Queue into distinct tab panels instead of one long stacked scroll; the room header (name, description, channel-count badge, edit/delete) stays visible above the tabs regardless of active section.
- Active section is tracked via a `?section=` query param (`channels`/`videos`/`queue`, defaulting to `videos`) for deep-linking; switching sections moves focus to the new panel, following `AppShell`'s existing route-change focus-management precedent.
- `ChannelAssignmentList`, `VideoFeed`, and `WatchQueuePanel` are unchanged — page-level layout change only.
- Verified `typecheck`, `lint`, `test` (44 files, 252 tests), and `build` all pass, plus a manual headless-browser walkthrough (create room → switch tabs by click and by keyboard → deep link to `?section=queue`), zero console errors.

### 2026-07-11 — Feature 19: Room/Channel Assignment

- Added `src/utils/roomStorage.ts` (`localStorage`-backed load/save of `Room[]`, tolerant of missing/malformed data) and `src/hooks/useRooms.ts` (create/update/delete a room, assign/unassign channels, persisting every mutation), closing the prerequisite gap identified while scoping feature 18-4.
- Added `RoomFormDialog` (molecule, native `<dialog>`-based create/edit form for name/description) and `ChannelAssignmentList` (organism, checkbox list of the user's synced channels from `useYoutubeSyncContext()`, with its own empty state when nothing is synced yet).
- `DashboardPage` now creates rooms via `useRooms()` instead of `mockRooms`; `RoomDetailPage` sources its room, edit/delete controls, channel assignment, and video feed from `useRooms()` + `useYoutubeSyncContext()` instead of `mockRooms`/`mockChannels`/`mockVideos`/`mockQueues`. `RoomGrid`/`RoomCard`/`VideoFeed`/`WatchQueuePanel` are unchanged.
- `mockRooms.ts`/`mockChannels.ts`/`mockVideos.ts`/`mockQueues.ts` demoted to Storybook/dev-fixture data only (no runtime imports) — real sessions start with zero rooms and empty watch queues rather than seeding from mock data, since mock channel ids never match real synced channel ids.
- Verified `typecheck`, `test` (42 files, 239 tests), and `build` all pass.

### 2026-07-11 — Feature 18-4: YouTube Wire Data (narrowed scope) + Feature 18 wrap-up

- Added `YoutubeSyncProvider`/`useYoutubeSyncContext` (`src/hooks/`): lifts the single `useYoutubeSync` instance above the router so connection status and synced channels/videos survive navigating between routes instead of resetting on every mount. `SettingsPage` now reads from this shared context instead of calling the hook directly.
- Added the read-only `/channels` route (`ChannelsPage`): a reverse-chronological feed of every synced channel's recent videos rendered through the existing `VideoFeed`/`VideoCard` components unchanged — proving the real-data pipeline (YouTube → normalization → components) works. Shows a connect prompt when disconnected; keeps showing previously synced videos alongside a calm error banner if a later re-sync fails, rather than discarding them (a real bug caught while writing tests). Made `VideoFeed.onAddToQueue` optional so a read-only feed can omit the queue action.
- **Scope change discovered before implementation**: the original plan for 18-4 — "wire real data into dashboard/room-detail/queue" — turned out to depend on a room-channel assignment UI that doesn't exist (`mockRooms.ts`'s `channelIds` are hardcoded mock IDs with no way to assign real synced channels). Narrowed 18-4 to prove the data pipeline via `/channels` instead; the dashboard, room detail, and watch queue intentionally remain on mock data. The missing prerequisite is now its own spec: `context/features/19-room-channel-assignment.md`.
- Verified `typecheck`, `lint`, `test` (36 files, 201 tests) all pass, plus a manual headless-browser walkthrough (home → Channels → connect prompt → Settings → back to Channels → home), zero console errors.
- Landed via PR #27.
- **Feature 18 (YouTube API Integration) is now complete across its four planned sub-branches** (18-1 auth, 18-2 fetch/normalize, 18-3 settings UI, 18-4 wire data): read-only OAuth sign-in, subscriptions/uploads/videos fetch with normalization, a settings surface with calm error handling, and a proven real-data render path. The original spec's acceptance criterion of assigning real channels to rooms was not met as scoped — that work continues under feature 19.

### 2026-07-11 — Feature 18-3: YouTube Settings UI

- Added `useYoutubeSync` (`src/hooks/`): a `disconnected`/`connecting`/`connected`/`syncing`/`error` status machine wrapping `youtubeAuth`/`youtubeApi` — `connect()` requests account access then runs an initial sync, `sync()` re-fetches subscribed channels and each channel's recent uploads, `disconnect()` revokes access and clears synced data. Normalizes both `YoutubeAuthError` and `YoutubeApiError` into one typed `YoutubeSyncError` shape so the UI shows a single calm, specific message regardless of failure source.
- Added the `/settings` route (`SettingsPage`): connection status via `Badge`, last-synced timestamp, synced channel/video counts, connect/sync/disconnect actions via `Button`, errors announced through `role="alert"`. Wired into `App.tsx` with a "Settings" nav link added to `AppShell`.
- Third sub-branch of feature 18 (YouTube API integration); no wiring into the dashboard/room-detail/queue yet (deferred to 18-4). Manual sync only, no polling.
- Unit tests for the hook (11 cases, mocking `youtubeAuth`/`youtubeApi`) and the page (4 cases, mocking the hook) — no live network calls.
- Verified `typecheck`, `lint`, `test` (34 files, 192 tests) all pass, plus a manual headless-browser walkthrough (nav link → `/settings` → connect → calm "not configured" error surfaced via the alert region, zero console errors).
- Landed via PR #26.

### 2026-07-10 — Feature 17: YouTube API Exploration Spike

- Time-boxed research spike validating the planned YouTube Data API v3 sync strategy (OAuth read-only scope → `subscriptions.list` → `channels.list` → `playlistItems.list`) against the real API, exercised via a throwaway, non-merged, gitignored script (`scratch/youtube-api-spike/`).
- Confirmed real quota costs: 1 unit each for `subscriptions.list`/`channels.list` (batchable up to 50 ids), 1 unit per channel for `playlistItems.list` (not batchable — the real quota cost driver, scaling linearly with subscription count).
- Identified two type gaps for feature 18: `SubscriptionChannel.topicTags` has no API source and must stay user/local-only (neither endpoint returns display-ready topic tags); `VideoSummary.duration` isn't present in `playlistItems.list` responses at all and requires an additional batched `videos.list` call not in the original plan.
- Confirmed PKCE loopback OAuth (not deprecated OOB) works cleanly for a Desktop-app OAuth client; OAuth consent screen branding fields are unnecessary in Testing mode.
- Deferred autoplay/embed IFrame Player validation to feature 18 as low-risk, well-documented browser behavior — not exercised in this spike.
- Full findings recorded in `context/features/17-youtube-api-exploration-spike.md`. No production code, secrets, or `src/` changes.
- Verified `typecheck` and `test` (157 tests) pass with no accidental changes to tracked source.
- Landed via PR #22.

### 2026-07-11 — Feature 16: CI/CD And Vercel Preview Polish

- Confirmed the Vercel project is connected to the repo with zero-config Vite detection (no `vercel.json` needed), automatic PR preview deployments, and automatic production redeploys on merge to `main` — verified via passing Vercel checks on PR #20 and the live production deployment.
- Added a README "Deployment & CI/CD" section: production URL (`https://youtube-rooms.vercel.app`), how GitHub Actions CI (feature 01) stays the correctness gate while Vercel deployments are additive, one-time Vercel connection steps (kept for reference), manual branch-protection guidance (require CI to pass before merge, configured in GitHub Settings), and Vite's `VITE_`-prefixed env var handling ahead of Build Phase 5's YouTube API keys.
- Verified `typecheck`, `lint`, `test` (157 tests), and `build` all pass.
- Landed via PR #20.

### 2026-07-10 — Feature 15: Accessibility And Responsive QA Pass

- Cross-cutting accessibility/responsive audit over features 01-14: keyboard navigation, focus visibility/order, color contrast, semantic structure, `prefers-reduced-motion` handling, touch target sizing, and a responsive sweep at 375/768/1280px viewports.
- Found and fixed two real defects: client-side route changes lost keyboard focus (`AppShell` now moves focus to `<main>` on navigation), and `VideoCard` action buttons were undersized for touch (`Button`'s `sm` size bumped to a 44px minimum target).
- Contrast, reduced-motion handling, semantic structure, and responsive layout were audited and found already compliant — no changes needed there.
- Findings and fix rationale recorded in `context/features/15-accessibility-responsive-qa.md`.
- Verified `typecheck`, `lint`, `test` (157 tests), `build`, and `build-storybook` all pass.

### 2026-07-10 — Feature 14: Watch Queue UI

- `RoomDetailPage` now owns local `WatchQueue` state, seeded from `mockQueues` for the current room (or an empty queue otherwise), and wires each `VideoCard`'s "Add to queue" action to real queue state — replacing the feature-13 console-logged placeholder.
- Added `addToQueue`, `removeFromQueue`, and `setActiveVideo` (`src/utils/watchQueue.ts`): small, unit-tested pure functions handling add-with-de-duplication, remove (clearing `activeVideoId` if the removed video was active), and marking a video active.
- Extended the `VideoCard` molecule with optional `onRemoveFromQueue`, `onSetActive`, and `isActive` props so the same card renders both a feed row ("Add to queue") and a queue row ("Remove" and "Set as active"/"Now playing") without duplicating card markup; the active indicator pairs a "Now playing" `Badge` with a disabled, relabeled button so it isn't color-only.
- Added the `WatchQueuePanel` organism (`src/components/organisms/WatchQueuePanel/`): renders the queue as an ordered list of `VideoCard`s, or an `EmptyState` guiding the viewer back to the video feed when empty.
- Added Storybook stories (empty, several items, active item, remove/set-active interactions) and RTL/unit tests covering add-de-duplication, remove, set-active, and the empty-queue state.
- Verified `typecheck`, `lint`, `test` (157 tests), `build`, and `build-storybook` all pass, plus a manual Playwright pass against the running dev server confirming add-with-dedup, remove, and set-active behave correctly in the browser with no console errors.
- Landed via PR #18.

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
