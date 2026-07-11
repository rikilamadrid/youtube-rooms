import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import { RoomFormDialog } from '../../components/molecules/RoomFormDialog/RoomFormDialog';
import { RoomGrid } from '../../components/organisms/RoomGrid/RoomGrid';
import { useRooms } from '../../hooks/useRooms';
import type { Room } from '../../types/room';
import './DashboardPage.css';

/**
 * Rooms dashboard (`/`). Composes the locally-persisted room list from
 * `useRooms()` with `RoomGrid`; navigation is delegated to the router.
 * Room creation happens here via `RoomFormDialog`.
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { rooms, createRoom } = useRooms();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function handleRoomSelect(room: Room) {
    navigate(`/rooms/${room.id}`);
  }

  function handleCreateRoom(input: { name: string; description?: string }) {
    const room = createRoom(input);
    setIsCreateOpen(false);
    navigate(`/rooms/${room.id}`);
  }

  return (
    <>
      <header className="sr-dashboard__header">
        <h1>Rooms</h1>
        {rooms.length > 0 ? <Button onClick={() => setIsCreateOpen(true)}>New room</Button> : null}
      </header>
      <RoomGrid rooms={rooms} onRoomSelect={handleRoomSelect} onCreateRoom={() => setIsCreateOpen(true)} />
      <RoomFormDialog
        open={isCreateOpen}
        mode="create"
        onSubmit={handleCreateRoom}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
