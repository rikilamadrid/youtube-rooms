# Feature Spec: Room/Channel Assignment

## Status

Not Started

## Overview

Let a user create rooms and assign real synced YouTube channels to them, replacing `mockRooms.ts`'s hardcoded `channelIds` with a user-editable, locally-persisted room/channel model. This is the missing link between feature 18 (real YouTube data) and the existing room dashboard/detail UI, which currently only understands mock room-to-channel mappings.

## Problem

`context/project-overview.md`'s YouTube API Strategy explicitly calls for "store user-created room/group assignments locally," and feature 18's acceptance criteria assumed "real subscribed channels appear and can be assigned to rooms using the existing room/channel UI patterns" — but no such UI pattern exists. `mockRooms.ts` has fixed `channelIds` like `'channel-fireship'`; real YouTube channel IDs (`UCxxxxxxxxxxxxxxxxxxxxxx`-shaped) never match them. Without this feature, real synced channels have no way to reach a room's video feed, and rooms have no way to be created or edited at all — they only exist as hardcoded fixtures today.

Discovered while scoping feature 18-4 (see `context/current-feature.md`): wiring real data into the dashboard turned out to depend on this feature existing first, so it was split out rather than folded into 18-4's diff.

## Goal

A user can create a room, name it, and assign any subset of their synced YouTube channels to it — using the existing `Room`/`SubscriptionChannel` types and existing dashboard/room-detail/queue UI unchanged. Room definitions (and their channel assignments) persist locally (e.g. `localStorage`) across reloads, with no backend.

## Requirements

* A way to create a new room (name, optional description) and edit/delete an existing room.
* A way to assign/unassign synced channels to/from a room, sourced from `useYoutubeSync`'s (or its context's) `channels` list — not `mockChannels.ts`.
* Persist room definitions and channel assignments in `localStorage` (or equivalent local persistence), surviving reloads.
* Existing `DashboardPage`/`RoomDetailPage`/`RoomGrid`/`RoomCard`/`VideoFeed`/`WatchQueuePanel` continue to work against the same `Room`/`SubscriptionChannel`/`VideoSummary` shapes, unchanged.
* Handle the zero-rooms and zero-channels-assigned states with the existing `EmptyState` patterns.
* Decide and document how this interacts with `mockRooms.ts`/`mockChannels.ts`: whether mock data is removed, demoted to a fallback/dev-only/Storybook-only fixture set, or kept as seed data for a fresh (no real connection) session.

## Out Of Scope

* Any backend/server persistence — local storage only, per `context/project-overview.md`.
* Multi-account or multi-device sync of room definitions.
* Automatic/AI-suggested room-channel assignment.
* Changes to `useYoutubeSync`, `youtubeAuth.ts`, or `youtubeApi.ts` beyond consuming their existing exports.

## UX Notes

* Mobile-first: assignment UI must work as a single-column flow, not just as a desktop table/modal.
* Creating/editing a room and assigning channels should be keyboard accessible with clear focus management (see `context/coding-standards.md` and the focus-on-navigate precedent already in `AppShell`).
* Calm empty states: "You have no rooms yet," "This room has no channels assigned yet," etc., consistent with existing `EmptyState` copy patterns in `RoomDetailPage`.

## Technical Notes

Likely files:

* `src/hooks/useRooms.ts` (or similar) — CRUD over locally-persisted `Room[]`, replacing direct `mockRooms` imports in `DashboardPage`/`RoomDetailPage`.
* `src/utils/roomStorage.ts` — `localStorage` read/write helpers, unit-testable in isolation.
* `src/app/routes/RoomDetailPage.tsx` — extend with a channel-assignment control (likely a new molecule/organism, e.g. `ChannelAssignmentList`).
* Possibly a new route/molecule for room creation (`New room` action from `DashboardPage`).
* Corresponding `*.test.ts(x)` and Storybook stories for any new reusable component.

Implementation notes:

* Depends on feature 18's `useYoutubeSync`/`YoutubeSyncProvider` (see feature 18-4) for the real `channels` list to assign from.
* Keep `Room`/`SubscriptionChannel` types unchanged unless a real gap is found; prefer additive changes.
* Follow `context/coding-standards.md` naming, testing, and accessibility conventions throughout.

## Acceptance Criteria

* A user can create a room and see it appear in the dashboard.
* A user can assign/unassign synced channels to a room, and the room detail feed reflects that assignment using real video data.
* Room and assignment state survives a page reload.
* `npm run build` passes.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manual QA: create a room, assign channels, reload the page, confirm state persisted.
* Confirm the zero-rooms and zero-channels-in-room empty states render correctly.
* Keyboard-only walkthrough of room creation and channel assignment.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/project-overview.md` (YouTube API Strategy — "store user-created room/group assignments locally")
* `context/coding-standards.md`
* `context/features/18-youtube-api-integration.md`
* `context/features/11-mock-data-models-and-fixtures.md`
* `context/current-feature.md` (notes on why this was split out of feature 18-4)

## Suggested Branch

`feature/19-room-channel-assignment`

## Suggested Commit

`feat: add local room creation and channel assignment`
