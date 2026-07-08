# Example Feature Spec: [Feature Name]

## Status

Not Started

## Overview

Describe the feature in one short paragraph. Explain what is being built, where it fits in the product, and why it matters.

Example:

Build a reusable `[ComponentName]` component or `[FeatureName]` feature that supports `[user goal]` across `[relevant surfaces]`.

## Problem

* What is missing, inconsistent, confusing, slow, inaccessible, or difficult today?
* Why does this problem matter to users or developers?
* Which product surfaces, workflows, or components are affected?

## Goal

Describe the desired outcome in user-facing terms.

Example:

A user can `[complete action]` clearly, efficiently, and accessibly across the expected screen sizes.

## Requirements

* Requirement 1
* Requirement 2
* Requirement 3
* Include relevant states, variants, empty states, loading states, or error states.
* Include responsive behavior if the feature has UI.
* Include accessibility behavior if the feature is interactive.

## Out Of Scope

* Explicitly list what this feature does not include.
* Mention later feature files when appropriate.
* Prevent unrelated refactors, new dependencies, extra polish, or broad architectural changes.

## UX Notes

* Mobile-first behavior.
* Tablet and desktop enhancements.
* Interaction expectations.
* Visual hierarchy expectations.
* Motion or feedback expectations, if relevant.
* Accessibility expectations such as focus states, semantic markup, keyboard support, labels, and contrast.

## Technical Notes

Likely files:

* `src/[path]/[FeatureName].tsx`
* `src/[path]/[FeatureName].css`
* `src/[path]/[FeatureName].stories.tsx`
* `src/[path]/[FeatureName].test.tsx`
* `src/types/[model].ts` if new shared types are needed
* `src/utils/[utility].ts` if reusable logic is needed

Implementation notes:

* Follow the project structure in `context/project-overview.md`.
* Follow coding standards in `context/coding-standards.md`.
* Use the project’s documented styling, testing, accessibility, and architecture conventions.
* Keep the implementation scoped to this feature only.

## Acceptance Criteria

* The feature works end to end within its defined scope.
* The relevant component, route, or surface is reachable.
* Responsive behavior works at mobile, tablet, and desktop widths when UI is involved.
* Interactive behavior is keyboard accessible when applicable.
* Relevant tests are added or updated.
* Relevant Storybook stories are added or updated when the feature includes reusable UI.
* `npm run build` passes.
* Any required docs are updated.
* `CHANGELOG.md` is updated under `## [Unreleased]` when the project uses a changelog.

## Verification

* Manual QA steps.
* Route, Storybook story, or entry point to test.
* Mobile viewport checks.
* Tablet and desktop viewport checks.
* Keyboard navigation checks where relevant.
* Screen reader or semantic HTML checks where relevant.
* Edge cases worth checking.
* Commands to run, such as:

  * `npm run typecheck`
  * `npm run lint`
  * `npm run test`
  * `npm run build`
  * `npm run build-storybook`

## References

* `context/project-overview.md`
* `context/coding-standards.md`
* `context/ai-interaction.md`
* `context/current-feature.md`

Add any mockups, screenshots, prototype links, API docs, or related files here when the feature is real.

## Suggested Branch

`feature/[phase-number]-[feature-slug]`

Example:

`feature/03-example-feature`

## Suggested Commit

Use a short conventional commit-style message enumerated.

Example:

`feat: add example feature`
