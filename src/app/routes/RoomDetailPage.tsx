import { Link, useParams } from 'react-router-dom';
import { Badge } from '../../components/atoms/Badge/Badge';
import { VideoFeed } from '../../components/organisms/VideoFeed/VideoFeed';
import { mockChannels } from '../../data/mockChannels';
import { mockRooms } from '../../data/mockRooms';
import { mockVideos } from '../../data/mockVideos';
import { resolveRoomVideoFeed } from '../../utils/resolveRoomVideoFeed';
import './RoomDetailPage.css';

/**
 * Room detail route (`/rooms/:roomId`): the room's name/description/channel
 * count, and its latest videos across assigned channels, sorted by
 * recency. "Add to queue" is wired to a console-logged placeholder —
 * the real watch queue lands in feature 14.
 */
export function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const room = mockRooms.find((candidate) => candidate.id === roomId);

  if (!room) {
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

  function handleAddToQueue(videoId: string) {
    console.log('Add to queue (placeholder):', videoId);
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
    </>
  );
}
