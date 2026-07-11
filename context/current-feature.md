# Current Feature: YouTube API Exploration Spike

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

Complete

## Goals

- Set up YouTube Data API v3 credentials for local dev only (`.env.local`, never committed).
- Exercise OAuth read-only consent, `subscriptions.list`, `channels.list` (uploads playlist id), and `playlistItems.list` via a throwaway script outside `src/`.
- Record real quota costs per call type and estimate a realistic per-sync cost.
- Record real response shapes and compare against planned `SubscriptionChannel`/`VideoSummary` types; note recommended adjustments.
- Confirm autoplay/embed constraints (IFrame Player API, muted autoplay) with a minimal embed test if practical.
- Produce a written findings summary (auth flow, quota, response shapes, embed/playback, recommended deviations) in `context/features/17-youtube-api-exploration-spike.md` or a linked companion doc.

## Notes

- Spec: `context/features/17-youtube-api-exploration-spike.md`
- Suggested branch: `spike/17-youtube-api-exploration`
- Suggested commit: `docs: record youtube api exploration spike findings`
- This is a spike: no production code in `src/services/`, `src/components/`, or `src/app/`. Throwaway scripts must live outside `src/` and not be merged.
- No full end-user OAuth flow (that's feature 18); no UI changes; no committed secrets/keys.
- Follow `context/project-overview.md` YouTube API Strategy constraints strictly (read-only scope, avoid `search.list`, no downloading/rehosting content, respect caching limits).
- If quota/auth findings conflict with the planned approach, stop and report rather than improvising unilaterally, per `context/ai-interaction.md`.
- Acceptance: findings summary specific enough to scope feature 18; type adjustments explicitly called out; no production code or secrets committed; `CHANGELOG.md` updated under `## [Unreleased]`.
- References: `context/project-overview.md` (YouTube API Strategy, Things To Avoid), `context/ai-interaction.md` (YouTube API Rules, When Stuck).
