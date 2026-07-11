import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const connectYoutubeAccount = vi.fn();
const disconnectYoutubeAccount = vi.fn();
const isYoutubeConnected = vi.fn();

vi.mock('../services/youtubeAuth', async () => {
  const actual = await vi.importActual<typeof import('../services/youtubeAuth')>('../services/youtubeAuth');
  return {
    ...actual,
    connectYoutubeAccount: (...args: unknown[]) => connectYoutubeAccount(...args),
    disconnectYoutubeAccount: (...args: unknown[]) => disconnectYoutubeAccount(...args),
    isYoutubeConnected: (...args: unknown[]) => isYoutubeConnected(...args),
  };
});

const fetchSubscribedChannels = vi.fn();
const fetchChannelUploadsPlaylistIds = vi.fn();
const fetchRecentVideosForChannel = vi.fn();

vi.mock('../services/youtubeApi', async () => {
  const actual = await vi.importActual<typeof import('../services/youtubeApi')>('../services/youtubeApi');
  return {
    ...actual,
    fetchSubscribedChannels: (...args: unknown[]) => fetchSubscribedChannels(...args),
    fetchChannelUploadsPlaylistIds: (...args: unknown[]) => fetchChannelUploadsPlaylistIds(...args),
    fetchRecentVideosForChannel: (...args: unknown[]) => fetchRecentVideosForChannel(...args),
  };
});

import { YoutubeAuthError } from '../services/youtubeAuth';
import { YoutubeApiError } from '../services/youtubeApi';
import { useYoutubeSync } from './useYoutubeSync';

const channelOne = {
  id: 'UC1',
  youtubeChannelId: 'UC1',
  title: 'Channel One',
  topicTags: [],
};

const videoOne = {
  id: 'video-1',
  youtubeVideoId: 'video-1',
  channelId: 'UC1',
  title: 'Video One',
  publishedAt: '2026-01-01T00:00:00Z',
};

describe('useYoutubeSync', () => {
  beforeEach(() => {
    isYoutubeConnected.mockReturnValue(false);
    fetchSubscribedChannels.mockResolvedValue([channelOne]);
    fetchChannelUploadsPlaylistIds.mockResolvedValue(new Map([['UC1', 'UU1']]));
    fetchRecentVideosForChannel.mockResolvedValue([videoOne]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('starts disconnected when no account is connected', () => {
    const { result } = renderHook(() => useYoutubeSync());
    expect(result.current.status).toBe('disconnected');
  });

  it('starts connected when an account is already connected', () => {
    isYoutubeConnected.mockReturnValue(true);
    const { result } = renderHook(() => useYoutubeSync());
    expect(result.current.status).toBe('connected');
  });

  it('connects, syncs, and exposes the fetched channels and videos', async () => {
    connectYoutubeAccount.mockResolvedValue(undefined);
    const { result } = renderHook(() => useYoutubeSync());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.status).toBe('connected');
    expect(result.current.channels).toEqual([channelOne]);
    expect(result.current.videos).toEqual([videoOne]);
    expect(result.current.lastSyncedAt).not.toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('surfaces an auth error and does not attempt a sync when connect fails', async () => {
    connectYoutubeAccount.mockRejectedValue(new YoutubeAuthError('access-denied', 'YouTube access was not granted.'));
    const { result } = renderHook(() => useYoutubeSync());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toEqual({ code: 'access-denied', message: 'YouTube access was not granted.' });
    expect(fetchSubscribedChannels).not.toHaveBeenCalled();
  });

  it('surfaces a quota error from sync and preserves it on the error state', async () => {
    isYoutubeConnected.mockReturnValue(true);
    fetchSubscribedChannels.mockRejectedValue(new YoutubeApiError('quota-exceeded', 'YouTube API quota has been used up for today.'));
    const { result } = renderHook(() => useYoutubeSync());

    await act(async () => {
      await result.current.sync();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toEqual({
      code: 'quota-exceeded',
      message: 'YouTube API quota has been used up for today.',
    });
  });

  it('moves through the syncing status while a sync is in flight', async () => {
    isYoutubeConnected.mockReturnValue(true);
    let resolveChannels: (value: unknown) => void = () => {};
    fetchSubscribedChannels.mockReturnValue(
      new Promise((resolve) => {
        resolveChannels = resolve;
      }),
    );
    const { result } = renderHook(() => useYoutubeSync());

    act(() => {
      void result.current.sync();
    });

    await waitFor(() => expect(result.current.status).toBe('syncing'));

    resolveChannels([channelOne]);
    await waitFor(() => expect(result.current.status).toBe('connected'));
  });

  it('clears synced data and returns to disconnected on disconnect', async () => {
    isYoutubeConnected.mockReturnValue(true);
    disconnectYoutubeAccount.mockResolvedValue(undefined);
    const { result } = renderHook(() => useYoutubeSync());

    await act(async () => {
      await result.current.sync();
    });
    expect(result.current.channels).toEqual([channelOne]);

    await act(async () => {
      await result.current.disconnect();
    });

    expect(result.current.status).toBe('disconnected');
    expect(result.current.channels).toEqual([]);
    expect(result.current.videos).toEqual([]);
    expect(result.current.lastSyncedAt).toBeNull();
  });
});
