# Feature Spec: RoomCard Molecule

## Status

Not Started

## Overview

Build the `RoomCard` molecule — the primary visual unit of the rooms dashboard — composing `Card`, `Badge`, and typography tokens to represent a single `Room` (name, description, channel count, optional icon) as a clickable navigation surface.

## Problem

There is no way yet to visually represent a `Room` from the `Room` data model in `context/project-overview.md`. The rooms dashboard (feature 12) depends on a reusable card that clearly and accessibly represents a room and its metadata.

## Goal

A user can see, at a glance, what a room is called, roughly what it contains (channel count), and can open it via a clear, accessible, clickable card.

## Requirements

* Accept a `Room`-shaped prop (id, name, description, iconName, channelIds) plus an optional resolved channel count/preview if channel data isn't embedded directly.
* Render room name prominently, description as supporting text, and channel count via `Badge`.
* Render as an interactive `Card` (link-style) navigating to the room (actual routing wired in feature 12; this component should accept an `href`/`onClick` prop and remain route-agnostic).
* Support an empty/placeholder state for a room with zero assigned channels (e.g., "No channels yet" badge/copy) — do not assume at least one channel always exists.
* Handle long room names/descriptions gracefully (truncation or wrapping, no broken layout).
* Support an optional icon (from `iconName`) rendered consistently, with a sensible fallback when no icon is provided.

## Out Of Scope

* Actual routing/navigation wiring — covered by feature 12 (Dashboard Shell).
* The room grid/layout that arranges multiple `RoomCard`s — covered by feature 10.
* Editing or creating rooms — that is a later local-state feature (Build Phase 4), not this roadmap slice.

## UX Notes

* Mobile-first: cards should look good stacked in a single column before any grid layout is applied.
* Clear visual hierarchy: room name > description > metadata badge.
* Accessible name for the card link/button should include the room name at minimum (e.g., "Open Coding room", not just "Coding").
* Empty-channel state should feel like guidance, not an error.

## Technical Notes

Likely files:

* `src/components/molecules/RoomCard/RoomCard.tsx`
* `src/components/molecules/RoomCard/RoomCard.css`
* `src/components/molecules/RoomCard/RoomCard.stories.tsx`
* `src/components/molecules/RoomCard/RoomCard.test.tsx`
* `src/types/room.ts` (if `Room` type isn't already defined; may already exist from feature 11 depending on sequencing — coordinate with mock data feature)

Implementation notes:

* Compose `Card`, `Badge` from prior features; do not re-implement surface or label styling locally.
* Keep `RoomCard` presentational — it receives data and callbacks as props, it does not fetch or own room state.
* Use the `Room` interface shape defined in `context/project-overview.md` as the contract, even if real mock data (feature 11) lands after this component; use locally-defined fixture props in stories/tests until then.

## Acceptance Criteria

* `RoomCard` renders name, description, and a channel-count badge from a `Room`-shaped prop.
* Card is keyboard-accessible with a clear accessible name referencing the room.
* Empty-channel state renders distinct, non-broken copy.
* Storybook includes stories for: typical room, empty-channel room, long name/description, room with icon, room without icon.
* Tests cover: renders expected text/roles, accessible name includes room name, keyboard activation triggers navigation callback, empty-channel state renders expected copy.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* View all `RoomCard` stories in Storybook at mobile and desktop widths.
* Tab to a card and activate via keyboard; confirm the navigation callback fires (mock in story/test).
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/project-overview.md` (Core Data Models — `Room`)
* `context/features/05-badge-primitive.md`
* `context/features/06-card-primitive.md`

## Suggested Branch

`feature/07-room-card`

## Suggested Commit

`feat: add roomcard molecule`
