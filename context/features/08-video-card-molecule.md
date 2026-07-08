# Feature Spec: VideoCard Molecule

## Status

Not Started

## Overview

Build the `VideoCard` molecule representing a single `VideoSummary` — thumbnail, title, channel context, published date, duration, and watched status — used in the room detail feed and watch queue.

## Problem

There is no reusable way to display a video from the `VideoSummary` data model. Both the room detail feed (feature 13) and the watch queue (feature 14) need a consistent, accessible way to present a video and its key metadata.

## Goal

A user can scan a list of videos and quickly understand title, source channel, recency, duration, and whether they've already watched it, and can act on a video (open/queue) via clear controls.

## Requirements

* Accept a `VideoSummary`-shaped prop plus channel context needed for display (channel title; may be resolved by a parent rather than embedded).
* Render thumbnail (with graceful fallback if `thumbnailUrl` is missing), title, channel name, relative/human-readable published date, and duration.
* Render a "watched" indicator via `Badge` when `watched` is true.
* Support an action affordance (e.g., "Add to queue" or "Play") using `Button`, exposed via a callback prop — the component does not own queue logic.
* Handle missing/optional fields gracefully: no thumbnail, no duration, no description.
* Ensure the thumbnail image has appropriate alt text (e.g., derived from title) or is marked decorative if title is rendered as adjacent text.

## Out Of Scope

* Actual video playback (embedding the YouTube player) — that's part of Build Phase 5/6, not this molecule.
* The feed/list layout that arranges multiple `VideoCard`s — covered by feature 13 (Room Detail Layout) and feature 14 (Watch Queue UI).
* Real thumbnail/video data — mock data only, from feature 11.

## UX Notes

* Mobile-first: video card should read well in a single-column list before any grid/queue layout is applied.
* Duration and watched-status badges should not obscure the thumbnail or title.
* Action button must have a clear accessible name reflecting the specific video (e.g., "Add [video title] to queue"), not a generic "Add".
* Long titles must truncate or wrap without breaking layout.

## Technical Notes

Likely files:

* `src/components/molecules/VideoCard/VideoCard.tsx`
* `src/components/molecules/VideoCard/VideoCard.css`
* `src/components/molecules/VideoCard/VideoCard.stories.tsx`
* `src/components/molecules/VideoCard/VideoCard.test.tsx`

Implementation notes:

* Compose `Card`, `Badge`, `Button` from prior features.
* Keep `VideoCard` presentational: it receives a video, channel display info, and action callbacks as props.
* Use the `VideoSummary` interface from `context/project-overview.md` as the contract; use local fixture props in stories/tests if feature 11 hasn't landed yet in execution order.
* Format published date and duration with small local utility functions in `src/utils/` if logic is non-trivial (e.g., relative time formatting), with unit tests for those utilities.

## Acceptance Criteria

* `VideoCard` renders thumbnail (or fallback), title, channel name, published date, duration, and watched badge when applicable.
* Missing optional fields (thumbnail, duration, description) do not break layout or produce broken alt text.
* Action button has a specific, correct accessible name per video.
* Storybook includes stories for: typical video, watched video, missing thumbnail, missing duration, long title.
* Tests cover: renders expected metadata, watched badge appears only when `watched` is true, action callback fires with correct video id, accessible name correctness.
* Any new date/duration formatting utility has its own unit tests.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* View all `VideoCard` stories in Storybook at mobile and desktop widths.
* Tab to the action button and confirm activation via keyboard fires the callback.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/project-overview.md` (Core Data Models — `VideoSummary`)
* `context/features/05-badge-primitive.md`
* `context/features/06-card-primitive.md`
* `context/features/04-button-primitive.md`

## Suggested Branch

`feature/08-video-card`

## Suggested Commit

`feat: add videocard molecule`
