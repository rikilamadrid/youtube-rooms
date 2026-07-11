import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';
import type { VideoCategory } from '../types/videoCategory';
import type {
  RawChannelItem,
  RawPlaylistItem,
  RawSubscriptionItem,
  RawThumbnails,
  RawVideoCategoryItem,
} from './youtubeApiTypes';

/** Prefers the highest-resolution thumbnail available; not every size is guaranteed on every item. */
function pickThumbnailUrl(thumbnails: RawThumbnails | undefined): string | undefined {
  return thumbnails?.maxres?.url ?? thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url;
}

/**
 * `topicTags` has no YouTube API equivalent (per feature 17 findings) — it is
 * user-assigned/local-only and is never populated from a sync.
 */
export function normalizeSubscriptionChannel(item: RawSubscriptionItem): SubscriptionChannel {
  const channelId = item.snippet.resourceId.channelId;
  return {
    id: channelId,
    youtubeChannelId: channelId,
    title: item.snippet.title,
    description: item.snippet.description || undefined,
    thumbnailUrl: pickThumbnailUrl(item.snippet.thumbnails),
    topicTags: [],
  };
}

/**
 * The uploads playlist id is sync mechanics, not a UI-facing channel field
 * (per feature 17 findings) — callers keep it in a side-map, not on
 * SubscriptionChannel.
 */
export function extractUploadsPlaylistId(item: RawChannelItem): string | undefined {
  return item.contentDetails?.relatedPlaylists.uploads;
}

export interface VideoMetadata {
  duration?: string;
  categoryId?: string;
}

/**
 * `duration` and `categoryId` come from a separate videos.list call (not
 * available on playlistItems.list) — pass them in once fetched, or omit
 * either if unavailable.
 */
export function normalizeVideoSummary(item: RawPlaylistItem, metadata?: VideoMetadata): VideoSummary {
  const videoId = item.contentDetails.videoId;
  return {
    id: videoId,
    youtubeVideoId: videoId,
    channelId: item.snippet.videoOwnerChannelId ?? item.snippet.channelId ?? '',
    title: item.snippet.title,
    description: item.snippet.description || undefined,
    thumbnailUrl: pickThumbnailUrl(item.snippet.thumbnails),
    publishedAt: item.contentDetails.videoPublishedAt ?? item.snippet.publishedAt,
    duration: metadata?.duration,
    categoryId: metadata?.categoryId,
  };
}

/** Normalizes a videoCategories.list item into a `VideoCategory` (id → display name). */
export function normalizeVideoCategory(item: RawVideoCategoryItem): VideoCategory {
  return { id: item.id, title: item.snippet.title };
}
