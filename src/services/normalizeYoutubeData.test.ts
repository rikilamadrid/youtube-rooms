import { describe, expect, it } from 'vitest';
import { extractUploadsPlaylistId, normalizeSubscriptionChannel, normalizeVideoSummary } from './normalizeYoutubeData';
import type { RawChannelItem, RawPlaylistItem, RawSubscriptionItem } from './youtubeApiTypes';

describe('normalizeSubscriptionChannel', () => {
  it('normalizes a subscriptions.list item into a SubscriptionChannel with an empty topicTags array', () => {
    const raw: RawSubscriptionItem = {
      snippet: {
        title: 'Fireship',
        description: 'High-intensity code tutorials.',
        resourceId: { channelId: 'UCsBjURrPoezykLs9EqgamOA' },
        thumbnails: {
          default: { url: 'https://example.com/default.jpg' },
          medium: { url: 'https://example.com/medium.jpg' },
          high: { url: 'https://example.com/high.jpg' },
        },
      },
    };

    expect(normalizeSubscriptionChannel(raw)).toEqual({
      id: 'UCsBjURrPoezykLs9EqgamOA',
      youtubeChannelId: 'UCsBjURrPoezykLs9EqgamOA',
      title: 'Fireship',
      description: 'High-intensity code tutorials.',
      thumbnailUrl: 'https://example.com/high.jpg',
      topicTags: [],
    });
  });

  it('falls back to a lower-resolution thumbnail when higher ones are missing', () => {
    const raw: RawSubscriptionItem = {
      snippet: {
        title: 'Small Channel',
        description: '',
        resourceId: { channelId: 'UC123' },
        thumbnails: { default: { url: 'https://example.com/default.jpg' } },
      },
    };

    expect(normalizeSubscriptionChannel(raw).thumbnailUrl).toBe('https://example.com/default.jpg');
  });

  it('normalizes an empty description to undefined rather than an empty string', () => {
    const raw: RawSubscriptionItem = {
      snippet: {
        title: 'No Description Channel',
        description: '',
        resourceId: { channelId: 'UC456' },
        thumbnails: {},
      },
    };

    expect(normalizeSubscriptionChannel(raw).description).toBeUndefined();
  });
});

describe('extractUploadsPlaylistId', () => {
  it('extracts the uploads playlist id from a channels.list item', () => {
    const raw: RawChannelItem = {
      id: 'UCsBjURrPoezykLs9EqgamOA',
      contentDetails: { relatedPlaylists: { uploads: 'UUsBjURrPoezykLs9EqgamOA' } },
    };

    expect(extractUploadsPlaylistId(raw)).toBe('UUsBjURrPoezykLs9EqgamOA');
  });

  it('returns undefined when contentDetails is missing', () => {
    const raw: RawChannelItem = { id: 'UC123' };
    expect(extractUploadsPlaylistId(raw)).toBeUndefined();
  });
});

describe('normalizeVideoSummary', () => {
  it('normalizes a playlistItems.list item, preferring contentDetails.videoPublishedAt', () => {
    const raw: RawPlaylistItem = {
      snippet: {
        title: 'Everything Wrong With React',
        description: 'A deep dive.',
        publishedAt: '2026-01-01T00:00:00Z',
        thumbnails: { high: { url: 'https://example.com/video-high.jpg' } },
        videoOwnerChannelId: 'UCsBjURrPoezykLs9EqgamOA',
        channelId: 'UCsBjURrPoezykLs9EqgamOA',
      },
      contentDetails: {
        videoId: 'abc123',
        videoPublishedAt: '2026-01-02T12:00:00Z',
      },
    };

    expect(normalizeVideoSummary(raw, 'PT12M15S')).toEqual({
      id: 'abc123',
      youtubeVideoId: 'abc123',
      channelId: 'UCsBjURrPoezykLs9EqgamOA',
      title: 'Everything Wrong With React',
      description: 'A deep dive.',
      thumbnailUrl: 'https://example.com/video-high.jpg',
      publishedAt: '2026-01-02T12:00:00Z',
      duration: 'PT12M15S',
    });
  });

  it('falls back to snippet.channelId and snippet.publishedAt when videoOwnerChannelId/videoPublishedAt are absent', () => {
    const raw: RawPlaylistItem = {
      snippet: {
        title: 'Old-Style Upload',
        description: '',
        publishedAt: '2025-06-01T00:00:00Z',
        thumbnails: {},
        channelId: 'UC789',
      },
      contentDetails: { videoId: 'xyz789' },
    };

    const result = normalizeVideoSummary(raw);
    expect(result.channelId).toBe('UC789');
    expect(result.publishedAt).toBe('2025-06-01T00:00:00Z');
    expect(result.duration).toBeUndefined();
  });
});
