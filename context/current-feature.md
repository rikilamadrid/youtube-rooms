# Current Feature: Room Detail Navigation

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

In Progress

## Goals

- Split `RoomDetailPage`'s body into distinct sections for channel assignment, video feed, and queue, reachable without scrolling past the others (e.g. tabs, or in-page anchor navigation with a sticky sub-nav).
- Keep the room header (name, description, channel count badge, edit/delete actions) visible/reachable regardless of which section is active.
- Preserve deep-linkability where reasonable (e.g. a URL fragment or query param for the active section).
- No change to `ChannelAssignmentList`, `VideoFeed`, or `WatchQueuePanel`'s own props/behavior — page-level layout change only.
- Mobile-first: section switching must work as a single-column flow (e.g. horizontally scrollable tab bar).
- Keyboard accessible tab/section switching (WAI-ARIA Tabs pattern if tabs are used), with visible focus states.

## Notes

- Spec: `context/features/20-room-detail-navigation.md`
- Out of scope: channel-selection UX itself (feature 21), moving queue to its own route/adding playback (feature 22), changes to `DashboardPage`/`RoomGrid`.
- Likely files: `src/app/routes/RoomDetailPage.tsx`, `src/app/routes/RoomDetailPage.css`; possibly a new reusable `Tabs` atom/molecule (evaluate against existing atoms first).
- Preserve `AppShell`'s existing focus-management precedent when switching sections.
- Suggested branch: `feature/20-room-detail-navigation`
- Suggested commit: `feat: reorganize room detail page into channels/videos/queue sections`
- Acceptance: build/test/typecheck/lint pass; CHANGELOG updated under `## [Unreleased]`; existing RoomDetailPage tests updated with no regressions.
