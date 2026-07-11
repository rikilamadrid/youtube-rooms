import type { WatchQueue } from '../types/queue';
import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';

export type QueueItem = {
  video: VideoSummary;
  channelTitle: string;
};

/** Builds an empty queue for a room that has never queued a video yet. */
export function emptyQueueForRoom(roomId: string): WatchQueue {
  return { id: `queue-${roomId}`, roomId, videoIds: [] };
}

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

/**
 * Marks `videoId` as the queue's active video, or clears it (pass
 * `undefined`) once the queue has finished playing through.
 */
export function setActiveVideo(queue: WatchQueue, videoId: string | undefined): WatchQueue {
  return { ...queue, activeVideoId: videoId };
}

/**
 * Returns the video id immediately after `currentVideoId` in queue order,
 * or `undefined` when `currentVideoId` isn't in the queue or is already its
 * last item — the signal to stop advancing.
 */
export function nextInQueue(queue: WatchQueue, currentVideoId: string): string | undefined {
  const currentIndex = queue.videoIds.indexOf(currentVideoId);
  if (currentIndex === -1) {
    return undefined;
  }

  return queue.videoIds[currentIndex + 1];
}

/**
 * Returns the video id immediately before `currentVideoId` in queue order,
 * or `undefined` when `currentVideoId` isn't in the queue or is already its
 * first item.
 */
export function prevInQueue(queue: WatchQueue, currentVideoId: string): string | undefined {
  const currentIndex = queue.videoIds.indexOf(currentVideoId);
  if (currentIndex <= 0) {
    return undefined;
  }

  return queue.videoIds[currentIndex - 1];
}

/**
 * Resolves a queue's `videoIds` to their videos (dropping any id that no
 * longer resolves) and attaches each video's channel title, preserving
 * queue order.
 */
export function resolveQueueItems(
  queue: WatchQueue,
  channels: SubscriptionChannel[],
  videos: VideoSummary[],
): QueueItem[] {
  const videoById = new Map(videos.map((video) => [video.id, video]));
  const channelTitleById = new Map(channels.map((channel) => [channel.id, channel.title]));

  return queue.videoIds
    .map((videoId) => videoById.get(videoId))
    .filter((video): video is VideoSummary => video !== undefined)
    .map((video) => ({
      video,
      channelTitle: channelTitleById.get(video.channelId) ?? 'Unknown channel',
    }));
}
