# Feature Spec: Watch Page & Queue Playback

## Status

Not Started

## Overview

Add a dedicated watch route with an embedded YouTube player that plays a room's queue: pressing play on a queued video actually plays it, and finishing a video auto-advances to the next queued item. Today the queue only tracks an `activeVideoId` — nothing renders or plays video.

## Problem

`WatchQueuePanel`'s "Set as active" control (feature 14/19) marks a video as `queue.activeVideoId`, but no player is ever mounted — there is no way to actually watch a queued video from the app, autoplay or otherwise. This was raised directly: "the queue needs to be access[ed] in a different page so we can press play and it just autoplay[s]. right now I cant play anything."

## Goal

From a room, a user can open its queue as a dedicated watch view, press play on any queued video, and have the app play through the rest of the queue automatically as each video ends.

## Requirements

* A new route (e.g. `/rooms/:roomId/watch`) rendering an embedded YouTube player (YouTube IFrame Player API) alongside the room's queue list.
* Pressing play/selecting a queued item loads and plays that video in the embedded player.
* When the currently playing video ends, automatically advance to and play the next item in `queue.videoIds` (queue order), stopping cleanly when the queue is exhausted.
* The queue list on this page reflects the currently-playing item (reuse or adapt `WatchQueuePanel`'s active-item indication) and still supports remove/reorder-free removal as today.
* Link to this route from `RoomDetailPage`'s queue section (see feature 20) — e.g. a "Watch" action.
* Handle an empty queue with the existing `EmptyState` pattern (no player mounted, guidance back to the video feed).

## Out Of Scope

* Manual reordering (drag-and-drop) of the queue — advancing is queue-order only, no reorder UI in this feature.
* Picture-in-picture, background/audio-only playback, or offline playback.
* Persisting playback position/resume-where-left-off across sessions.
* Cross-room "continue watching" — this is scoped to a single room's queue.

## UX Notes

* Mobile-first: player above the queue list in a single column; no fixed/floating player needed for v1.
* Keyboard accessible queue-item selection; visible focus states carried over from `WatchQueuePanel`.
* Respect `prefers-reduced-motion` for any transition between "now playing" states (per `context/coding-standards.md` and the existing motion-token fallback).
* Autoplay-to-next should be interruptible — selecting a different queued item mid-playback should cancel the pending auto-advance and play the newly selected item instead.

## Technical Notes

Likely files:

* `src/app/routes/RoomWatchPage.tsx` (new route) + corresponding `.css`/`.test.tsx`.
* `src/app/App.tsx` — register the new route.
* A new component wrapping the YouTube IFrame Player API (e.g. `src/components/organisms/VideoPlayer/VideoPlayer.tsx`), isolated so `youtubeVideoId` → embed mapping and `onStateChange`/end-of-video handling stay testable and mockable, consistent with `src/services/` isolation conventions for external YouTube surfaces.
* Reuse `WatchQueuePanel`'s item list/markup where practical rather than duplicating it; extract a shared piece only if the divergence is small.
* `src/utils/watchQueue.ts` — may need a `nextInQueue(queue, currentVideoId)` helper for advance-on-end logic, unit-testable without the player.

## Acceptance Criteria

* From a room's queue, a user can navigate to the watch page and press play on any queued video.
* The selected video plays in an embedded player.
* When a video finishes, the next queued video plays automatically without user interaction.
* An empty queue shows a clear empty state instead of a broken/blank player.
* `npm run build` passes.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manual QA: queue two or more videos, confirm playing the first auto-advances to the second on end, and that selecting a different item mid-playback switches immediately.
* Keyboard-only walkthrough of selecting a queued video to play.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/project-overview.md` (YouTube IFrame Player API / embedded player)
* `context/features/14-watch-queue-ui.md`
* `context/features/19-room-channel-assignment.md`
* `context/features/20-room-detail-navigation.md`

## Suggested Branch

`feature/22-watch-page-playback`

## Suggested Commit

`feat: add watch page with embedded player and queue autoplay`
