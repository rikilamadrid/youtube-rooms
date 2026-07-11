# Feature Spec: YouTube API Exploration Spike

## Status

Complete

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

## Findings

Exercised with a throwaway PKCE loopback OAuth script (`scratch/youtube-api-spike/spike.mjs`, not committed) against a real account and real subscriptions.

### Auth flow

* Read-only scope `https://www.googleapis.com/auth/youtube.readonly` works via a standard PKCE authorization-code flow with a loopback (`http://127.0.0.1:<port>/callback`) redirect URI on a "Desktop app" OAuth client. No manual OOB copy/paste step needed.
* OAuth consent screen "Branding" fields (logo, app domain, authorized domains, home page/privacy/terms links) are **not required** while the app stays in Testing status with the developer added as a test user — only App name and support email are required. Verification is only triggered by uploading a logo or requesting sensitive/restricted scopes.
* `Error 401: invalid_client` during the auth request is a client-ID mismatch, not a scope/permission problem — in this case caused by copying the Client ID with surrounding quotes into `.env.local`, which a naive parser doesn't strip. Real client ID/secret must be pulled fresh from Cloud Console → APIs & Services → Credentials.
* No refresh-token persistence was implemented in the spike (out of scope) — feature 18 will need to design token storage/refresh explicitly for a real "keep users signed in" experience.

### Quota costs (observed, matches Google's published unit costs)

| Method | Calls made | Unit cost |
| --- | --- | --- |
| `subscriptions.list` | 1 (25 results/page) | 1 unit |
| `channels.list` | 1 (batched, 2 ids) | 1 unit |
| `playlistItems.list` | 2 (1 per channel) | 1 unit each |

Total: 4 units for 2 channels' worth of recent videos. `channels.list` accepts up to 50 comma-separated ids per call, so a full sync is roughly:

```text
1 (subscriptions.list, paged 50/page)
+ ceil(N / 50) (channels.list, batched)
+ N (playlistItems.list, one per channel — no batch endpoint for this)
```

For a user with e.g. 100 subscribed channels: `1 + 2 + 100 = 103 units` per full sync. Against the default 10,000 units/day project quota, that supports roughly 97 full syncs/day for one such user — comfortable for a personal-use app, but `playlistItems.list` not being batchable means quota scales linearly with subscription count and is the real cost driver, not `subscriptions.list`/`channels.list`.

### Response shapes vs. planned types

**`SubscriptionChannel` (`src/types/channel.ts`) — mostly maps cleanly:**

| Field | Source |
| --- | --- |
| `youtubeChannelId` | `subscriptions.list` → `items[].snippet.resourceId.channelId`, or `channels.list` → `items[].id` |
| `title` | `snippet.title` |
| `description` | `snippet.description` |
| `thumbnailUrl` | `snippet.thumbnails.{default,medium,high}.url` — pick one size consistently; not all sizes present at all sizes always |

Gaps found:

* **`topicTags: string[]` has no API equivalent.** Neither `subscriptions.list` nor `channels.list` (even with `part=topicDetails`) returns friendly topic tags — `topicDetails.topicCategories` is a list of Wikipedia URLs, not display-ready strings. `topicTags` is effectively a **user-assigned/local-only field** for room organization, not something to populate from a sync. Recommend documenting this explicitly in feature 18 so it isn't accidentally treated as sync-able.
* **Missing field needed for sync mechanics**: the uploads playlist ID (`channels.list` → `items[].contentDetails.relatedPlaylists.uploads`) has nowhere to live on `SubscriptionChannel`. Recommend adding an internal-only field (e.g. `uploadsPlaylistId?: string`) or keeping it in a separate sync-state map rather than polluting the UI-facing type — needs a decision in feature 18.

**`VideoSummary` (`src/types/video.ts`) — one real gap:**

| Field | Source |
| --- | --- |
| `youtubeVideoId` | `playlistItems.list` → `items[].contentDetails.videoId` (same as `snippet.resourceId.videoId`) |
| `channelId` | `snippet.videoOwnerChannelId` (matches `snippet.channelId` in observed samples — uploads-playlist items are always owned by the playlist's channel, so either works, but `videoOwnerChannelId` is the more semantically correct field per YouTube's docs) |
| `title` | `snippet.title` |
| `description` | `snippet.description` — real descriptions can be long, multi-paragraph, link/sponsor-heavy; UI must truncate/clamp, don't render raw |
| `thumbnailUrl` | `snippet.thumbnails.*` — same multi-size caveat as channels; `maxres` was present in both samples but is not guaranteed for all videos (known API behavior), fall back to `high` |
| `publishedAt` | `snippet.publishedAt` or `contentDetails.videoPublishedAt` — both present and identical in samples; prefer `contentDetails.videoPublishedAt` since it's documented as the actual video publish time (playlist `snippet.publishedAt` is when the item was added to the playlist, which usually but not always coincides for auto-managed uploads playlists) |

* **`duration` cannot be sourced from `playlistItems.list` at all.** It's absent from both `snippet` and `contentDetails` in this response. Getting duration requires a separate `videos.list?part=contentDetails&id=<ids>` call (ISO 8601 duration, e.g. `PT12M15S`), batchable up to 50 ids per call. This adds `ceil(videos_fetched / 50)` extra quota units per sync (1 unit/call) — small in practice, but is an **additional required call not in the original planned approach** (spec section 4 only mentioned `playlistItems.list` → normalize). Recommend feature 18 add `videos.list` as a fourth step if `duration` is going to be displayed.
* `watched` is confirmed local-only (no API equivalent, as expected).

### Playback / embed constraints

**Not exercised in this spike** — the script only covered the data-fetching calls (`subscriptions.list`, `channels.list`, `playlistItems.list`); no IFrame Player embed was tested. This is a gap against the spec's "confirm autoplay/embed constraints... if practical" requirement. Recommend either a short follow-up embed smoke test before feature 18 starts, or treating IFrame Player integration as first-time exploration within feature 18 itself given it's a well-documented, low-risk API (autoplay-must-be-muted is a standard, well-known browser constraint independent of this project).

### Recommended deviations from the original plan for feature 18

1. Add a `videos.list` call (batched) after `playlistItems.list` to fetch `duration` — not in the original 5-step plan.
2. Treat `topicTags` as user/local-only, not sync-derived.
3. Add an internal (non-UI) field or side-map for `uploadsPlaylistId` per channel to avoid re-fetching `channels.list` on every sync.
4. Design token storage/refresh explicitly — not covered by this spike.
5. Budget quota primarily around `playlistItems.list` (1 call per channel, not batchable) as the linear-scaling cost driver.
