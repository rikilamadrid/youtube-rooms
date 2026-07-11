# Current Feature: Watch Page & Queue Playback (22)

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

In Progress

## Goals

- Embedded YouTube player (YouTube IFrame Player API) inline in `RoomDetailPage`'s Queue tab, above the queue list — no separate watch route/page (revised mid-implementation per user feedback: the queue-tab-then-watch-page jump was redundant).
- Pressing play/selecting a queued item loads and plays that video in the embedded player.
- When the playing video ends, auto-advance to the next item in `queue.videoIds` (queue order); stop cleanly when exhausted.
- Queue list reflects the currently-playing item (reuse/adapt `WatchQueuePanel`'s active-item indication) and still supports removal.
- Custom player controls (play/pause, seek bar with elapsed/total time, next/previous within the queue), revealed on hover/keyboard focus since YouTube's own chrome has no notion of this app's queue.
- Empty queue uses the existing `EmptyState` pattern (no player mounted, guidance back to video feed).
- `VideoCard`'s "Add to queue" disables/relabels once a video is already queued.
- `VideoCard` compact horizontal layout; `ChannelAssignmentList` checkbox rows wrap into a grid instead of one full-width row each.

## Notes

**Spec:** `context/features/22-watch-page-playback.md` (superseded on the routing point — see Goals above; spec originally called for a separate `/rooms/:roomId/watch` route).

**Problem:** `WatchQueuePanel`'s "Set as active" only sets `queue.activeVideoId` — nothing ever mounts a player, so nothing can actually be watched.

**Out of scope:** manual drag-and-drop reordering, picture-in-picture/background/offline playback, persisting playback position across sessions, cross-room "continue watching".

**UX:** mobile-first (player above queue list, single column); keyboard-accessible queue-item selection with visible focus states; respect `prefers-reduced-motion` for now-playing transitions; selecting a different item mid-playback plays the new selection immediately (no separate cancel step needed — advance is driven directly by `activeVideoId`).

**Key files:**

- `src/app/routes/RoomDetailPage.tsx` — mounts `VideoPlayer` inline in the Queue tab; owns advance/prev/next handlers
- `src/components/organisms/VideoPlayer/VideoPlayer.tsx` — wraps YouTube IFrame Player API with custom hover controls, isolated/testable/mockable
- `src/services/youtubePlayer.ts` — IFrame API script loader + player-control method types
- `src/utils/watchQueue.ts` — `nextInQueue`/`prevInQueue`/`emptyQueueForRoom`/`resolveQueueItems` helpers
- `src/components/molecules/VideoCard/VideoCard.tsx`, `src/components/organisms/VideoFeed/VideoFeed.tsx` — `isQueued`/`queuedVideoIds`
- `src/components/organisms/ChannelAssignmentList/ChannelAssignmentList.css` — grid layout fix

**Acceptance criteria:** play any queued video from the Queue tab; auto-advance on end without user interaction; empty state instead of broken/blank player; `npm run build` passes; `CHANGELOG.md` updated under `## [Unreleased]`.

**Verification:** manual QA (2+ queued videos, auto-advance on end, mid-playback switch, custom controls); keyboard-only walkthrough; `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

**References:** `context/project-overview.md`, `context/features/14-watch-queue-ui.md`, `context/features/19-room-channel-assignment.md`, `context/features/20-room-detail-navigation.md`.

**Suggested branch:** `feature/22-watch-page-playback`
**Suggested commit:** `feat: add watch page with embedded player and queue autoplay`
