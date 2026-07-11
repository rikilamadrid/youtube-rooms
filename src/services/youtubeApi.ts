import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';
import type { VideoCategory } from '../types/videoCategory';
import { getYoutubeAccessToken } from './youtubeAuth';
import {
  extractUploadsPlaylistId,
  normalizeSubscriptionChannel,
  normalizeVideoCategory,
  normalizeVideoSummary,
  type VideoMetadata,
} from './normalizeYoutubeData';
import type {
  RawApiErrorResponse,
  RawChannelItem,
  RawListResponse,
  RawPlaylistItem,
  RawSubscriptionItem,
  RawVideoCategoryItem,
  RawVideoItem,
} from './youtubeApiTypes';

const API_BASE = 'https://www.googleapis.com/youtube/v3';
/** channels.list / videos.list both accept up to 50 comma-separated ids per call. */
const MAX_BATCH_IDS = 50;
/** Recent-videos feeds only need the newest page of uploads, not full history. */
const DEFAULT_PLAYLIST_ITEMS_PAGE_SIZE = 20;

export type YoutubeApiErrorCode = 'auth' | 'quota-exceeded' | 'network' | 'unknown';

export class YoutubeApiError extends Error {
  code: YoutubeApiErrorCode;

  constructor(code: YoutubeApiErrorCode, message: string) {
    super(message);
    this.name = 'YoutubeApiError';
    this.code = code;
  }
}

function isQuotaExceeded(body: RawApiErrorResponse | undefined): boolean {
  return (body?.error?.errors ?? []).some(
    (e) => e.reason === 'quotaExceeded' || e.reason === 'dailyLimitExceeded' || e.reason === 'rateLimitExceeded',
  );
}

async function mapErrorResponse(response: Response): Promise<YoutubeApiError> {
  let body: RawApiErrorResponse | undefined;
  try {
    body = (await response.json()) as RawApiErrorResponse;
  } catch {
    body = undefined;
  }

  if (response.status === 401) {
    return new YoutubeApiError('auth', 'Your YouTube session has expired. Reconnect your account to continue syncing.');
  }
  if (response.status === 403 && isQuotaExceeded(body)) {
    return new YoutubeApiError('quota-exceeded', 'YouTube API quota has been used up for today. Try syncing again tomorrow.');
  }
  return new YoutubeApiError('unknown', body?.error?.message ?? 'YouTube sync failed unexpectedly.');
}

async function youtubeApiFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const accessToken = await getYoutubeAccessToken();
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch {
    throw new YoutubeApiError('network', 'Could not reach YouTube. Check your connection and try again.');
  }

  if (!response.ok) {
    throw await mapErrorResponse(response);
  }

  return (await response.json()) as T;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** Pages through subscriptions.list and normalizes every subscribed channel into SubscriptionChannel. */
export async function fetchSubscribedChannels(): Promise<SubscriptionChannel[]> {
  const channels: SubscriptionChannel[] = [];
  let pageToken: string | undefined;

  do {
    const response = await youtubeApiFetch<RawListResponse<RawSubscriptionItem>>('/subscriptions', {
      part: 'snippet',
      mine: 'true',
      maxResults: '50',
      ...(pageToken ? { pageToken } : {}),
    });
    channels.push(...response.items.map(normalizeSubscriptionChannel));
    pageToken = response.nextPageToken;
  } while (pageToken);

  return channels;
}

/**
 * Resolves each channel's uploads playlist id (channels.list, batched up to
 * 50 ids/call) so recent videos can be fetched via playlistItems.list without
 * re-querying channels.list on every sync.
 */
export async function fetchChannelUploadsPlaylistIds(channelIds: string[]): Promise<Map<string, string>> {
  const uploadsPlaylistIdsByChannel = new Map<string, string>();

  for (const batch of chunk(channelIds, MAX_BATCH_IDS)) {
    const response = await youtubeApiFetch<RawListResponse<RawChannelItem>>('/channels', {
      part: 'contentDetails',
      id: batch.join(','),
    });
    for (const item of response.items) {
      const uploadsPlaylistId = extractUploadsPlaylistId(item);
      if (uploadsPlaylistId) {
        uploadsPlaylistIdsByChannel.set(item.id, uploadsPlaylistId);
      }
    }
  }

  return uploadsPlaylistIdsByChannel;
}

/**
 * Batched videos.list call (up to 50 ids/call) to fetch duration and
 * categoryId — neither is available from playlistItems.list. `categoryId`
 * rides along on the same call (`part=contentDetails,snippet`) at no extra
 * request cost; resolve it to a display name via `fetchVideoCategories`.
 */
export async function fetchVideoMetadata(videoIds: string[]): Promise<Map<string, VideoMetadata>> {
  const metadataByVideoId = new Map<string, VideoMetadata>();

  for (const batch of chunk(videoIds, MAX_BATCH_IDS)) {
    const response = await youtubeApiFetch<RawListResponse<RawVideoItem>>('/videos', {
      part: 'contentDetails,snippet',
      id: batch.join(','),
    });
    for (const item of response.items) {
      metadataByVideoId.set(item.id, {
        duration: item.contentDetails.duration,
        categoryId: item.snippet?.categoryId,
      });
    }
  }

  return metadataByVideoId;
}

/** Batched videoCategories.list call (up to 50 ids/call) to resolve category ids to display names. */
export async function fetchVideoCategories(categoryIds: string[]): Promise<VideoCategory[]> {
  const categories: VideoCategory[] = [];

  for (const batch of chunk(categoryIds, MAX_BATCH_IDS)) {
    const response = await youtubeApiFetch<RawListResponse<RawVideoCategoryItem>>('/videoCategories', {
      part: 'snippet',
      id: batch.join(','),
    });
    categories.push(...response.items.map(normalizeVideoCategory));
  }

  return categories;
}

/**
 * Fetches the most recent uploads for a single channel: playlistItems.list
 * against its uploads playlist, then videos.list for duration/categoryId,
 * normalized into VideoSummary sorted by recency.
 */
export async function fetchRecentVideosForChannel(
  uploadsPlaylistId: string,
  maxResults: number = DEFAULT_PLAYLIST_ITEMS_PAGE_SIZE,
): Promise<VideoSummary[]> {
  const response = await youtubeApiFetch<RawListResponse<RawPlaylistItem>>('/playlistItems', {
    part: 'snippet,contentDetails',
    playlistId: uploadsPlaylistId,
    maxResults: String(maxResults),
  });

  if (response.items.length === 0) {
    return [];
  }

  const videoIds = response.items.map((item) => item.contentDetails.videoId);
  const metadataByVideoId = await fetchVideoMetadata(videoIds);

  return response.items
    .map((item) => normalizeVideoSummary(item, metadataByVideoId.get(item.contentDetails.videoId)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
