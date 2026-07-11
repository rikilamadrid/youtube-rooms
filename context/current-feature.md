# Current Feature: Room/Channel Assignment

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

In Progress

## Goals

- Let a user create a room (name, optional description) and edit/delete an existing room.
- Let a user assign/unassign synced YouTube channels to a room, sourced from `useYoutubeSyncContext()`'s `channels` list — not `mockChannels.ts`.
- Persist room definitions and channel assignments locally (`localStorage` or equivalent), surviving reloads — no backend.
- Keep `DashboardPage`/`RoomDetailPage`/`RoomGrid`/`RoomCard`/`VideoFeed`/`WatchQueuePanel` working unchanged against the same `Room`/`SubscriptionChannel`/`VideoSummary` shapes.
- Handle zero-rooms and zero-channels-assigned states with the existing `EmptyState` patterns.
- Decide and document how this interacts with `mockRooms.ts`/`mockChannels.ts` (removed, demoted to fallback/dev-only/Storybook fixtures, or kept as seed data for a fresh session).

## Notes

- Discovered as a missing prerequisite while scoping feature 18-4 (YouTube wire data): `Room.channelIds` are hardcoded mock IDs (`'channel-fireship'`, etc.) with no UI to assign real synced channels, and no way to create/edit a room at all today.
- Depends on `useYoutubeSyncContext()` (feature 18-4) for the real `channels` list to assign from.
- Out of scope: backend/server persistence, multi-account or multi-device sync of room definitions, automatic/AI-suggested assignment, any changes to `useYoutubeSync`/`youtubeAuth.ts`/`youtubeApi.ts` beyond consuming their existing exports.
- Mobile-first, keyboard-accessible assignment UI; calm empty states consistent with existing `EmptyState` copy patterns.
- Likely files: `src/hooks/useRooms.ts` (CRUD over locally-persisted `Room[]`), `src/utils/roomStorage.ts` (`localStorage` helpers), extensions to `RoomDetailPage.tsx` (channel-assignment control, e.g. a new `ChannelAssignmentList` molecule/organism), possibly a new route/molecule for room creation.
- Acceptance: a user can create a room and see it on the dashboard; assign/unassign synced channels and see the room detail feed reflect real video data; state survives reload; `npm run build` passes; `CHANGELOG.md` updated.
- Full spec: `context/features/19-room-channel-assignment.md`.
- References: `context/project-overview.md` (YouTube API Strategy — "store user-created room/group assignments locally"), `context/coding-standards.md`, `context/features/18-youtube-api-integration.md`, `context/features/11-mock-data-models-and-fixtures.md`.
