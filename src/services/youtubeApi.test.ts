import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./youtubeAuth', () => ({
  getYoutubeAccessToken: vi.fn().mockResolvedValue('test-access-token'),
}));

import {
  YoutubeApiError,
  fetchChannelUploadsPlaylistIds,
  fetchRecentVideosForChannel,
  fetchSubscribedChannels,
  fetchVideoCategories,
  fetchVideoMetadata,
} from './youtubeApi';

function jsonResponse(body: unknown, init: { status?: number } = {}) {
  return {
    ok: (init.status ?? 200) < 400,
    status: init.status ?? 200,
    json: async () => body,
  } as Response;
}

function subscriptionItem(channelId: string, title: string) {
  return {
    snippet: {
      title,
      description: '',
      resourceId: { channelId },
      thumbnails: {},
    },
  };
}

describe('youtubeApi', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('fetchSubscribedChannels', () => {
    it('pages through subscriptions.list and normalizes every channel', async () => {
      fetchMock
        .mockResolvedValueOnce(
          jsonResponse({ items: [subscriptionItem('UC1', 'Channel One')], nextPageToken: 'page-2' }),
        )
        .mockResolvedValueOnce(jsonResponse({ items: [subscriptionItem('UC2', 'Channel Two')] }));

      const channels = await fetchSubscribedChannels();

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(channels).toEqual([
        { id: 'UC1', youtubeChannelId: 'UC1', title: 'Channel One', description: undefined, thumbnailUrl: undefined, topicTags: [] },
        { id: 'UC2', youtubeChannelId: 'UC2', title: 'Channel Two', description: undefined, thumbnailUrl: undefined, topicTags: [] },
      ]);
    });

    it('returns an empty array when the user has no subscriptions', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }));
      await expect(fetchSubscribedChannels()).resolves.toEqual([]);
    });
  });

  describe('fetchChannelUploadsPlaylistIds', () => {
    it('batches more than 50 channel ids into multiple calls', async () => {
      const channelIds = Array.from({ length: 75 }, (_, i) => `UC${i}`);
      fetchMock
        .mockResolvedValueOnce(
          jsonResponse({
            items: channelIds
              .slice(0, 50)
              .map((id) => ({ id, contentDetails: { relatedPlaylists: { uploads: `UU${id}` } } })),
          }),
        )
        .mockResolvedValueOnce(
          jsonResponse({
            items: channelIds
              .slice(50)
              .map((id) => ({ id, contentDetails: { relatedPlaylists: { uploads: `UU${id}` } } })),
          }),
        );

      const result = await fetchChannelUploadsPlaylistIds(channelIds);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result.size).toBe(75);
      expect(result.get('UC0')).toBe('UUUC0');
      expect(result.get('UC74')).toBe('UUUC74');
    });
  });

  describe('fetchVideoMetadata', () => {
    it('batches ids and maps duration and categoryId by video id', async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({
          items: [
            { id: 'vid1', contentDetails: { duration: 'PT10M' }, snippet: { categoryId: '20' } },
          ],
        }),
      );

      const metadata = await fetchVideoMetadata(['vid1']);
      expect(metadata.get('vid1')).toEqual({ duration: 'PT10M', categoryId: '20' });
    });

    it('omits categoryId when the item has no snippet', async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ items: [{ id: 'vid1', contentDetails: { duration: 'PT10M' } }] }),
      );

      const metadata = await fetchVideoMetadata(['vid1']);
      expect(metadata.get('vid1')).toEqual({ duration: 'PT10M', categoryId: undefined });
    });
  });

  describe('fetchVideoCategories', () => {
    it('batches ids and normalizes categories', async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ items: [{ id: '20', snippet: { title: 'Gaming' } }] }),
      );

      const categories = await fetchVideoCategories(['20']);
      expect(categories).toEqual([{ id: '20', title: 'Gaming' }]);
    });

    it('batches more than 50 category ids into multiple calls', async () => {
      const categoryIds = Array.from({ length: 60 }, (_, i) => `${i}`);
      fetchMock
        .mockResolvedValueOnce(
          jsonResponse({
            items: categoryIds.slice(0, 50).map((id) => ({ id, snippet: { title: `Category ${id}` } })),
          }),
        )
        .mockResolvedValueOnce(
          jsonResponse({
            items: categoryIds.slice(50).map((id) => ({ id, snippet: { title: `Category ${id}` } })),
          }),
        );

      const categories = await fetchVideoCategories(categoryIds);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(categories).toHaveLength(60);
    });
  });

  describe('fetchRecentVideosForChannel', () => {
    it('returns an empty array without fetching durations when the playlist has no items', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }));

      const videos = await fetchRecentVideosForChannel('UUplaylist');

      expect(videos).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('fetches durations and returns videos sorted by recency', async () => {
      fetchMock
        .mockResolvedValueOnce(
          jsonResponse({
            items: [
              {
                snippet: {
                  title: 'Older Video',
                  description: '',
                  publishedAt: '2026-01-01T00:00:00Z',
                  thumbnails: {},
                  videoOwnerChannelId: 'UC1',
                },
                contentDetails: { videoId: 'old', videoPublishedAt: '2026-01-01T00:00:00Z' },
              },
              {
                snippet: {
                  title: 'Newer Video',
                  description: '',
                  publishedAt: '2026-02-01T00:00:00Z',
                  thumbnails: {},
                  videoOwnerChannelId: 'UC1',
                },
                contentDetails: { videoId: 'new', videoPublishedAt: '2026-02-01T00:00:00Z' },
              },
            ],
          }),
        )
        .mockResolvedValueOnce(
          jsonResponse({
            items: [
              { id: 'old', contentDetails: { duration: 'PT5M' } },
              { id: 'new', contentDetails: { duration: 'PT8M' } },
            ],
          }),
        );

      const videos = await fetchRecentVideosForChannel('UUplaylist');

      expect(videos.map((v) => v.youtubeVideoId)).toEqual(['new', 'old']);
      expect(videos[0].duration).toBe('PT8M');
    });
  });

  describe('error mapping', () => {
    it('maps a 401 response to a YoutubeApiError with code auth', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ error: { code: 401, message: 'Invalid Credentials' } }, { status: 401 }));

      await expect(fetchSubscribedChannels()).rejects.toMatchObject({ code: 'auth' } satisfies Partial<YoutubeApiError>);
    });

    it('maps a 403 quotaExceeded response to a YoutubeApiError with code quota-exceeded', async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse(
          { error: { code: 403, message: 'Quota exceeded', errors: [{ reason: 'quotaExceeded', message: 'Quota exceeded' }] } },
          { status: 403 },
        ),
      );

      await expect(fetchSubscribedChannels()).rejects.toMatchObject({
        code: 'quota-exceeded',
      } satisfies Partial<YoutubeApiError>);
    });

    it('maps a thrown fetch failure to a YoutubeApiError with code network', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(fetchSubscribedChannels()).rejects.toMatchObject({ code: 'network' } satisfies Partial<YoutubeApiError>);
    });

    it('maps an unrecognized error response to code unknown', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ error: { code: 500, message: 'Internal error' } }, { status: 500 }));

      await expect(fetchSubscribedChannels()).rejects.toMatchObject({ code: 'unknown' } satisfies Partial<YoutubeApiError>);
    });
  });
});
