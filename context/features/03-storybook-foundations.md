# Feature Spec: Storybook Foundations Catalog

## Status

Not Started

## Overview

Establish Storybook as the project's first real, deployable visual surface: a documentation landing page plus token-demo stories (color swatches, type scale, spacing scale) that make the design tokens from feature 02 visible and reviewable before any product components exist.

## Problem

Tokens currently exist only as CSS variables with no visual reference. Reviewers (including the project owner, in a portfolio context) have no way to see the design system without opening devtools. Storybook is meant to be the first "public" milestone per `context/project-overview.md`, so it needs real content, not just the default starter story.

## Goal

Anyone opening Storybook sees a welcome/introduction page describing SubRooms' design system, plus browsable token reference pages for color, typography, and spacing — enough to demo the project even before product components exist.

## Requirements

* Remove Storybook's default example stories/components (Button/Header/Page boilerplate) added by the Storybook CLI.
* Add an MDX or CSF "Introduction" / "Welcome" page explaining what SubRooms is and how the design system is organized (atoms/molecules/organisms/templates).
* Add a "Foundations/Color" story rendering swatches for each color token with its variable name and hex value visible.
* Add a "Foundations/Typography" story rendering each font-size token with sample text and its variable name.
* Add a "Foundations/Spacing" story rendering a visual scale for each spacing token.
* Organize Storybook sidebar structure (titles like `Foundations/Color`, `Foundations/Typography`) so it reads as an intentional catalog, not a flat list.
* Ensure all token demo stories import global styles so they render with real token values, not hardcoded approximations.

## Out Of Scope

* Any interactive product components (Button, Card, etc.) — those start in feature 04.
* Accessibility addon configuration beyond what ships by default with Storybook (a dedicated a11y pass happens in feature 15).
* Chromatic or visual regression tooling.
* Deploying Storybook to Vercel (covered conceptually in CI/CD, finalized in feature 16).

## UX Notes

* Token demo pages should be easy to scan at a glance — grid or list layout, not a wall of text.
* Use mobile-first responsive containers so token pages remain legible on Storybook's mobile viewport addon.
* Keep visual noise low; this is a reference tool, not a marketing page.

## Technical Notes

Likely files:

* `.storybook/main.ts` (remove default stories glob entries if needed, confirm `stories` globs point at `src/**/*.stories.@(ts|tsx|mdx)`)
* `src/styles/foundations/Introduction.mdx`
* `src/styles/foundations/Color.stories.tsx`
* `src/styles/foundations/Typography.stories.tsx`
* `src/styles/foundations/Spacing.stories.tsx`

Implementation notes:

* These are documentation stories, not component stories — no new reusable component is required to satisfy this feature, though small internal presentational helpers (e.g., a `Swatch` display block) are fine if kept local to the stories folder.
* Read token values directly from CSS custom properties at render time where practical, so the catalog can't drift from `tokens.css`.
* Follow Storybook file/story naming conventions already used by the CLI scaffold (`*.stories.tsx`).

## Acceptance Criteria

* Storybook sidebar shows an "Introduction" page and a "Foundations" section with Color, Typography, and Spacing stories.
* Default CLI boilerplate stories are removed.
* All token stories render actual values from `tokens.css`, not restated literals.
* `npm run build-storybook` passes.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Run `npm run storybook` and manually browse the Introduction, Color, Typography, and Spacing pages.
* Confirm resizing the Storybook viewport (mobile preset) keeps the token pages legible.
* `npm run typecheck`, `npm run lint`, `npm run build-storybook`.

## References

* `context/project-overview.md` (Design System, Build Phases)
* `context/coding-standards.md` (Storybook section)
* `context/features/02-design-token-foundation.md`

## Suggested Branch

`feature/03-storybook-foundations`

## Suggested Commit

`feat: add storybook foundations catalog for design tokens`
