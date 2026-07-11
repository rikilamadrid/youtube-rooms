import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../../components/atoms/Badge/Badge';
import { Button } from '../../components/atoms/Button/Button';
import { RoomFormDialog } from '../../components/molecules/RoomFormDialog/RoomFormDialog';
import { ChannelAssignmentList } from '../../components/organisms/ChannelAssignmentList/ChannelAssignmentList';
import { VideoFeed } from '../../components/organisms/VideoFeed/VideoFeed';
import { WatchQueuePanel } from '../../components/organisms/WatchQueuePanel/WatchQueuePanel';
import { useRooms } from '../../hooks/useRooms';
import { useYoutubeSyncContext } from '../../hooks/YoutubeSyncContext';
import type { WatchQueue } from '../../types/queue';
import { resolveRoomVideoFeed } from '../../utils/resolveRoomVideoFeed';
import { addToQueue, removeFromQueue, setActiveVideo } from '../../utils/watchQueue';
import './RoomDetailPage.css';

function emptyQueueForRoom(roomId: string): WatchQueue {
  return { id: `queue-${roomId}`, roomId, videoIds: [] };
}

/**
 * Room detail route (`/rooms/:roomId`): the room's name/description/channel
 * count, controls to edit or delete the room and assign synced channels to
 * it, its latest videos across assigned channels (sourced from
 * `useYoutubeSyncContext()`), and the room's watch queue. Queue state is
 * local to this page and always starts empty.
 */
export function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { rooms, updateRoom, deleteRoom, assignChannel, unassignChannel } = useRooms();
  const { channels, videos } = useYoutubeSyncContext();
  const room = rooms.find((candidate) => candidate.id === roomId);
  const [queue, setQueue] = useState<WatchQueue | null>(() =>
    room ? emptyQueueForRoom(room.id) : null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

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
  const items = resolveRoomVideoFeed(room, channels, videos);
  const videoById = new Map(videos.map((video) => [video.id, video]));
  const channelTitleById = new Map(channels.map((channel) => [channel.id, channel.title]));

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

  function handleEditRoom(input: { name: string; description?: string }) {
    updateRoom(room!.id, input);
    setIsEditOpen(false);
  }

  function handleDeleteRoom() {
    if (!window.confirm(`Delete “${room!.name}”? This can’t be undone.`)) {
      return;
    }
    deleteRoom(room!.id);
    navigate('/');
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
        <div className="sr-room-detail__heading-row">
          <h1>{room.name}</h1>
          <div className="sr-room-detail__actions">
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
              Edit room
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeleteRoom}>
              Delete room
            </Button>
          </div>
        </div>
        {room.description ? <p className="sr-room-detail__description">{room.description}</p> : null}
        <Badge tone={channelCount === 0 ? 'neutral' : 'accent'}>
          {channelCount === 0 ? 'No channels yet' : `${channelCount} channel${channelCount === 1 ? '' : 's'}`}
        </Badge>
      </header>
      <h2 className="sr-room-detail__channels-heading">Channels</h2>
      <ChannelAssignmentList
        channels={channels}
        assignedChannelIds={room.channelIds}
        onAssign={(channelId) => assignChannel(room.id, channelId)}
        onUnassign={(channelId) => unassignChannel(room.id, channelId)}
        onConnectAccount={() => navigate('/settings')}
      />
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
      <RoomFormDialog
        open={isEditOpen}
        mode="edit"
        initialValues={{ name: room.name, description: room.description }}
        onSubmit={handleEditRoom}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
