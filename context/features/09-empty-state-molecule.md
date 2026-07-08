# Feature Spec: EmptyState Molecule

## Status

Not Started

## Overview

Build a reusable `EmptyState` molecule for the recurring "nothing here yet" moments across the app: no rooms created, no channels assigned, no videos in a room feed, empty watch queue.

## Problem

`context/project-overview.md` explicitly calls out that "Empty, loading, and error states are part of the product, not afterthoughts," but there is no shared component for them yet. Without one, each surface (dashboard, room detail, queue) would build its own ad hoc empty message, leading to inconsistent tone and structure.

## Goal

Any surface that can be empty shows a calm, clear, on-brand empty state with an optional action (e.g., "Create your first room"), instead of a blank area or raw text.

## Requirements

* Accept a title, supporting description text, and an optional icon/illustration slot.
* Accept an optional primary action (rendered via `Button`) with a callback prop.
* Render as a centered, low-noise block appropriate for being dropped into a grid, list, or panel area.
* Support at least the following conceptual variants via content, not separate components: no rooms yet, no channels assigned to a room, no videos in a room feed, empty watch queue.
* Ensure the empty state is announced sensibly to assistive tech (appropriate heading level or role so it isn't silently skipped).

## Out Of Scope

* Error states (distinct from empty states) — error handling patterns are noted in `context/coding-standards.md` but a dedicated `ErrorState` component is not required by this roadmap; revisit only if a later feature needs it explicitly.
* Loading/skeleton states — not covered by this component; can be a future addition if a feature spec calls for it.
* Illustration assets — use a simple icon or no image if no asset pipeline exists yet.

## UX Notes

* Should feel encouraging, not like an error — calm copy, clear next step.
* Must work within constrained mobile widths (single column) as well as wider dashboard/grid contexts.
* Action button, if present, should be the only strong visual accent in the empty state.

## Technical Notes

Likely files:

* `src/components/molecules/EmptyState/EmptyState.tsx`
* `src/components/molecules/EmptyState/EmptyState.css`
* `src/components/molecules/EmptyState/EmptyState.stories.tsx`
* `src/components/molecules/EmptyState/EmptyState.test.tsx`

Implementation notes:

* Props: `title`, `description`, optional `icon`, optional `actionLabel` + `onAction`.
* Compose `Button` from feature 04 for the optional action.
* Keep content fully prop-driven; no hardcoded copy for specific surfaces lives inside this component — each consumer (dashboard, room detail, queue) supplies its own copy.

## Acceptance Criteria

* `EmptyState` renders title, description, and optional action consistently.
* Component is usable without an action (informational-only empty state).
* Storybook includes stories for: no rooms, no channels in a room, no videos in a room feed, empty queue, and a no-action variant.
* Tests cover: renders title/description, action button fires callback when present, component renders without crashing when action props are omitted.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* View all `EmptyState` stories in Storybook at mobile and desktop widths.
* Confirm heading structure is sensible when the component is dropped into a page context (no duplicate or skipped heading levels in stories that simulate real placement).
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/project-overview.md` (UX Principles)
* `context/features/04-button-primitive.md`

## Suggested Branch

`feature/09-empty-state`

## Suggested Commit

`feat: add emptystate molecule`
