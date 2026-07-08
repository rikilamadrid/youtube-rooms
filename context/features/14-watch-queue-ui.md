# Feature Spec: Watch Queue UI

## Status

Not Started

## Overview

Build the watch queue panel for a room: a UI backed by the `WatchQueue` model that lets a user add videos from the room detail feed (feature 13), see the queue order, remove items, and mark an active video — all against in-memory/mock state, no persistence yet.

## Problem

The core product flow "review latest videos → start a queue" is incomplete: `VideoCard`'s "Add to queue" action currently has only a placeholder handler (feature 13). There is no visible queue panel, no way to see what's queued, and no way to manage it.

## Goal

A user reviewing a room's videos can add videos to that room's queue, see the queue as an ordered list, remove items, and designate an active video — entirely within the room detail experience.

## Requirements

* Introduce local component state (React state, per `context/coding-standards.md`'s "avoid premature global state") representing the current room's `WatchQueue`, seeded from `mockQueues` if a queue exists for the room, or an empty queue otherwise.
* Wire the room detail feed's "Add to queue" action (feature 13 placeholder) to actually append the video's id to the queue state, avoiding duplicate entries.
* Render the queue as an ordered list of `VideoCard`s (or a compact queue-specific row variant if `VideoCard` proves too heavy for a dense list — reuse `VideoCard` unless a concrete layout problem justifies a variant).
* Support removing a video from the queue via an accessible control (e.g., a "Remove from queue" button per row).
* Support marking one queued video as the `activeVideoId` (e.g., a "Play"/"Set as current" action), with a visible indicator of which item is active.
* Render `EmptyState` when the queue has no items, with copy guiding the user back to the video feed.
* Keep queue state scoped to the room detail page for now; no cross-route/global persistence is required.

## Out Of Scope

* Actual video playback of the active video — Build Phase 5/6.
* Reordering via drag-and-drop — a simple ordered list reflecting insertion order is sufficient; manual reordering controls (move up/down) may be included only if trivial, otherwise defer.
* Persisting the queue across page reloads/sessions — Build Phase 4 (local state and persistence).
* Multiple simultaneous queues across rooms visible at once — one room's queue at a time, matching the `WatchQueue.roomId` model.

## UX Notes

* Mobile-first: the queue panel should be usable as a stacked section below or beside the video feed depending on viewport width; do not require a desktop-only layout to use it.
* Clearly distinguish "browse videos" from "your queue" visually (e.g., section heading, subtle container distinction) so the two lists aren't confused.
* Removing an item should not require confirmation for a simple queue action, but should give some lightweight feedback (e.g., item disappears immediately, no jarring layout jump if avoidable).
* The active video indicator must not rely on color alone (pair with text/icon + accessible label).

## Technical Notes

Likely files:

* `src/app/routes/RoomDetailPage.tsx` (extend with queue state and panel composition)
* `src/components/organisms/WatchQueuePanel/WatchQueuePanel.tsx`
* `src/components/organisms/WatchQueuePanel/WatchQueuePanel.css`
* `src/components/organisms/WatchQueuePanel/WatchQueuePanel.stories.tsx`
* `src/components/organisms/WatchQueuePanel/WatchQueuePanel.test.tsx`
* `src/hooks/useWatchQueue.ts` (only if queue add/remove/set-active logic is complex enough to warrant extraction into a testable hook)

Implementation notes:

* Follow the `WatchQueue` interface from `context/project-overview.md` exactly (`id`, `roomId`, `videoIds`, `activeVideoId`).
* Keep queue mutation logic (add/remove/set-active, de-duplication) in a small, unit-testable function or hook rather than inline in JSX handlers.
* Reuse `VideoCard`, `Button`, `EmptyState` from prior features; avoid duplicating card/empty-state markup.

## Acceptance Criteria

* Adding a video from the feed appends it to the queue exactly once, even if "Add to queue" is triggered multiple times for the same video.
* The queue panel renders queued videos in order, with working remove and set-active controls.
* The active video is indicated accessibly (not color-only).
* An empty queue shows `EmptyState` with guidance copy.
* Storybook includes stories for: empty queue, queue with several items, queue with an active item set.
* Tests cover: add-to-queue de-duplicates, remove-from-queue updates the list, set-active updates `activeVideoId` and the visible indicator, empty queue renders `EmptyState`.
* Any extracted queue-logic hook/utility has direct unit tests independent of the UI.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manually add several videos to a room's queue, remove one, set another as active, and confirm the UI reflects each change correctly.
* Attempt to add the same video twice and confirm no duplicate entry appears.
* Verify keyboard-only operation of add/remove/set-active controls.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/project-overview.md` (Core Data Models — `WatchQueue`, Core Flows)
* `context/features/08-video-card-molecule.md`
* `context/features/09-empty-state-molecule.md`
* `context/features/13-room-detail-layout.md`

## Suggested Branch

`feature/14-watch-queue-ui`

## Suggested Commit

`feat: add watch queue ui to room detail`
