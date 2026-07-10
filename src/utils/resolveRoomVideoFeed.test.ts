import { describe, expect, it } from 'vitest';
import { resolveRoomVideoFeed } from './resolveRoomVideoFeed';
import type { Room } from '../types/room';
import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'room-1',
    name: 'Coding',
    channelIds: ['channel-1'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeChannel(overrides: Partial<SubscriptionChannel> = {}): SubscriptionChannel {
  return {
    id: 'channel-1',
    youtubeChannelId: 'UC-channel-1',
    title: 'Channel One',
    topicTags: [],
    ...overrides,
  };
}

function makeVideo(overrides: Partial<VideoSummary> = {}): VideoSummary {
  return {
    id: 'video-1',
    youtubeVideoId: 'yt-video-1',
    channelId: 'channel-1',
    title: 'Video One',
    publishedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('resolveRoomVideoFeed', () => {
  it('resolves videos for the room’s channels, sorted by publishedAt descending', () => {
    const room = makeRoom({ channelIds: ['channel-1'] });
    const channels = [makeChannel()];
    const videos = [
      makeVideo({ id: 'video-old', publishedAt: '2026-01-01T00:00:00.000Z' }),
      makeVideo({ id: 'video-new', publishedAt: '2026-03-01T00:00:00.000Z' }),
      makeVideo({ id: 'video-mid', publishedAt: '2026-02-01T00:00:00.000Z' }),
    ];

    const result = resolveRoomVideoFeed(room, channels, videos);

    expect(result.map((item) => item.video.id)).toEqual(['video-new', 'video-mid', 'video-old']);
  });

  it('attaches the resolved channel title to each item', () => {
    const room = makeRoom({ channelIds: ['channel-1'] });
    const channels = [makeChannel({ id: 'channel-1', title: 'Fireship' })];
    const videos = [makeVideo({ channelId: 'channel-1' })];

    const result = resolveRoomVideoFeed(room, channels, videos);

    expect(result[0].channelTitle).toBe('Fireship');
  });

  it('excludes videos from channels not assigned to the room', () => {
    const room = makeRoom({ channelIds: ['channel-1'] });
    const channels = [makeChannel({ id: 'channel-1' }), makeChannel({ id: 'channel-2', title: 'Other' })];
    const videos = [
      makeVideo({ id: 'video-in-room', channelId: 'channel-1' }),
      makeVideo({ id: 'video-other-room', channelId: 'channel-2' }),
    ];

    const result = resolveRoomVideoFeed(room, channels, videos);

    expect(result.map((item) => item.video.id)).toEqual(['video-in-room']);
  });

  it('returns an empty array when the room has no channels', () => {
    const room = makeRoom({ channelIds: [] });
    const channels = [makeChannel()];
    const videos = [makeVideo()];

    expect(resolveRoomVideoFeed(room, channels, videos)).toEqual([]);
  });

  it('returns an empty array when the room’s channels have no videos', () => {
    const room = makeRoom({ channelIds: ['channel-1'] });
    const channels = [makeChannel()];
    const videos: VideoSummary[] = [];

    expect(resolveRoomVideoFeed(room, channels, videos)).toEqual([]);
  });

  it('resolves a single video', () => {
    const room = makeRoom({ channelIds: ['channel-1'] });
    const channels = [makeChannel()];
    const videos = [makeVideo({ id: 'only-video' })];

    const result = resolveRoomVideoFeed(room, channels, videos);

    expect(result).toHaveLength(1);
    expect(result[0].video.id).toBe('only-video');
  });
});
