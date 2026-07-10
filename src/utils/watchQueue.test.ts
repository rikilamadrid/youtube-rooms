import { describe, expect, it } from 'vitest';
import type { WatchQueue } from '../types/queue';
import { addToQueue, removeFromQueue, setActiveVideo } from './watchQueue';

function makeQueue(overrides: Partial<WatchQueue> = {}): WatchQueue {
  return {
    id: 'queue-1',
    roomId: 'room-1',
    videoIds: ['video-1', 'video-2'],
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
});
