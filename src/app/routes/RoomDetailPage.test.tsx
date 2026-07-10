import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mockChannels } from '../../data/mockChannels';
import { mockRooms } from '../../data/mockRooms';
import { mockVideos } from '../../data/mockVideos';
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
  it('renders the matching room name, description, and sorted videos', () => {
    const room = mockRooms.find((candidate) => candidate.id === 'room-coding')!;
    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { level: 1, name: room.name })).toBeInTheDocument();
    expect(screen.getByText(room.description!)).toBeInTheDocument();

    const roomVideos = mockVideos
      .filter((video) => room.channelIds.includes(video.channelId))
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);

    roomVideos.forEach((video, index) => {
      expect(items[index]).toContain(video.title);
    });
  });

  it('renders a not-found message for an unknown room id', () => {
    renderAtRoom('room-does-not-exist');

    expect(screen.getByRole('heading', { name: 'Room not found' })).toBeInTheDocument();
  });

  it('renders a distinct empty state for a room with no channels', () => {
    const room = mockRooms.find((candidate) => candidate.id === 'room-someday')!;
    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { name: 'This room has no channels yet' })).toBeInTheDocument();
    expect(screen.getByText('No channels yet')).toBeInTheDocument();
  });

  it('renders a distinct empty state for a room whose channels have no videos', () => {
    const room = mockRooms.find((candidate) => candidate.id === 'room-jazz-theory')!;
    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { name: 'No recent videos' })).toBeInTheDocument();
  });

  it('resolves and renders a channel title for its videos', () => {
    const room = mockRooms.find((candidate) => candidate.id === 'room-coding')!;
    renderAtRoom(room.id);

    const channel = mockChannels.find((candidate) => candidate.id === room.channelIds[0])!;
    expect(screen.getAllByText(channel.title).length).toBeGreaterThan(0);
  });
});
