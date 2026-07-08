# Feature Spec: Button Primitive

## Status

Not Started

## Overview

Build the first real reusable component: a token-driven `Button` atom that supports the variants, sizes, and states the rest of the app will need (primary actions, secondary actions, icon-only actions, disabled/loading states).

## Problem

There is no reusable interactive primitive yet. Without a shared `Button`, later components (RoomCard actions, queue controls, settings forms) would each invent their own button markup and styling, breaking design-system consistency and accessibility guarantees.

## Goal

A developer can drop a `<Button>` into any surface and get consistent, accessible, token-driven styling and behavior, including keyboard and screen-reader support, without writing new CSS.

## Requirements

* Implement `Button` as a real `<button>` element (or `<a>` when explicitly used as a link-styled action, via an `as`/`href` prop) per accessibility standards.
* Support variants: `primary`, `secondary`, `ghost` (naming can be refined during implementation, but must map to real visual intent, not arbitrary names).
* Support sizes: at least `sm` and `md`.
* Support `disabled` state with correct `aria-disabled`/`disabled` semantics and non-interactive styling.
* Support a `loading` state that communicates busy status accessibly (e.g., `aria-busy`, visually distinct spinner/label) without removing the accessible name.
* Support an optional icon slot (leading and/or trailing) without breaking accessible naming when icon-only.
* Ensure visible focus states meet contrast expectations and are not hover-only.
* Ensure touch target sizing is practical on mobile (~44px where feasible for the default size).

## Out Of Scope

* Icon system/library selection — assume icons are passed as children or simple SVG props; no icon library is introduced here.
* Complex compound patterns like split buttons or button groups.
* Any component that consumes `Button` (RoomCard, queue controls, etc.) — those are separate features.

## UX Notes

* Mobile-first sizing; ensure default size is comfortably tappable.
* Motion should be subtle — a quick token-driven transition on hover/active/focus, respecting `prefers-reduced-motion`.
* Disabled buttons must be visually distinct but not so low-contrast that they become invisible.
* Loading state should not shift layout (avoid content jump when a spinner appears).

## Technical Notes

Likely files:

* `src/components/atoms/Button/Button.tsx`
* `src/components/atoms/Button/Button.css`
* `src/components/atoms/Button/Button.stories.tsx`
* `src/components/atoms/Button/Button.test.tsx`
* `src/components/atoms/Button/index.ts`

Implementation notes:

* Props should be explicit and typed: `variant`, `size`, `disabled`, `loading`, `iconLeft`, `iconRight`, `children`, standard button HTML attributes via prop spreading.
* Style using `--sr-*` tokens only; no hardcoded colors, spacing, or radii.
* Follow atoms-level component conventions from `context/coding-standards.md`.

## Acceptance Criteria

* `Button` renders as a real, keyboard-operable `button` element by default.
* All variants and sizes are visually distinct and token-driven.
* Disabled and loading states behave correctly for mouse, keyboard, and assistive tech (verified via RTL role/name/state queries).
* Storybook includes stories for: default, all variants, both sizes, disabled, loading, with leading icon, with trailing icon, icon-only.
* Tests cover: accessible role/name, click handler firing, disabled prevents interaction, loading sets `aria-busy` and suppresses click.
* `npm run build` and `npm run build-storybook` pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* In Storybook, tab through each Button story with keyboard only and confirm visible focus and correct activation via Enter/Space.
* Resize Storybook viewport to mobile and confirm touch target sizing looks reasonable.
* `npm run test` — confirm Button tests pass.
* `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/coding-standards.md` (React, Accessibility, Component Driven Development)
* `context/features/02-design-token-foundation.md`
* `context/features/03-storybook-foundations.md`

## Suggested Branch

`feature/04-button-primitive`

## Suggested Commit

`feat: add button primitive component`
