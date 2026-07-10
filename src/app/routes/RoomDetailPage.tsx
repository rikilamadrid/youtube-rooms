import { Link, useParams } from 'react-router-dom';
import { mockRooms } from '../../data/mockRooms';

/**
 * Placeholder room detail route (`/rooms/:roomId`). Proves navigation from
 * the dashboard works; the real detail UI lands in feature 13.
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

  return (
    <>
      <h1>{room.name}</h1>
      <p>Room detail coming soon.</p>
      <Link to="/">Back to rooms</Link>
    </>
  );
}
