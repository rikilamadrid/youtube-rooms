# Feature Spec: Card Primitive

## Status

Not Started

## Overview

Build a generic `Card` atom — a token-driven surface container with consistent padding, radius, border, and shadow — that `RoomCard` and `VideoCard` will compose in later features.

## Problem

Every planned surface (rooms dashboard grid, video feed, queue panel) needs a consistent "raised surface" container. Without a shared `Card`, each molecule would redefine its own surface styling, undermining visual consistency.

## Goal

A developer can compose any content inside a `Card` and get the intended raised-surface look and consistent spacing, optionally as an interactive/clickable surface when needed.

## Requirements

* Implement `Card` as a generic container (`<div>` by default) with token-driven background, border, radius, and shadow.
* Support an "interactive" mode where the whole card acts as a link or button-like surface (rendered as a real `<a>` or `<button>`, not a `div` with a click handler) for cases like a clickable RoomCard.
* Support a padding prop or sensible default padding using spacing tokens.
* Ensure interactive cards have visible focus states and keyboard activation, per `context/coding-standards.md` ("Cards that navigate must be links or contain clearly labeled actions").
* Support composition via `children` — no assumptions about internal content structure.

## Out Of Scope

* `RoomCard` and `VideoCard` themselves — those compose `Card` starting in features 07–08.
* Complex card layouts (media + header + footer slots) — keep this primitive generic; structure is added by consuming molecules.
* Drag-and-drop or reorderable card behavior (relevant later for queue UI, not here).

## UX Notes

* Should read as a soft, elevated surface consistent with the "cinematic media dashboard" tone.
* Interactive cards need an obvious but not garish hover/focus treatment.
* Must work at mobile widths without excessive padding eating into small screens.

## Technical Notes

Likely files:

* `src/components/atoms/Card/Card.tsx`
* `src/components/atoms/Card/Card.css`
* `src/components/atoms/Card/Card.stories.tsx`
* `src/components/atoms/Card/Card.test.tsx`
* `src/components/atoms/Card/index.ts`

Implementation notes:

* Props: `as`/`href`/`onClick` (to determine rendered element), `padding`, `children`, standard HTML attribute passthrough.
* Style with `--sr-*` tokens only (surface color, border, radius, shadow tokens from feature 02).
* Keep the API small; avoid over-configuring variants that no real feature needs yet.

## Acceptance Criteria

* `Card` renders as a static container by default and as an interactive link/button when configured.
* Interactive cards are keyboard-focusable and activatable via Enter/Space (button) or Enter (link), with visible focus states.
* Storybook includes stories for: static card, interactive card as link, interactive card as button, card with varied content lengths.
* Tests cover: static card renders children, interactive card has correct role/element, interactive card responds to keyboard activation.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* In Storybook, tab to interactive card stories and confirm keyboard activation works.
* Resize to mobile width and confirm padding/spacing still looks intentional.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/coding-standards.md` (Accessibility section)
* `context/features/02-design-token-foundation.md`
* `context/features/04-button-primitive.md`

## Suggested Branch

`feature/06-card-primitive`

## Suggested Commit

`feat: add card primitive component`
