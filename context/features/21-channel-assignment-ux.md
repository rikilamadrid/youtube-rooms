# Feature Spec: Channel Assignment UX

## Status

Not Started

## Overview

Replace `ChannelAssignmentList`'s flat, unfiltered checkbox list with an easier way to find and assign channels — search/filter and a clearer assigned/unassigned split — so assigning channels to a room stays fast as a user's synced channel count grows.

## Problem

`ChannelAssignmentList` (feature 19) renders every synced channel as a single flat `<ul>` of checkboxes, in whatever order `useYoutubeSyncContext()` returns them. With more than a handful of subscriptions this is slow to scan: there's no search, no grouping, and assigned channels aren't visually separated from the rest of the list once it scrolls. This was raised directly: "selecting of channels needs to be done easier."

## Goal

A user with many synced channels can quickly find and assign/unassign the ones they want for a room, without scanning a long undifferentiated list.

## Requirements

* Add a text filter/search over channel title, scoped to the current list (client-side, no new API calls).
* Visually separate or sort assigned channels from unassigned ones (e.g. "Assigned" and "All channels" groups, or assigned-first ordering) so a user can see at a glance what's already in the room.
* Keep the existing checkbox interaction model (assign/unassign is still a toggle) — this is about findability, not a redesign of the assignment mechanic itself.
* Preserve the existing "no synced channels yet" empty state and its `onConnectAccount` action unchanged.
* Filtering with zero matches needs its own small inline empty state (e.g. "No channels match '{query}'") distinct from the "no synced channels at all" case.

## Out Of Scope

* Bulk assign/unassign actions (e.g. "assign all").
* Channel grouping by category/topic (no such data exists yet).
* Changes to `useRooms`, `assignChannel`/`unassignChannel`, or the `Room`/`SubscriptionChannel` types.
* Room-detail page layout/navigation (see feature 20).

## UX Notes

* Filter input needs a visible label (or `aria-label`) and should update the list live (no submit button) with results announced via existing accessible patterns (e.g. a visually-hidden live region stating result count, consistent with `context/coding-standards.md`).
* Mobile-first: filter input and grouped lists must work in a single column at narrow widths.
* Keep checkbox labels and keyboard interaction unchanged from feature 19 — don't regress existing accessibility.

## Technical Notes

Likely files:

* `src/components/organisms/ChannelAssignmentList/ChannelAssignmentList.tsx` — add local filter state and assigned/unassigned grouping.
* `src/components/organisms/ChannelAssignmentList/ChannelAssignmentList.css` — styles for the filter input and groups.
* `ChannelAssignmentList.test.tsx` / `.stories.tsx` — cover filtering, zero-match state, and assigned-first grouping.
* No changes expected to `RoomDetailPage.tsx`'s usage (same props in/out), unless the filter needs to be lifted for some reason — keep it local to the component if possible.

## Acceptance Criteria

* A user can type into a filter and see the channel list narrow to matching titles.
* Assigned channels are visually distinguishable from unassigned ones without needing to check every box.
* Filtering to zero results shows a clear, calm message rather than an empty list.
* `npm run build` passes.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manual QA: sync/mock a longer channel list, filter by partial title match, confirm results and empty-match state.
* Keyboard-only walkthrough of filtering and assigning.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/features/19-room-channel-assignment.md`
* `context/coding-standards.md`

## Suggested Branch

`feature/21-channel-assignment-ux`

## Suggested Commit

`feat: add search and assigned grouping to channel assignment`
