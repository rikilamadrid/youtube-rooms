# Current Feature: Channel Assignment UX

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

In Progress

## Goals

- Add a client-side text filter/search over channel title in `ChannelAssignmentList` (no new API calls).
- Visually separate/group assigned channels from unassigned ones (e.g. "Assigned" / "All channels", or assigned-first ordering).
- Keep the existing checkbox toggle interaction model unchanged.
- Preserve the existing "no synced channels yet" empty state and `onConnectAccount` action unchanged.
- Add a distinct inline empty state for zero filter matches (e.g. "No channels match '{query}'").
- Filter input has a visible label or `aria-label`, updates live, and announces result count via a visually-hidden live region.
- Mobile-first single-column layout for filter input and grouped lists.
- No regressions to keyboard interaction/accessibility from feature 19.

## Notes

- Spec: `context/features/21-channel-assignment-ux.md`
- Problem: `ChannelAssignmentList` (feature 19) is a flat unfiltered `<ul>` of checkboxes; slow to scan as synced channel count grows.
- Likely files: `src/components/organisms/ChannelAssignmentList/ChannelAssignmentList.tsx`, `.css`, `.test.tsx`, `.stories.tsx`.
- Out of scope: bulk assign/unassign, channel grouping by category, changes to `useRooms`/`assignChannel`/`unassignChannel`/types, `RoomDetailPage.tsx` layout changes (keep filter state local if possible).
- Reference: `context/features/19-room-channel-assignment.md`, `context/coding-standards.md`.
- Suggested branch: `feature/21-channel-assignment-ux`
- Suggested commit: `feat: add search and assigned grouping to channel assignment`
- Acceptance: filter narrows list live, assigned channels visually distinguishable, zero-match empty state, `npm run build` passes, `CHANGELOG.md` updated under `## [Unreleased]`.
