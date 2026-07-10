import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Room } from '../../../types/room';
import { RoomGrid } from './RoomGrid';

function makeRooms(count: number): Room[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `room-${i + 1}`,
    name: `Room ${i + 1}`,
    channelIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }));
}

describe('RoomGrid', () => {
  it('renders a RoomCard link per room', () => {
    render(<RoomGrid rooms={makeRooms(3)} getHref={(room) => `/rooms/${room.id}`} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Open Room 1 room' })).toHaveAttribute(
      'href',
      '/rooms/room-1',
    );
  });

  it('renders a RoomCard button per room when onRoomSelect is given instead of getHref', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<RoomGrid rooms={makeRooms(2)} onRoomSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: 'Open Room 1 room' }));

    expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'room-1' }));
  });

  it('renders a single room without crashing', () => {
    render(<RoomGrid rooms={makeRooms(1)} getHref={(room) => `/rooms/${room.id}`} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('renders many rooms without crashing', () => {
    render(<RoomGrid rooms={makeRooms(14)} getHref={(room) => `/rooms/${room.id}`} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(14);
  });

  it('renders EmptyState with "no rooms yet" copy when given an empty array', () => {
    render(<RoomGrid rooms={[]} getHref={(room) => `/rooms/${room.id}`} />);

    expect(screen.getByRole('heading', { name: 'No rooms yet' })).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('shows the create-room action in the empty state only when onCreateRoom is given', () => {
    const handleCreate = vi.fn();
    const { rerender } = render(
      <RoomGrid rooms={[]} getHref={(room) => `/rooms/${room.id}`} />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <RoomGrid rooms={[]} getHref={(room) => `/rooms/${room.id}`} onCreateRoom={handleCreate} />,
    );

    expect(screen.getByRole('button', { name: 'Create your first room' })).toBeInTheDocument();
  });
});
