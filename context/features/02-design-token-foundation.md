# Feature Spec: Design Token Foundation

## Status

Not Started

## Overview

Build the CSS variable-based design token system that every future component and page will consume: color, typography, spacing, radius, border, shadow, motion, z-index, and layout width tokens. This gives the app and Storybook a single shared visual source of truth before any real components exist.

## Problem

Right now there are no tokens, so any component work would immediately start hardcoding colors, spacing, and radii — which conflicts with the project's design-system-first goal and would require painful retrofitting later.

## Goal

A developer can style any component using only `--sr-*` CSS variables and get the intended "calm, cinematic media dashboard" look, in both the app and Storybook, without duplicating values.

## Requirements

* Create `src/styles/tokens.css` with token groups: color, typography, spacing, radius, border, shadow, motion, z-index, layout widths — starting from the sketch in `context/project-overview.md`.
* Add a `src/styles/reset.css` (or equivalent) for a minimal, sane CSS reset.
* Add a `src/styles/global.css` that imports tokens + reset and sets base `body`/`html` styles (background, text color, font family) using tokens only.
* Import the token stylesheet in both the app entry (`src/main.tsx` or `src/app`) and Storybook's `.storybook/preview.ts` so both surfaces render identically.
* Add a `prefers-reduced-motion` fallback rule that neutralizes motion tokens for users who request it.
* Document each token group briefly (a short comment block per section is acceptable) so future contributors know the intent, not just the value.

## Out Of Scope

* Any product components (Button, Card, etc.) — those consume tokens starting in feature 04.
* A full typographic scale beyond the sizes already sketched in the project overview.
* Dark/light theme switching — the product is dark-first per the current token sketch; a light theme is not planned in this roadmap.
* Design tooling like Figma token sync.

## UX Notes

* Tokens should read as "modern, calm, slightly cinematic" per `context/project-overview.md` — dark surface background, soft accent, generous rounded corners, soft shadow.
* Mobile-first: no layout-specific tokens should assume desktop-only usage.
* Respect `prefers-reduced-motion` for the motion tokens.

## Technical Notes

Likely files:

* `src/styles/tokens.css`
* `src/styles/reset.css`
* `src/styles/global.css`
* `.storybook/preview.ts` (import global styles)
* `src/app/main.tsx` or equivalent app entry (import global styles)

Implementation notes:

* Use the `--sr-` prefix for every token per `context/coding-standards.md`.
* Keep token names semantic (`--sr-color-accent`) rather than literal (`--sr-color-purple`).
* No component code should be added in this feature — only global stylesheets.
* A small Vitest smoke test can assert that `tokens.css` exists and defines expected variable names if a lightweight parsing approach is easy; otherwise, visual verification in Storybook is sufficient and a test is not required for pure CSS.

## Acceptance Criteria

* `src/styles/tokens.css` defines all token groups listed above.
* Both the app and Storybook visibly use the same background/text/accent colors when run locally.
* `prefers-reduced-motion` is respected somewhere in global styles.
* `npm run build` and `npm run build-storybook` still pass.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Run `npm run dev` and `npm run storybook` side by side; confirm both show the same background/text colors.
* Inspect computed styles in devtools to confirm CSS variables resolve as expected.
* Toggle OS-level "reduce motion" and confirm any transition/animation using motion tokens is neutralized.
* `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/project-overview.md` (Design System section)
* `context/coding-standards.md` (Design Tokens section)
* `context/current-feature.md`

## Suggested Branch

`feature/02-design-tokens`

## Suggested Commit

`feat: add design token foundation with css variables`
