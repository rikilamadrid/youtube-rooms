# Feature Spec: Accessibility And Responsive QA Pass

## Status

Not Started

## Overview

A dedicated, cross-cutting quality pass over everything built in features 01–14: a systematic accessibility audit and responsive/mobile QA sweep across the design-system components and the mock-data product shell, fixing what's found rather than adding new functionality.

## Problem

Individual features have included accessibility and responsive requirements piecemeal, but there has been no holistic pass checking the app and Storybook catalog together, across real assistive-tech and viewport scenarios, before adding local state/persistence (Build Phase 4) or YouTube API integration (Build Phase 5).

## Goal

Every component in the Storybook catalog and every page in the mock-data product shell meets the accessibility and responsive expectations in `context/project-overview.md`, verified deliberately rather than assumed.

## Requirements

* Audit keyboard navigation across the full app: dashboard → room detail → queue, including all interactive components (`Button`, `Card`-as-link, `RoomCard`, `VideoCard` actions, queue controls).
* Audit focus visibility and order across route transitions (dashboard → room detail) and within components with multiple interactive elements (queue rows).
* Audit color contrast for all token-driven color combinations actually in use (text on surface, badges, focus rings, disabled states) against WCAG AA at minimum.
* Audit semantic structure: heading hierarchy per page, landmark usage (header/main/nav), list semantics for room grids and video/queue lists.
* Audit `prefers-reduced-motion` behavior across every component that uses motion tokens.
* Audit touch target sizing on real mobile viewport widths (not just Storybook's simulated viewport) for every interactive element.
* Run a responsive sweep at defined breakpoints (mobile ~375px, tablet ~768px, desktop ~1280px) for the dashboard, room detail, and queue panel, fixing any layout breakage found.
* Record findings and fixes; where a fix is non-trivial or out of scope, document it as a follow-up rather than silently skipping it.

## Out Of Scope

* New features or components — this pass only fixes accessibility/responsive defects in existing work.
* Automated visual regression tooling setup (e.g., Chromatic) — not part of this roadmap.
* Full screen-reader compatibility certification across every OS/browser combination — spot-check with at least one screen reader (e.g., VoiceOver) is sufficient; exhaustive matrix testing is not required.

## UX Notes

* This feature has no new UX to design; it verifies and repairs UX already specified in features 01–14 against `context/project-overview.md`'s Accessibility and UX Principles sections.

## Technical Notes

Likely files:

* Touches many existing component/page files across `src/components/` and `src/app/` as fixes are applied — scope each fix narrowly (per `context/coding-standards.md`: "Do not refactor unrelated areas while implementing a feature").
* May add or extend `*.test.tsx` files with accessibility-focused assertions (roles, names, focus order) where gaps are found.
* Consider adding the Storybook a11y addon if not already configured, to make future regressions easier to catch (a tooling addition, not new product functionality).

## Acceptance Criteria

* A written audit summary exists (in the PR description or a short section appended to this file before merge) listing what was checked and what was fixed.
* No critical keyboard-trap or unreachable-control issues remain across the audited flows.
* Contrast issues found are fixed at the token or component level (not one-off overrides).
* Reduced-motion is respected everywhere motion tokens are used.
* Responsive breakage found during the sweep is fixed at the three defined breakpoints.
* `npm run test`, `npm run build`, `npm run build-storybook` all still pass after fixes.
* `CHANGELOG.md` updated under `## [Unreleased]` summarizing the accessibility/responsive fixes.

## Verification

* Manual keyboard-only walkthrough of dashboard → room detail → queue.
* Manual screen reader spot-check (e.g., VoiceOver) of the same flow.
* Manual contrast check of key token color pairs using devtools or a contrast checker.
* Manual viewport testing at ~375px, ~768px, ~1280px widths in a real browser (not only Storybook's simulated viewport).
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.

## References

* `context/project-overview.md` (Accessibility, UX Principles)
* `context/coding-standards.md` (Accessibility section)
* All prior feature files, 01–14

## Suggested Branch

`feature/15-accessibility-responsive-qa`

## Suggested Commit

`fix: accessibility and responsive qa pass across design system and shell`
