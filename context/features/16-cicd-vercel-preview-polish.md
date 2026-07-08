# Feature Spec: CI/CD And Vercel Preview Polish

## Status

Not Started

## Overview

Harden the CI pipeline introduced in feature 01 and connect real Vercel deployments for both the app and Storybook, so pull requests produce live preview links and `main` stays continuously deployed — closing out the "portfolio-worthy, demoable" goal from `context/project-overview.md` before YouTube API work begins.

## Problem

CI from feature 01 covers install/typecheck/lint/test/build/build-storybook, but there is no confirmed live deployment target yet. A portfolio project benefits significantly from a shareable, always-current preview URL, and PR previews make review meaningfully easier for the remaining features.

## Goal

Every pull request automatically gets a working preview deployment (app and/or Storybook), and `main` stays deployed to a stable production URL, without manual redeploy steps.

## Requirements

* Connect the repository to a Vercel project (app) and, if Vercel's static-site handling makes it straightforward, a second target or path for the Storybook build — otherwise document the chosen approach (e.g., Storybook served from a subpath or a separate Vercel project) and its rationale.
* Confirm Vercel's build command matches `npm run build` (and, if applicable, a combined build step that also runs `npm run build-storybook`).
* Ensure GitHub Actions CI (feature 01) remains the source of truth for correctness gating (typecheck/lint/test/build) — Vercel preview deployment should not replace CI checks, only add a visual preview.
* Add branch protection guidance/documentation (not necessarily enforced via automation) noting that PRs should have passing CI before merge.
* Update `README.md` with the live production URL(s) and a short "how CI/CD works" note.
* Confirm environment variable handling is documented for Vite (`VITE_`-prefixed vars) even though no real secrets are needed yet (no YouTube API keys until Build Phase 5).

## Out Of Scope

* Any YouTube API environment variables or secrets — Build Phase 5 (features 17–18).
* Custom domains, analytics, or monitoring integrations — not specified by the project overview.
* Automated branch protection rule enforcement via API/script, if the user prefers to configure it manually in GitHub's UI (confirm preference before scripting repository settings changes, since that affects a shared/hosted system).

## UX Notes

Not applicable — this is an infrastructure/tooling feature with no new product UI.

## Technical Notes

Likely files:

* `vercel.json` (if custom build/output configuration is needed)
* `.github/workflows/ci.yml` (minor adjustments only if something is discovered to be missing, not a rewrite)
* `README.md` (deployment section)
* `CHANGELOG.md`

Implementation notes:

* Treat connecting the Vercel account/project as a step requiring the user's direct action/approval — Claude/Codex should prepare configuration and instructions but should not assume it can authenticate to an external third-party service on the user's behalf.
* Prefer minimal `vercel.json` configuration; rely on Vercel's zero-config Vite detection unless something genuinely requires overriding it.

## Acceptance Criteria

* A production Vercel deployment exists and serves the current `main` branch build.
* Opening a pull request produces a Vercel preview URL visible in the PR checks/comments.
* GitHub Actions CI still runs and gates typecheck/lint/test/build/build-storybook independently of the Vercel preview.
* `README.md` documents the live URL(s) and the CI/CD flow briefly.
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Open a throwaway test PR (or use the next real feature PR) and confirm a Vercel preview link appears.
* Confirm the production URL loads the current dashboard/room-detail/queue flow from features 12–14.
* Confirm GitHub Actions still fails the build if a deliberate typecheck error is introduced temporarily, then reverted.
* `npm run build`, `npm run build-storybook` locally as a final sanity check.

## References

* `context/project-overview.md` (CI/CD section, Build Phases)
* `context/features/01-project-foundation.md`

## Suggested Branch

`feature/16-cicd-vercel-polish`

## Suggested Commit

`chore: connect vercel previews and document cicd flow`
