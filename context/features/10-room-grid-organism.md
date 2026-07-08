# Feature Spec: Room Grid Organism

## Status

Not Started

## Overview

Build the `RoomGrid` organism that arranges a collection of `RoomCard`s into a responsive, mobile-first grid, and handles the "no rooms yet" case via `EmptyState`.

## Problem

`RoomCard` (feature 07) represents a single room but has no opinion on layout. The rooms dashboard (feature 12) needs a component that takes a list of rooms and lays them out responsively, including the empty-list case.

## Goal

A user sees all their rooms arranged in a clear, responsive grid that works from a single mobile column up to a multi-column desktop layout, or sees a clear empty state if they have no rooms yet.

## Requirements

* Accept an array of `Room`-shaped data (or already-rendered `RoomCard` props) and render one `RoomCard` per room.
* Render `EmptyState` when the array is empty, with copy appropriate to "no rooms yet" and an optional "create a room" action callback (wired later; local-state room creation is Build Phase 4, out of scope for this feature's actual logic).
* Implement a responsive grid: single column on mobile, progressively more columns at tablet/desktop breakpoints, using CSS (grid or flexbox) and spacing tokens — no Tailwind.
* Preserve a sensible reading/tab order regardless of column count.
* Do not assume a fixed number of rooms; layout must handle 1 room and many rooms (e.g., 12+) gracefully.

## Out Of Scope

* Actual navigation destination logic — `RoomGrid` forwards navigation callbacks/props down to each `RoomCard`; routing itself is wired in feature 12.
* Sorting, filtering, or searching rooms — not specified by any current feature.
* Room creation/editing UI — Build Phase 4.

## UX Notes

* Mobile-first: verify a true single-column layout at narrow widths before wider breakpoints are layered on.
* Grid gap should use spacing tokens, not hardcoded values.
* Empty state should be vertically centered within the grid's container area, not squeezed awkwardly at the top.

## Technical Notes

Likely files:

* `src/components/organisms/RoomGrid/RoomGrid.tsx`
* `src/components/organisms/RoomGrid/RoomGrid.css`
* `src/components/organisms/RoomGrid/RoomGrid.stories.tsx`
* `src/components/organisms/RoomGrid/RoomGrid.test.tsx`

Implementation notes:

* Compose `RoomCard` (feature 07) and `EmptyState` (feature 09); no new card/empty-state logic should be duplicated here.
* Keep `RoomGrid` presentational: it receives rooms and callbacks as props, it does not fetch data.
* Use CSS Grid with `auto-fill`/`minmax` or explicit breakpoints — whichever is simpler to reason about and test visually in Storybook.

## Acceptance Criteria

* `RoomGrid` renders a `RoomCard` per room in the provided array.
* `RoomGrid` renders `EmptyState` when given an empty array.
* Grid visibly reflows from one column (mobile) to multiple columns (desktop) in Storybook's viewport addon.
* Storybook includes stories for: empty grid, single room, few rooms, many rooms (12+).
* Tests cover: renders correct number of `RoomCard`s for given data, renders `EmptyState` when data is empty, does not crash with a single room.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* View "empty," "few rooms," and "many rooms" stories in Storybook across mobile, tablet, and desktop viewport presets.
* Tab through multiple room cards in the grid and confirm a sensible tab order.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/features/07-room-card-molecule.md`
* `context/features/09-empty-state-molecule.md`
* `context/project-overview.md` (UX Principles, Routing)

## Suggested Branch

`feature/10-room-grid`

## Suggested Commit

`feat: add room grid organism`
