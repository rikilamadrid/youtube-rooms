import type { WatchQueue } from '../types/queue';

/**
 * Appends `videoId` to the queue's `videoIds`, de-duplicated — adding a
 * video already in the queue is a no-op rather than a duplicate entry.
 */
export function addToQueue(queue: WatchQueue, videoId: string): WatchQueue {
  if (queue.videoIds.includes(videoId)) {
    return queue;
  }

  return { ...queue, videoIds: [...queue.videoIds, videoId] };
}

/**
 * Removes `videoId` from the queue. Clears `activeVideoId` if the removed
 * video was the active one, so the queue never points at a video it no
 * longer contains.
 */
export function removeFromQueue(queue: WatchQueue, videoId: string): WatchQueue {
  const videoIds = queue.videoIds.filter((id) => id !== videoId);
  const activeVideoId = queue.activeVideoId === videoId ? undefined : queue.activeVideoId;

  return { ...queue, videoIds, activeVideoId };
}

/** Marks `videoId` as the queue's active video. */
export function setActiveVideo(queue: WatchQueue, videoId: string): WatchQueue {
  return { ...queue, activeVideoId: videoId };
}
