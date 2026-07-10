import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mockRooms } from '../../data/mockRooms';
import { RoomDetailPage } from './RoomDetailPage';

function renderAtRoom(roomId: string) {
  return render(
    <MemoryRouter initialEntries={[`/rooms/${roomId}`]}>
      <Routes>
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RoomDetailPage', () => {
  it('renders the matching room name from the route param', () => {
    const room = mockRooms[0];
    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { name: room.name })).toBeInTheDocument();
  });

  it('renders a not-found message for an unknown room id', () => {
    renderAtRoom('room-does-not-exist');

    expect(screen.getByRole('heading', { name: 'Room not found' })).toBeInTheDocument();
  });
});
