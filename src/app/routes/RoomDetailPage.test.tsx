import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mockChannels } from '../../data/mockChannels';
import { mockQueues } from '../../data/mockQueues';
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
    const feed = screen.getByRole('list', { name: 'Latest videos' });
    const items = within(feed)
      .getAllByRole('listitem')
      .map((item) => item.textContent);

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

  it('seeds the queue panel from mockQueues for a room with an existing queue', () => {
    const room = mockRooms.find((candidate) => candidate.id === 'room-coding')!;
    const seededQueue = mockQueues.find((candidate) => candidate.roomId === room.id)!;
    renderAtRoom(room.id);

    const queuePanel = screen.getByRole('list', { name: 'Your queue' });
    expect(within(queuePanel).getAllByRole('listitem')).toHaveLength(seededQueue.videoIds.length);
  });

  it('renders an empty queue state for a room with no seeded queue', () => {
    const room = mockRooms.find((candidate) => candidate.id === 'room-someday')!;
    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { name: 'Your queue is empty' })).toBeInTheDocument();
  });

  it('adds, removes, and sets an active video in the queue end to end', async () => {
    const user = userEvent.setup();
    const room = mockRooms.find((candidate) => candidate.id === 'room-cooking')!;
    const roomVideos = mockVideos
      .filter((video) => room.channelIds.includes(video.channelId))
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    const targetVideo = roomVideos[0];
    renderAtRoom(room.id);

    const feed = screen.getByRole('list', { name: 'Latest videos' });
    const addButton = within(feed).getByRole('button', { name: `Add ${targetVideo.title} to queue` });

    await user.click(addButton);
    await user.click(addButton);

    const queuePanel = screen.getByRole('list', { name: 'Your queue' });
    expect(within(queuePanel).getAllByText(targetVideo.title)).toHaveLength(1);

    await user.click(within(queuePanel).getByRole('button', { name: `Set ${targetVideo.title} as active` }));
    expect(
      within(queuePanel).getByRole('button', { name: `${targetVideo.title} is the active video` }),
    ).toBeDisabled();

    await user.click(within(queuePanel).getByRole('button', { name: `Remove ${targetVideo.title} from queue` }));
    expect(within(queuePanel).queryByText(targetVideo.title)).not.toBeInTheDocument();
  });
});
