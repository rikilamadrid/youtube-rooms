# Feature Spec: Dashboard Shell

## Status

Not Started

## Overview

Build the first real product page: an app shell (header/nav frame) plus the rooms dashboard route (`/`) that renders `RoomGrid` using the mock room data from feature 11, with real client-side navigation into a room.

## Problem

Up to this point, every component exists only in isolation (Storybook, unit tests). There is no actual running app page that composes them into a real, navigable product surface. This is the first feature where SubRooms starts to feel like an app rather than a component library.

## Goal

A user opens the app and immediately sees their rooms laid out clearly; clicking a room navigates toward that room's detail view (the detail view itself is built in feature 13, but the navigation target must exist and be wired here).

## Requirements

* Introduce client-side routing (React Router, per `context/project-overview.md`'s Routing section) with at least `/` and a placeholder `/rooms/:roomId` route.
* Build a minimal app shell: a header/nav area with the SubRooms name/logo treatment and layout container using design tokens.
* Build the `/` dashboard page composing `RoomGrid` with `mockRooms` (and channel counts derived from `mockChannels`) from feature 11.
* Wire `RoomCard`/`RoomGrid` navigation callbacks to real route transitions to `/rooms/:roomId`.
* Ensure the app shell and dashboard page are mobile-first responsive.
* Handle the "no rooms" case naturally via `RoomGrid`'s existing `EmptyState` support — no special-casing needed at the page level beyond passing real (possibly empty) data.

## Out Of Scope

* Real content for `/rooms/:roomId` — a minimal placeholder page is enough to prove routing works; the real room detail UI is feature 13.
* `/channels` and `/settings` routes — only stub if trivial; full implementation is out of this roadmap's early phases per `context/project-overview.md`.
* Any room creation/editing — Build Phase 4.
* Persisted/local-storage state — Build Phase 4.

## UX Notes

* Mobile-first layout for the shell: nav should collapse sensibly on narrow viewports (a simple header is acceptable; a full hamburger menu is not required unless nav complexity demands it).
* Maintain focus management expectations on route change (e.g., don't strand focus or trap it unexpectedly).
* This is the first surface with real vertical rhythm across header + content; apply spacing tokens consistently.

## Technical Notes

Likely files:

* `src/app/App.tsx` (routing setup)
* `src/app/AppShell.tsx` / `src/app/AppShell.css` (header/nav/layout frame)
* `src/app/routes/DashboardPage.tsx`
* `src/app/routes/RoomDetailPage.tsx` (placeholder only)
* `src/app/routes/RoomDetailPage.test.tsx`, `src/app/routes/DashboardPage.test.tsx`

Implementation notes:

* Add `react-router-dom` as the only new dependency introduced by this feature; do not add state management libraries.
* Keep `DashboardPage` a thin composition layer: pull mock data, pass it to `RoomGrid`, handle navigation via `useNavigate`/`Link`.
* Follow `context/coding-standards.md`: keep app state close to where it's needed; no premature global state.

## Acceptance Criteria

* Running `npm run dev` and opening `/` shows the rooms dashboard populated from mock data.
* Clicking or activating (via keyboard) a room card navigates to `/rooms/:roomId` and shows a placeholder page reflecting the correct room id/name.
* The app shell renders consistently across mobile and desktop widths.
* Tests cover: dashboard renders expected number of rooms from mock data, clicking/activating a room card navigates to the expected route.
* `npm run build` passes with the new routing dependency included.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manually run `npm run dev`, view `/` at mobile and desktop widths, click into a room, confirm the URL and placeholder content update correctly.
* Tab through the dashboard using only the keyboard and confirm a room can be opened without a mouse.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/project-overview.md` (Routing, Core Flows)
* `context/features/10-room-grid-organism.md`
* `context/features/11-mock-data-models-and-fixtures.md`

## Suggested Branch

`feature/12-dashboard-shell`

## Suggested Commit

`feat: add app shell and rooms dashboard page`
