import { useCallback, useState } from 'react';
import {
  connectYoutubeAccount,
  disconnectYoutubeAccount,
  isYoutubeConnected,
  YoutubeAuthError,
  type YoutubeAuthErrorCode,
} from '../services/youtubeAuth';
import {
  fetchChannelUploadsPlaylistIds,
  fetchRecentVideosForChannel,
  fetchSubscribedChannels,
  fetchVideoCategories,
  YoutubeApiError,
  type YoutubeApiErrorCode,
} from '../services/youtubeApi';
import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';
import type { VideoCategory } from '../types/videoCategory';

export type YoutubeSyncStatus = 'disconnected' | 'connecting' | 'connected' | 'syncing' | 'error';

export type YoutubeSyncErrorCode = YoutubeAuthErrorCode | YoutubeApiErrorCode;

export interface YoutubeSyncError {
  code: YoutubeSyncErrorCode;
  message: string;
}

export interface UseYoutubeSyncResult {
  status: YoutubeSyncStatus;
  error: YoutubeSyncError | null;
  lastSyncedAt: string | null;
  channels: SubscriptionChannel[];
  videos: VideoSummary[];
  /** Video categories (e.g. "Gaming", "Music") for every `categoryId` present among synced `videos`. */
  categories: VideoCategory[];
  /** Requests account access, then runs an initial sync. */
  connect: () => Promise<void>;
  /** Revokes access and clears synced data. */
  disconnect: () => Promise<void>;
  /** Re-fetches subscriptions and recent videos for an already-connected account. */
  sync: () => Promise<void>;
}

function toSyncError(err: unknown): YoutubeSyncError {
  if (err instanceof YoutubeAuthError || err instanceof YoutubeApiError) {
    return { code: err.code, message: err.message };
  }
  return { code: 'unknown', message: 'Something unexpected happened. Try again.' };
}

/**
 * Owns the YouTube connection/sync lifecycle for the settings surface:
 * connect, disconnect, and manual sync, each moving through an explicit
 * status so the UI can distinguish connecting, syncing, and error states.
 * Sync fetches subscribed channels and, for each, its recent uploads —
 * the same shapes existing dashboard/room components already expect.
 */
export function useYoutubeSync(): UseYoutubeSyncResult {
  const [status, setStatus] = useState<YoutubeSyncStatus>(() =>
    isYoutubeConnected() ? 'connected' : 'disconnected',
  );
  const [error, setError] = useState<YoutubeSyncError | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [channels, setChannels] = useState<SubscriptionChannel[]>([]);
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);

  const sync = useCallback(async () => {
    setStatus('syncing');
    setError(null);
    try {
      const subscribedChannels = await fetchSubscribedChannels();
      const uploadsPlaylistIdsByChannel = await fetchChannelUploadsPlaylistIds(
        subscribedChannels.map((channel) => channel.youtubeChannelId),
      );

      const videosByChannel = await Promise.all(
        subscribedChannels.map((channel) => {
          const uploadsPlaylistId = uploadsPlaylistIdsByChannel.get(channel.youtubeChannelId);
          return uploadsPlaylistId ? fetchRecentVideosForChannel(uploadsPlaylistId) : Promise.resolve([]);
        }),
      );
      const syncedVideos = videosByChannel.flat();

      const distinctCategoryIds = Array.from(
        new Set(syncedVideos.map((video) => video.categoryId).filter((id): id is string => Boolean(id))),
      );
      const syncedCategories =
        distinctCategoryIds.length > 0 ? await fetchVideoCategories(distinctCategoryIds) : [];

      setChannels(subscribedChannels);
      setVideos(syncedVideos);
      setCategories(syncedCategories);
      setLastSyncedAt(new Date().toISOString());
      setStatus('connected');
    } catch (err) {
      setError(toSyncError(err));
      setStatus('error');
    }
  }, []);

  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      await connectYoutubeAccount();
    } catch (err) {
      setError(toSyncError(err));
      setStatus('error');
      return;
    }
    await sync();
  }, [sync]);

  const disconnect = useCallback(async () => {
    await disconnectYoutubeAccount();
    setStatus('disconnected');
    setError(null);
    setChannels([]);
    setVideos([]);
    setCategories([]);
    setLastSyncedAt(null);
  }, []);

  return { status, error, lastSyncedAt, channels, videos, categories, connect, disconnect, sync };
}
