# Feature Spec: YouTube API Integration

## Status

Not Started

## Overview

Replace typed mock data with a real, read-only YouTube Data API integration: OAuth sign-in, subscription import, uploads-based recent video sync, normalized into the existing `SubscriptionChannel`/`VideoSummary` types — informed directly by the findings from feature 17.

## Problem

Every feature through 16 runs on typed mock data by design. This is the first feature where SubRooms becomes a real product connected to a user's actual YouTube subscriptions, per Build Phase 5 in `context/project-overview.md`.

## Goal

A user can connect their YouTube account (read-only), see their real subscribed channels available for room assignment, and see real recent videos populate their rooms — with the existing dashboard, room detail, and queue UI working unchanged against real data instead of mock data.

## Requirements

* Implement OAuth sign-in using a read-only scope, isolated entirely within `src/services/` (per `context/project-overview.md`'s "Keep YouTube API work isolated in `src/services/`").
* Implement `subscriptions.list` to import a user's subscribed channels, normalized into `SubscriptionChannel` (do not leak raw API response shapes past the service layer).
* Implement the uploads-playlist strategy from feature 17's findings (`channels.list` → uploads playlist id → `playlistItems.list`) to fetch recent videos per channel, normalized into `VideoSummary`.
* Apply any type adjustments identified in feature 17's findings to `src/types/` before wiring real data through.
* Add a `/settings` surface (or extend an existing minimal one) for initiating/confirming the YouTube connection and showing sync status (connected, syncing, last synced, error).
* Distinguish and surface auth errors, quota-exceeded errors, empty-result states, and network failures with calm, specific copy, per `context/coding-standards.md`'s Error Handling section.
* Keep a manual or app-controlled sync trigger rather than aggressive polling, respecting quota constraints from `context/project-overview.md`.
* Preserve the existing dashboard/room-detail/queue components unchanged in their props contracts — real data must satisfy the same `Room`/`SubscriptionChannel`/`VideoSummary` shapes the mock data already used, proving the normalization boundary held.
* Use the YouTube IFrame Player API or embedded player for any playback surface introduced here (if in scope) rather than any custom/download-based playback, per the project's hard constraint.

## Out Of Scope

* Persisting room/channel assignments to a backend — `context/project-overview.md` notes this may need "a small backend later"; this feature can keep assignments in local state/local storage only, not introduce a new backend service without explicit approval.
* Automatic background sync/polling.
* Any channel discovery/search beyond the user's existing subscriptions (no `search.list`-based discovery).
* Multi-account support.

## UX Notes

* Connecting the account should be an explicit, clearly-labeled user action, not automatic on load.
* Sync status must be visible and calm (loading, success, empty, error) per `context/project-overview.md`'s UX Principles.
* Respect the existing mobile-first, token-driven visual language already established; no new design language should be introduced for the settings/connection surface.
* Autoplay/embed behavior must account for browser autoplay restrictions noted in the project overview (muted autoplay or user-gesture requirements).

## Technical Notes

Likely files:

* `src/services/youtubeAuth.ts`
* `src/services/youtubeApi.ts` (subscriptions, channels, playlistItems calls)
* `src/services/normalizeYoutubeData.ts` (raw API response → `SubscriptionChannel`/`VideoSummary`)
* `src/app/routes/SettingsPage.tsx`
* `src/hooks/useYoutubeSync.ts` (sync status/state management)
* Updates to `src/types/channel.ts` / `src/types/video.ts` per feature 17 findings, if any
* Corresponding `*.test.ts(x)` files, especially for the normalization layer (pure functions, highly testable without live network calls)

Implementation notes:

* This is the largest feature in the roadmap; consider splitting into sub-branches/PRs (e.g., auth first, then fetch, then normalize, then wire UI) if it grows beyond a single reviewable diff — flag this to the user before starting if the scope looks too large for one PR.
* Mock the YouTube API in tests; do not make live network calls in the automated test suite.
* Follow every constraint in `context/project-overview.md`'s YouTube API Strategy section exactly: read-only scope, uploads-playlist strategy over `search.list`, no downloading/rehosting, IFrame/embedded playback only, policy-compliant caching only.

## Acceptance Criteria

* A user can connect their YouTube account via OAuth (read-only) from the settings surface.
* Real subscribed channels appear and can be assigned to rooms using the existing room/channel UI patterns.
* Real recent videos populate room detail feeds using the existing `VideoCard`/feed UI, sorted by recency.
* Auth errors, quota errors, empty results, and network failures each show distinct, calm, correct messaging.
* No raw YouTube API response shape is used directly by UI components — everything passes through normalization into `SubscriptionChannel`/`VideoSummary`.
* Normalization logic has unit tests using representative fixture responses (no live network calls in tests).
* `npm run build` passes; the app functions with mock data removed or demoted to a fallback/dev-only mode (decide and document which, before implementation).
* `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

* Manually connect a real YouTube account in a local dev environment and confirm subscriptions import correctly.
* Manually assign a few real channels to a room and confirm the room detail feed shows real recent videos in the correct order.
* Force each error condition where feasible (revoke access for auth error, inspect quota dashboard for quota error) and confirm correct UI messaging.
* Confirm no live network calls occur during `npm run test`.
* `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## References

* `context/project-overview.md` (YouTube API Strategy, Things To Avoid)
* `context/coding-standards.md` (Error Handling, Data)
* `context/ai-interaction.md` (YouTube API Rules)
* `context/features/17-youtube-api-exploration-spike.md`
* `context/features/11-mock-data-models-and-fixtures.md`

## Suggested Branch

`feature/18-youtube-api-integration`

## Suggested Commit

`feat: integrate youtube data api for subscriptions and recent videos`
