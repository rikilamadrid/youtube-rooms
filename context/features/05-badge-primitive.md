# Feature Spec: Badge Primitive

## Status

Not Started

## Overview

Build a small `Badge` atom used to display short status/metadata labels — channel topic tags, room channel counts, "watched"/"new" video indicators — consistently across the app.

## Problem

Several planned surfaces (RoomCard channel counts, VideoCard watched/new status, channel topic tags) need a small labeled pill, and without a shared primitive each surface would invent its own inconsistent styling.

## Goal

A developer can render a consistent, accessible, token-driven label pill for statuses and tags anywhere in the app.

## Requirements

* Implement `Badge` as a `<span>` (non-interactive by default) displaying short text content.
* Support a small set of semantic tones (e.g., `neutral`, `accent`, `success`, `warning`) mapped to token colors — not arbitrary colors.
* Support an optional leading icon/dot indicator (e.g., for "new" or "watched" states).
* Ensure text truncation behavior is defined for long labels (e.g., topic tags) so layouts don't break.
* Ensure color contrast between badge background and text meets accessibility expectations for all tones.

## Out Of Scope

* Interactive/removable badges (e.g., a dismissible filter chip) — not needed by any current feature.
* Badge groups/overflow logic (e.g., "+3 more") — can be considered later if a real surface needs it, not assumed here.
* Any component that consumes `Badge` (RoomCard, VideoCard) — separate features.

## UX Notes

* Should read as a small, calm label, not a loud attention-grabbing chip.
* Must remain legible at small sizes on mobile.
* If used purely decoratively (e.g., a colored dot with no text), ensure it does not convey meaning through color alone — pair with text or an accessible label.

## Technical Notes

Likely files:

* `src/components/atoms/Badge/Badge.tsx`
* `src/components/atoms/Badge/Badge.css`
* `src/components/atoms/Badge/Badge.stories.tsx`
* `src/components/atoms/Badge/Badge.test.tsx`
* `src/components/atoms/Badge/index.ts`

Implementation notes:

* Props: `tone`, `children`, optional `icon`.
* Style with `--sr-*` tokens only.
* Keep the component intentionally minimal per `context/coding-standards.md` ("keep component APIs small and explicit").

## Acceptance Criteria

* `Badge` renders with correct tone-based styling for each supported tone.
* Long text truncates predictably without breaking parent layout.
* Storybook includes stories for each tone, with and without an icon, and a long-text truncation example.
* Tests cover: renders given text/accessible content, applies correct tone class/styling hook, does not rely on color alone for meaning (has text or aria-label when icon-only).
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* View all Badge stories in Storybook at mobile and desktop widths.
* Spot-check color contrast for each tone using devtools or a contrast checker.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/coding-standards.md`
* `context/features/02-design-token-foundation.md`
* `context/features/04-button-primitive.md`

## Suggested Branch

`feature/05-badge-primitive`

## Suggested Commit

`feat: add badge primitive component`
