import { describe, expect, it } from 'vitest';
import type { WatchQueue } from '../types/queue';
import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';
import {
  addToQueue,
  emptyQueueForRoom,
  nextInQueue,
  prevInQueue,
  removeFromQueue,
  resolveQueueItems,
  setActiveVideo,
} from './watchQueue';

function makeQueue(overrides: Partial<WatchQueue> = {}): WatchQueue {
  return {
    id: 'queue-1',
    roomId: 'room-1',
    videoIds: ['video-1', 'video-2'],
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

describe('addToQueue', () => {
  it('appends a new video id', () => {
    const queue = makeQueue();
    expect(addToQueue(queue, 'video-3').videoIds).toEqual(['video-1', 'video-2', 'video-3']);
  });

  it('does not add a duplicate video id', () => {
    const queue = makeQueue();
    expect(addToQueue(queue, 'video-1').videoIds).toEqual(['video-1', 'video-2']);
  });

  it('adds to an empty queue', () => {
    const queue = makeQueue({ videoIds: [] });
    expect(addToQueue(queue, 'video-1').videoIds).toEqual(['video-1']);
  });
});

describe('removeFromQueue', () => {
  it('removes a video id', () => {
    const queue = makeQueue();
    expect(removeFromQueue(queue, 'video-1').videoIds).toEqual(['video-2']);
  });

  it('clears activeVideoId when the active video is removed', () => {
    const queue = makeQueue({ activeVideoId: 'video-1' });
    expect(removeFromQueue(queue, 'video-1').activeVideoId).toBeUndefined();
  });

  it('preserves activeVideoId when a different video is removed', () => {
    const queue = makeQueue({ activeVideoId: 'video-2' });
    expect(removeFromQueue(queue, 'video-1').activeVideoId).toBe('video-2');
  });

  it('is a no-op when the video id is not in the queue', () => {
    const queue = makeQueue();
    expect(removeFromQueue(queue, 'video-99').videoIds).toEqual(['video-1', 'video-2']);
  });
});

describe('setActiveVideo', () => {
  it('sets the active video id', () => {
    const queue = makeQueue();
    expect(setActiveVideo(queue, 'video-2').activeVideoId).toBe('video-2');
  });

  it('overwrites a previously active video id', () => {
    const queue = makeQueue({ activeVideoId: 'video-1' });
    expect(setActiveVideo(queue, 'video-2').activeVideoId).toBe('video-2');
  });

  it('clears the active video id when passed undefined', () => {
    const queue = makeQueue({ activeVideoId: 'video-1' });
    expect(setActiveVideo(queue, undefined).activeVideoId).toBeUndefined();
  });
});

describe('nextInQueue', () => {
  it('returns the video id after the current one', () => {
    const queue = makeQueue({ videoIds: ['video-1', 'video-2', 'video-3'] });
    expect(nextInQueue(queue, 'video-1')).toBe('video-2');
  });

  it('returns undefined when the current video is the last item', () => {
    const queue = makeQueue({ videoIds: ['video-1', 'video-2'] });
    expect(nextInQueue(queue, 'video-2')).toBeUndefined();
  });

  it('returns undefined when the current video is not in the queue', () => {
    const queue = makeQueue();
    expect(nextInQueue(queue, 'video-99')).toBeUndefined();
  });

  it('returns undefined for an empty queue', () => {
    const queue = makeQueue({ videoIds: [] });
    expect(nextInQueue(queue, 'video-1')).toBeUndefined();
  });
});

describe('prevInQueue', () => {
  it('returns the video id before the current one', () => {
    const queue = makeQueue({ videoIds: ['video-1', 'video-2', 'video-3'] });
    expect(prevInQueue(queue, 'video-2')).toBe('video-1');
  });

  it('returns undefined when the current video is the first item', () => {
    const queue = makeQueue({ videoIds: ['video-1', 'video-2'] });
    expect(prevInQueue(queue, 'video-1')).toBeUndefined();
  });

  it('returns undefined when the current video is not in the queue', () => {
    const queue = makeQueue();
    expect(prevInQueue(queue, 'video-99')).toBeUndefined();
  });

  it('returns undefined for an empty queue', () => {
    const queue = makeQueue({ videoIds: [] });
    expect(prevInQueue(queue, 'video-1')).toBeUndefined();
  });
});

describe('emptyQueueForRoom', () => {
  it('builds an empty queue scoped to the room', () => {
    expect(emptyQueueForRoom('room-42')).toEqual({
      id: 'queue-room-42',
      roomId: 'room-42',
      videoIds: [],
    });
  });
});

describe('resolveQueueItems', () => {
  it('resolves queued video ids to videos with channel titles, in queue order', () => {
    const queue = makeQueue({ videoIds: ['video-2', 'video-1'] });
    const channels = [makeChannel({ id: 'channel-1', title: 'Fireship' })];
    const videos = [
      makeVideo({ id: 'video-1', channelId: 'channel-1' }),
      makeVideo({ id: 'video-2', channelId: 'channel-1' }),
    ];

    const result = resolveQueueItems(queue, channels, videos);

    expect(result.map((item) => item.video.id)).toEqual(['video-2', 'video-1']);
    expect(result[0].channelTitle).toBe('Fireship');
  });

  it('drops queued ids that no longer resolve to a video', () => {
    const queue = makeQueue({ videoIds: ['video-1', 'video-missing'] });
    const channels = [makeChannel()];
    const videos = [makeVideo({ id: 'video-1' })];

    const result = resolveQueueItems(queue, channels, videos);

    expect(result.map((item) => item.video.id)).toEqual(['video-1']);
  });

  it('falls back to "Unknown channel" when the channel cannot be resolved', () => {
    const queue = makeQueue({ videoIds: ['video-1'] });
    const videos = [makeVideo({ id: 'video-1', channelId: 'missing-channel' })];

    const result = resolveQueueItems(queue, [], videos);

    expect(result[0].channelTitle).toBe('Unknown channel');
  });

  it('returns an empty array for an empty queue', () => {
    const queue = makeQueue({ videoIds: [] });
    expect(resolveQueueItems(queue, [makeChannel()], [makeVideo()])).toEqual([]);
  });
});
