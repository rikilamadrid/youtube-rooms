import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../../components/atoms/Badge/Badge';
import { VideoFeed } from '../../components/organisms/VideoFeed/VideoFeed';
import { WatchQueuePanel } from '../../components/organisms/WatchQueuePanel/WatchQueuePanel';
import { mockChannels } from '../../data/mockChannels';
import { mockQueues } from '../../data/mockQueues';
import { mockRooms } from '../../data/mockRooms';
import { mockVideos } from '../../data/mockVideos';
import type { WatchQueue } from '../../types/queue';
import { resolveRoomVideoFeed } from '../../utils/resolveRoomVideoFeed';
import { addToQueue, removeFromQueue, setActiveVideo } from '../../utils/watchQueue';
import './RoomDetailPage.css';

function initialQueueForRoom(roomId: string): WatchQueue {
  const existing = mockQueues.find((queue) => queue.roomId === roomId);
  return existing ?? { id: `queue-${roomId}`, roomId, videoIds: [] };
}

/**
 * Room detail route (`/rooms/:roomId`): the room's name/description/channel
 * count, its latest videos across assigned channels, and the room's watch
 * queue. Queue state is local to this page and seeded from `mockQueues`.
 */
export function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const room = mockRooms.find((candidate) => candidate.id === roomId);
  const [queue, setQueue] = useState<WatchQueue | null>(() => (room ? initialQueueForRoom(room.id) : null));

  if (!room || !queue) {
    return (
      <>
        <h1>Room not found</h1>
        <p>No room matches “{roomId}”.</p>
        <Link to="/">Back to rooms</Link>
      </>
    );
  }

  const channelCount = room.channelIds.length;
  const items = resolveRoomVideoFeed(room, mockChannels, mockVideos);
  const videoById = new Map(mockVideos.map((video) => [video.id, video]));
  const channelTitleById = new Map(mockChannels.map((channel) => [channel.id, channel.title]));

  const queueItems = queue.videoIds
    .map((videoId) => videoById.get(videoId))
    .filter((video): video is NonNullable<typeof video> => video !== undefined)
    .map((video) => ({
      video,
      channelTitle: channelTitleById.get(video.channelId) ?? 'Unknown channel',
    }));

  function handleAddToQueue(videoId: string) {
    setQueue((current) => (current ? addToQueue(current, videoId) : current));
  }

  function handleRemoveFromQueue(videoId: string) {
    setQueue((current) => (current ? removeFromQueue(current, videoId) : current));
  }

  function handleSetActive(videoId: string) {
    setQueue((current) => (current ? setActiveVideo(current, videoId) : current));
  }

  const emptyStateTitle =
    channelCount === 0 ? 'This room has no channels yet' : 'No recent videos';
  const emptyStateDescription =
    channelCount === 0
      ? 'Add channels to this room to see their latest videos here.'
      : "This room's channels haven't posted any videos yet.";

  return (
    <>
      <header className="sr-room-detail__header">
        <h1>{room.name}</h1>
        {room.description ? <p className="sr-room-detail__description">{room.description}</p> : null}
        <Badge tone={channelCount === 0 ? 'neutral' : 'accent'}>
          {channelCount === 0 ? 'No channels yet' : `${channelCount} channel${channelCount === 1 ? '' : 's'}`}
        </Badge>
      </header>
      <h2 className="sr-room-detail__feed-heading">Latest videos</h2>
      <VideoFeed
        items={items}
        onAddToQueue={handleAddToQueue}
        emptyStateTitle={emptyStateTitle}
        emptyStateDescription={emptyStateDescription}
      />
      <h2 className="sr-room-detail__queue-heading">Your queue</h2>
      <WatchQueuePanel
        queue={queue}
        items={queueItems}
        onRemoveFromQueue={handleRemoveFromQueue}
        onSetActive={handleSetActive}
      />
    </>
  );
}
