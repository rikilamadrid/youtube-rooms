import type { Room } from '../types/room';
import type { SubscriptionChannel } from '../types/channel';
import type { VideoSummary } from '../types/video';

export type RoomVideoFeedItem = {
  video: VideoSummary;
  channelTitle: string;
};

/**
 * Resolves a room's `channelIds` to their videos, attaches each video's
 * channel title, and sorts the result by `publishedAt` descending (most
 * recent first).
 */
export function resolveRoomVideoFeed(
  room: Room,
  channels: SubscriptionChannel[],
  videos: VideoSummary[],
): RoomVideoFeedItem[] {
  const roomChannelIds = new Set(room.channelIds);
  const channelTitleById = new Map(channels.map((channel) => [channel.id, channel.title]));

  return videos
    .filter((video) => roomChannelIds.has(video.channelId))
    .map((video) => ({
      video,
      channelTitle: channelTitleById.get(video.channelId) ?? 'Unknown channel',
    }))
    .sort((a, b) => Date.parse(b.video.publishedAt) - Date.parse(a.video.publishedAt));
}
