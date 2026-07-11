# Current Feature: YouTube API Integration

Use this file as the live tracker for what is active now. Keep it lean. When a feature lands, summarize the completed work in `context/history.md` and move this file forward to the next task.

## Status

In Progress

### Sub-branch plan (feature is split across multiple PRs)

1. `feature/18-1-youtube-auth` — OAuth read-only sign-in service + token storage/refresh (`src/services/youtubeAuth.ts`) **(merged)**
2. `feature/18-2-youtube-api-fetch` — `youtubeApi.ts` (subscriptions/channels/playlistItems/videos calls) + `normalizeYoutubeData.ts`, with unit tests on fixtures **(merged)**
3. `feature/18-3-youtube-settings-ui` — `/settings` surface + `useYoutubeSync` hook, sync status UI, error-state copy **(merged)**
4. `feature/18-4-youtube-wire-data` — narrowed scope (see Notes below): lift `useYoutubeSync` into a `YoutubeSyncProvider` context so synced data survives navigation, add a read-only `/channels` view proving real synced videos render through the existing `VideoFeed`/`VideoCard` components. Dashboard/room-detail/queue stay on mock data. **(in progress)**

Each sub-branch gets its own PR per the normal workflow (branch → implement → test → changelog → ask before commit → ask before push → ask before merge).

Room/channel assignment (letting a user assign real synced channels to rooms, replacing `mockRooms.ts`'s hardcoded `channelIds`) was discovered to be a missing prerequisite, not part of feature 18 as originally scoped — split out into `context/features/19-room-channel-assignment.md`, to be tackled after 18-4 lands.

## Goals

- Implement OAuth sign-in (read-only scope), isolated entirely in `src/services/`.
- Implement `subscriptions.list` to import subscribed channels, normalized into `SubscriptionChannel`.
- Implement uploads-playlist strategy (`channels.list` → uploads playlist id → `playlistItems.list`) for recent videos, normalized into `VideoSummary`.
- Add a batched `videos.list` call to fetch `duration` (per feature 17 finding — not in the original plan).
- Apply feature 17's recommended type adjustments before wiring real data through:
  - Treat `topicTags` as user/local-only, not sync-derived.
  - Add an internal (non-UI) field or side-map for `uploadsPlaylistId` per channel (avoid polluting the UI-facing type).
  - Design token storage/refresh explicitly (not covered by the spike).
- Add a `/settings` surface for initiating/confirming the YouTube connection and showing sync status (connected, syncing, last synced, error).
- Distinguish and surface auth errors, quota-exceeded errors, empty-result states, and network failures with calm, specific copy.
- Manual/app-controlled sync trigger only — no aggressive polling; budget quota primarily around `playlistItems.list` (1 call per channel, not batchable, the linear-scaling cost driver).
- Preserve existing dashboard/room-detail/queue components' prop contracts unchanged — real data must satisfy existing `Room`/`SubscriptionChannel`/`VideoSummary` shapes.
- Use YouTube IFrame Player API/embedded player only for any playback surface (no custom/download-based playback). Embed/autoplay behavior not yet validated by the spike — treat as first-time exploration if in scope.

## Notes

- Directly informed by `context/features/17-youtube-api-exploration-spike.md` findings (auth flow, quota costs, response-shape gaps, type-adjustment recommendations above).
- Largest feature in the roadmap — flag to the user before starting if scope looks too large for a single reviewable PR; consider splitting (auth → fetch → normalize → wire UI) into sub-branches.
- Mock the YouTube API in all automated tests; no live network calls in `npm run test`.
- Out of scope: backend persistence (local state/localStorage only), automatic background sync/polling, `search.list`-based channel discovery, multi-account support.
- Decide and document before implementation: whether mock data is removed or demoted to a fallback/dev-only mode.
- Suggested branch: `feature/18-youtube-api-integration`.
- Suggested commit: `feat: integrate youtube data api for subscriptions and recent videos`.
- References: `context/project-overview.md` (YouTube API Strategy, Things To Avoid), `context/coding-standards.md` (Error Handling, Data), `context/ai-interaction.md` (YouTube API Rules), `context/features/17-youtube-api-exploration-spike.md`, `context/features/11-mock-data-models-and-fixtures.md`.
