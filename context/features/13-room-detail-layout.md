# Feature Spec: Room Detail Layout

## Status

Not Started

## Overview

Replace the feature-12 placeholder `/rooms/:roomId` page with a real room detail view: room header (name/description), and a latest-videos feed built from `VideoCard`s using mock video data, scoped to that room's channels.

## Problem

Feature 12 proved routing works but shows no real content per room. The core product flow — "open a room, review latest videos" — is not yet demoable without this feature.

## Goal

A user opens a room and sees that room's latest videos across its assigned channels, clearly attributed and sorted by recency, with a sensible empty state if the room has no channels or no recent videos.

## Requirements

* Resolve `roomId` from the route param, look up the room in mock data, and 404/redirect gracefully (or show a "room not found" `EmptyState`-style message) if it doesn't exist.
* Render a room header: name, description, and channel count.
* Resolve the room's `channelIds` to their videos (from `mockVideos`), merge, and sort by `publishedAt` descending.
* Render the resulting list using `VideoCard` (feature 08), including a container/list layout (a simple stacked list or lightweight organism — introduce a small `VideoFeed` organism only if the composition logic is non-trivial enough to warrant its own component and tests).
* Handle three empty cases distinctly: room has no channels assigned, room has channels but no videos, room id does not exist.
* Ensure the "Add to queue" action on each `VideoCard` is wired to a callback, even if the actual queue (feature 14) isn't built yet — a no-op or console-logged handler is acceptable as a placeholder, clearly noted as temporary.

## Out Of Scope

* The actual watch queue panel/UI — feature 14.
* Video playback/embedding — Build Phase 5/6.
* Sorting/filtering controls beyond default recency sort — not specified by any current feature.
* Editing room membership (adding/removing channels) — Build Phase 4.

## UX Notes

* Mobile-first single-column video list; consider a slightly wider layout at desktop widths if it improves scanability, but do not over-engineer a grid here — `VideoCard` already implies a list-like read.
* Distinguish the three empty states with distinct, honest copy (e.g., "This room has no channels yet" vs. "No recent videos from this room's channels").
* Maintain a clear heading hierarchy: page/room title as the primary heading, "Latest videos" as a secondary heading.

## Technical Notes

Likely files:

* `src/app/routes/RoomDetailPage.tsx` (replace feature-12 placeholder)
* `src/app/routes/RoomDetailPage.test.tsx`
* `src/components/organisms/VideoFeed/VideoFeed.tsx` (only if warranted — see note above)
* `src/utils/sortVideosByRecency.ts` (with unit tests) if sorting logic is non-trivial enough to extract

Implementation notes:

* Reuse `mockRooms`, `mockChannels`, `mockVideos` from feature 11; do not introduce parallel fixture data.
* Keep data resolution (room → channels → videos) as a small, testable utility rather than inline JSX logic, per `context/coding-standards.md`'s hook/utility extraction guidance.
* Follow the `Room`/`VideoSummary` contracts exactly; do not add ad hoc fields to make this feature work — extend the shared types in `src/types/` if a real gap is found, and note it in the PR.

## Acceptance Criteria

* Navigating to `/rooms/:roomId` for a real mock room id shows that room's name, description, and a sorted list of its videos.
* An unknown `roomId` shows a clear "room not found" state instead of crashing or showing a blank page.
* A room with no channels shows distinct empty copy from a room with channels but no videos.
* Tests cover: correct room resolves and renders its videos in recency order, unknown room id shows not-found state, room with no channels shows correct empty state, room with channels but no videos shows correct empty state.
* Any extracted sort/resolve utility has unit tests covering ordering and edge cases (empty arrays, single video).
* `npm run build` passes.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manually visit a populated room, an empty-channel room, and a channel-with-no-videos room (all should exist in mock data per feature 11) and confirm distinct correct states.
* Visit an invalid room id URL directly and confirm a graceful not-found state.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/features/08-video-card-molecule.md`
* `context/features/11-mock-data-models-and-fixtures.md`
* `context/features/12-dashboard-shell.md`
* `context/project-overview.md` (Core Flows, Routing)

## Suggested Branch

`feature/13-room-detail-layout`

## Suggested Commit

`feat: add room detail layout with latest videos feed`
