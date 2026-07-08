# Feature Spec: Mock Data Models And Fixtures

## Status

Not Started

## Overview

Formalize the shared TypeScript domain types (`SubscriptionChannel`, `Room`, `VideoSummary`, `WatchQueue`) in `src/types/`, and build realistic, varied typed mock data fixtures in `src/data/` that the dashboard, room detail, and queue features will consume.

## Problem

Component-level features (07–10) have been using local, ad hoc fixture props in their stories/tests. Before building the actual product shell (dashboard, room detail, queue), the app needs one authoritative, shared set of typed mock data so every surface reflects the same rooms, channels, and videos consistently.

## Goal

Any feature or story can import a single, realistic, typed mock dataset (multiple rooms, multiple channels per room, multiple videos per channel, at least one empty room, at least one channel with no recent videos) instead of inventing its own fixtures.

## Requirements

* Define/finalize TypeScript interfaces in `src/types/`: `channel.ts` (`SubscriptionChannel`), `room.ts` (`Room`), `video.ts` (`VideoSummary`), `queue.ts` (`WatchQueue`) matching `context/project-overview.md`'s Core Data Models (evolve fields only if a genuine gap is found; document any deviation).
* Create `src/data/mockChannels.ts`, `src/data/mockRooms.ts`, `src/data/mockVideos.ts`, `src/data/mockQueues.ts` (or a consolidated `src/data/mockData.ts` if simpler) with realistic, varied sample content across at least 4–5 rooms (e.g., Coding, Cooking, Sketching, Gaming, Music) matching the product's stated theme.
* Include edge-case fixtures on purpose: a room with zero channels, a channel with zero recent videos, a video with missing optional fields (no thumbnail, no duration), a queue with no active video.
* Mark all mock records with `isMock: true` where the type supports it (`SubscriptionChannel.isMock`).
* Ensure fixture IDs are stable and consistent across files (a video's `channelId` actually matches a channel in `mockChannels`, a room's `channelIds` actually reference real mock channels, etc.).
* Provide small typed helper accessors if useful (e.g., `getVideosForRoom(roomId)`), each with a unit test, but only if a concrete consumer needs it — do not build speculative query APIs.

## Out Of Scope

* Wiring this mock data into actual pages/routes — that's features 12–14.
* Persistence or local storage — Build Phase 4.
* Any real YouTube API shapes — Build Phase 5+.
* Rewriting existing component stories to use the shared fixtures (nice-to-have, not required scope; can be a fast-follow noted in the PR description).

## UX Notes

Not applicable — this is a data-only feature with no new UI.

## Technical Notes

Likely files:

* `src/types/channel.ts`, `src/types/room.ts`, `src/types/video.ts`, `src/types/queue.ts`
* `src/data/mockChannels.ts`, `src/data/mockRooms.ts`, `src/data/mockVideos.ts`, `src/data/mockQueues.ts`
* `src/utils/` for any small accessor helpers, each with a `*.test.ts`

Implementation notes:

* Follow `context/coding-standards.md`: domain types live in `src/types/`, mock data stays separate from component logic.
* Keep mock content realistic enough to expose real layout issues (varied title lengths, varied channel counts) per coding standards.
* Do not let this data model leak raw YouTube API shapes; it should already look like the normalized internal types described in `context/project-overview.md`.

## Acceptance Criteria

* All four domain interfaces exist in `src/types/` and match (or deliberately, visibly extend) the contracts in `context/project-overview.md`.
* Mock data covers at least 4–5 rooms with cross-referenced, internally consistent IDs.
* Deliberate edge cases exist: empty room, channel with no videos, video with missing optional fields, queue with no active video.
* Any accessor utilities have unit tests.
* `npm run typecheck` passes with strict mode on the new types and data.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manually inspect fixture files for cross-referential consistency (every `channelId` and `roomId` reference resolves).
* Import fixtures in a scratch Storybook story or test to confirm shapes compile cleanly against the types.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/project-overview.md` (Core Data Models)
* `context/coding-standards.md` (Data section)
* `context/features/07-room-card-molecule.md`
* `context/features/08-video-card-molecule.md`

## Suggested Branch

`feature/11-mock-data-fixtures`

## Suggested Commit

`feat: add typed mock data models and fixtures`
