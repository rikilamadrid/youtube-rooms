# Feature Spec: YouTube API Exploration Spike

## Status

Not Started

## Overview

A time-boxed, isolated research spike to validate the intended YouTube Data API integration approach (read-only OAuth, subscriptions read, uploads-playlist-based recent video fetching) against real API behavior, quota costs, and response shapes — before writing any production integration code.

## Problem

`context/project-overview.md` prescribes a specific low-quota-cost strategy (uploads playlist items instead of `search.list`) but this has not been validated against the real API for this project. Committing to the full integration (feature 18) without first confirming auth flow, quota costs, and response shapes risks discovering blocking issues mid-implementation.

## Goal

Confidence that the planned integration approach (OAuth read-only scope → list subscriptions → resolve uploads playlist IDs → fetch recent playlist items → normalize) actually works as expected, with concrete notes on quota cost, response shapes, and gotchas, before feature 18 begins.

## Requirements

* Set up a YouTube Data API v3 project/credentials for local development only (documented in a non-committed `.env.local`, never committed to the repo).
* Manually or via a small throwaway script (not part of the production `src/services/` code) exercise: OAuth consent for a read-only scope, `subscriptions.list`, `channels.list` (to resolve uploads playlist id), `playlistItems.list` for a couple of real subscribed channels.
* Record actual quota cost per call type and estimate a realistic per-sync cost for a user with a typical number of subscriptions/rooms.
* Record real response shapes (trimmed samples) to compare against the planned internal types (`SubscriptionChannel`, `VideoSummary`).
* Identify any gaps between the real API data and the internal data models, and note recommended type adjustments for feature 18.
* Confirm autoplay/embed constraints noted in `context/project-overview.md` (IFrame Player API behavior, muted autoplay rules) with a minimal embed test if practical.
* Produce a short written findings summary (in this file or a linked doc) covering: auth flow notes, quota findings, response shape notes, embed/playback notes, and any recommended deviations from the original plan.

## Out Of Scope

* Any production code in `src/services/`, `src/components/`, or `src/app/` — this is a spike; throwaway scripts belong outside the committed `src/` tree (e.g., a local scratch script, not merged) or clearly isolated and removed before merge.
* Full OAuth flow implementation for end users — feature 18.
* Any UI changes.
* Committing real API keys/secrets anywhere in the repo or CI.

## UX Notes

Not applicable — no user-facing UI is built in this spike.

## Technical Notes

Likely files:

* Findings notes appended to this file, or a new `context/features/17-findings.md` companion doc, committed.
* Any throwaway scripts used for exploration should live outside `src/` (e.g., a local, gitignored scratch folder) and must not be merged as production code.

Implementation notes:

* Follow `context/project-overview.md`'s YouTube API Strategy constraints strictly: read-only scope, avoid `search.list` for routine fetching, no downloading/rehosting video content, respect caching policy limits.
* Treat this as research: the deliverable is documented knowledge and a validated plan, not shipped integration code.
* If quota or auth findings reveal the planned approach won't work as described, stop and report the conflict rather than improvising a different architecture unilaterally, per `context/ai-interaction.md`.

## Acceptance Criteria

* A findings summary exists covering auth flow, quota costs, response shapes, and playback/embed constraints.
* Any recommended adjustments to `SubscriptionChannel`/`VideoSummary` types are explicitly called out for feature 18 to act on.
* No production code or committed secrets result from this spike.
* `CHANGELOG.md` updated under `## [Unreleased]` noting the spike and its key findings (high level only, no secrets).

## Verification

* Confirm no API keys, tokens, or `.env` files were committed (`git status`/`git diff` review before any commit).
* Confirm the findings summary is specific enough that feature 18 could be scoped/estimated from it alone.
* No build/test/lint commands are strictly required since no production code changes, but run `npm run typecheck` and `npm run test` to confirm the spike introduced no accidental changes to tracked source.

## References

* `context/project-overview.md` (YouTube API Strategy, Things To Avoid)
* `context/ai-interaction.md` (YouTube API Rules, When Stuck)

## Suggested Branch

`spike/17-youtube-api-exploration`

## Suggested Commit

`docs: record youtube api exploration spike findings`
