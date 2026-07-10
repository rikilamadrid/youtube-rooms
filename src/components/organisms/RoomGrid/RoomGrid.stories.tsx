import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { Room } from '../../../types/room';
import { RoomGrid } from './RoomGrid';

function makeRoom(index: number, overrides: Partial<Room> = {}): Room {
  return {
    id: `room-${index}`,
    name: `Room ${index}`,
    description: 'Quick, low-effort dinners and meal-prep channels for busy weeknights.',
    channelIds: Array.from({ length: index % 5 }, (_, i) => `channel-${i}`),
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const meta: Meta<typeof RoomGrid> = {
  title: 'Organisms/RoomGrid',
  component: RoomGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof RoomGrid>;

export const Empty: Story = {
  args: {
    rooms: [],
    getHref: (room: Room) => `/rooms/${room.id}`,
    onCreateRoom: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No rooms yet' })).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Create your first room' }),
    ).toBeInTheDocument();
  },
};

export const EmptyWithoutCreateAction: Story = {
  args: {
    rooms: [],
    getHref: (room: Room) => `/rooms/${room.id}`,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No rooms yet' })).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const SingleRoom: Story = {
  args: {
    rooms: [makeRoom(1, { name: 'Weeknight Cooking' })],
    getHref: (room: Room) => `/rooms/${room.id}`,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: 'Open Weeknight Cooking room' })).toHaveAttribute(
      'href',
      '/rooms/room-1',
    );
  },
};

export const FewRooms: Story = {
  args: {
    rooms: [
      makeRoom(1, { name: 'Weeknight Cooking' }),
      makeRoom(2, { name: 'Deep Focus Coding' }),
      makeRoom(3, { name: 'Weekend Hikes' }),
    ],
    getHref: (room: Room) => `/rooms/${room.id}`,
  },
};

export const ManyRooms: Story = {
  args: {
    rooms: Array.from({ length: 14 }, (_, i) => makeRoom(i + 1)),
    getHref: (room: Room) => `/rooms/${room.id}`,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(14);
  },
};

export const AsButtons: Story = {
  args: {
    rooms: [makeRoom(1, { name: 'Weeknight Cooking' }), makeRoom(2, { name: 'Deep Focus Coding' })],
    onRoomSelect: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Open Weeknight Cooking room' });

    await userEvent.click(button);
    await expect(args.onRoomSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'room-1' }),
    );
  },
};
