# Feature Spec: Room Detail Navigation

## Status

Not Started

## Overview

Reorganize `RoomDetailPage` from one long stacked scroll (header, channel checkboxes, video feed, queue, all in a single column) into clearly separated sections a user can jump between, without changing what data or components live on the page.

## Problem

Feature 19 added channel assignment and the queue panel directly onto `RoomDetailPage`, stacking them under the existing video feed. With a room that has several channels and a growing feed, the page is now long: assigning channels, browsing the feed, and checking the queue all compete for the same scroll, and there's no way to jump straight to one of them. This was raised directly: "navigating the room is difficult."

## Goal

A user landing on a room can immediately see and move between its three concerns — Channels, Videos, Queue — without scrolling through unrelated content to find the one they want.

## Requirements

* Split `RoomDetailPage`'s body into distinct sections for channel assignment, video feed, and queue, reachable without scrolling past the others (e.g. tabs, or in-page anchor navigation with a sticky sub-nav).
* Keep the room header (name, description, channel count badge, edit/delete actions) visible/reachable regardless of which section is active.
* Preserve deep-linkability where reasonable (e.g. a URL fragment or query param for the active section) so a link to "this room's queue" is shareable.
* No change to `ChannelAssignmentList`, `VideoFeed`, or `WatchQueuePanel`'s own props/behavior — this is a page-level layout change, not a component rewrite.
* Mobile-first: section switching must work as a single-column flow (e.g. a horizontally scrollable tab bar), not a desktop-only pattern.

## Out Of Scope

* Any change to channel-selection UX itself (see feature 21).
* Moving the queue to its own route/page or adding playback (see feature 22).
* Changes to `DashboardPage` or `RoomGrid`.

## UX Notes

* Keyboard accessible tab/section switching (arrow-key or standard tab semantics per WAI-ARIA Tabs pattern if tabs are used), with visible focus states.
* Preserve the existing focus-management precedent in `AppShell` (focus moves to new content on navigation) when switching sections.
* Calm, consistent with existing empty states — no new copy needed if a section is empty, just don't hide the section switcher itself.

## Technical Notes

Likely files:

* `src/app/routes/RoomDetailPage.tsx` — restructure the render, likely introducing a small local tab-state or reading it from a query param via `useSearchParams`.
* `src/app/routes/RoomDetailPage.css` — new section/tab-nav styles.
* Possibly a new reusable `Tabs` atom/molecule if this pattern is likely to recur elsewhere (evaluate against existing atoms first; don't add an abstraction for a single use site).

## Acceptance Criteria

* From a room's page, a user can switch between Channels / Videos / Queue without scrolling past the other two.
* The room header remains visible or one interaction away regardless of active section.
* Existing `RoomDetailPage` tests updated to reflect the new structure; no regression in channel assignment, feed, or queue behavior.
* `npm run build` passes.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manual QA: navigate a room with several assigned channels and queued videos, confirm each section is reachable and content matches feature 19's existing behavior.
* Keyboard-only walkthrough of section switching.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/features/19-room-channel-assignment.md`
* `context/coding-standards.md`

## Suggested Branch

`feature/20-room-detail-navigation`

## Suggested Commit

`feat: reorganize room detail page into channels/videos/queue sections`
