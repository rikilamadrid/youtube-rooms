/**
 * Raw YouTube Data API v3 response shapes (trimmed to the fields this app
 * uses). These types must never be imported outside src/services/ — always
 * pass through normalizeYoutubeData.ts first.
 */

export interface RawThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  maxres?: { url: string };
}

export interface RawListResponse<TItem> {
  items: TItem[];
  nextPageToken?: string;
}

export interface RawSubscriptionItem {
  snippet: {
    title: string;
    description: string;
    resourceId: { channelId: string };
    thumbnails: RawThumbnails;
  };
}

export interface RawChannelItem {
  id: string;
  contentDetails?: {
    relatedPlaylists: { uploads: string };
  };
}

export interface RawPlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: RawThumbnails;
    channelId?: string;
    videoOwnerChannelId?: string;
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt?: string;
  };
}

export interface RawVideoItem {
  id: string;
  contentDetails: {
    duration: string;
  };
}

export interface RawApiErrorResponse {
  error?: {
    code: number;
    message: string;
    errors?: { reason: string; message: string }[];
  };
}
