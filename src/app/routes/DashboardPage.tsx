import { useNavigate } from 'react-router-dom';
import { RoomGrid } from '../../components/organisms/RoomGrid/RoomGrid';
import { mockRooms } from '../../data/mockRooms';
import type { Room } from '../../types/room';

/**
 * Rooms dashboard (`/`). Thin composition of mock room data and `RoomGrid`;
 * navigation is delegated to the router rather than owned here.
 */
export function DashboardPage() {
  const navigate = useNavigate();

  function handleRoomSelect(room: Room) {
    navigate(`/rooms/${room.id}`);
  }

  return (
    <>
      <h1>Rooms</h1>
      <RoomGrid rooms={mockRooms} onRoomSelect={handleRoomSelect} />
    </>
  );
}
