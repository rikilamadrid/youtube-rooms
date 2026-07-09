import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import type { Room } from '../../../types/room';
import { RoomCard } from './RoomCard';

const baseRoom: Room = {
  id: 'room-1',
  name: 'Weeknight Cooking',
  description: 'Quick, low-effort dinners and meal-prep channels for busy weeknights.',
  channelIds: ['channel-1', 'channel-2', 'channel-3'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const meta: Meta<typeof RoomCard> = {
  title: 'Molecules/RoomCard',
  component: RoomCard,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof RoomCard>;

function Frame({ children }: { children: ReactNode }) {
  return <div style={{ width: '20rem' }}>{children}</div>;
}

export const Typical: Story = {
  render: () => (
    <Frame>
      <RoomCard room={baseRoom} href="#" />
    </Frame>
  ),
};

export const EmptyChannelRoom: Story = {
  render: () => (
    <Frame>
      <RoomCard
        room={{
          ...baseRoom,
          id: 'room-2',
          name: 'New Room',
          description: 'Just created — add some channels to get started.',
          channelIds: [],
        }}
        href="#"
      />
    </Frame>
  ),
};

export const LongNameAndDescription: Story = {
  render: () => (
    <Frame>
      <RoomCard
        room={{
          ...baseRoom,
          id: 'room-3',
          name: 'An Extremely Long Room Name That Should Wrap Across Multiple Lines Gracefully',
          description:
            'This description goes on for quite a while to demonstrate how the RoomCard clamps longer supporting text instead of letting it overflow the card or break the layout of surrounding elements.',
        }}
        href="#"
      />
    </Frame>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Frame>
      <RoomCard room={{ ...baseRoom, id: 'room-4', iconName: 'cooking' }} href="#" />
    </Frame>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Frame>
      <RoomCard room={{ ...baseRoom, id: 'room-5', iconName: undefined }} href="#" />
    </Frame>
  ),
};

export const AsButton: Story = {
  render: () => (
    <Frame>
      <RoomCard room={baseRoom} onClick={() => {}} />
    </Frame>
  ),
};
