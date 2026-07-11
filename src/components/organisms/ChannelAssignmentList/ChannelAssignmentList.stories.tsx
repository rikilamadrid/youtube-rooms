import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { mockChannels } from '../../../data/mockChannels';
import { ChannelAssignmentList } from './ChannelAssignmentList';

const meta: Meta<typeof ChannelAssignmentList> = {
  title: 'Organisms/ChannelAssignmentList',
  component: ChannelAssignmentList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof ChannelAssignmentList>;

export const NoneAssigned: Story = {
  args: {
    channels: mockChannels.slice(0, 4),
    assignedChannelIds: [],
    onAssign: fn(),
    onUnassign: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: mockChannels[0].title })).not.toBeChecked();
  },
};

export const SomeAssigned: Story = {
  args: {
    channels: mockChannels.slice(0, 4),
    assignedChannelIds: [mockChannels[0].id, mockChannels[2].id],
    onAssign: fn(),
    onUnassign: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: mockChannels[0].title })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: mockChannels[1].title })).not.toBeChecked();
  },
};

export const NoSyncedChannels: Story = {
  args: {
    channels: [],
    assignedChannelIds: [],
    onAssign: fn(),
    onUnassign: fn(),
    onConnectAccount: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No synced channels yet' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Go to Settings' })).toBeInTheDocument();
  },
};

export const NoSyncedChannelsWithoutAction: Story = {
  args: {
    channels: [],
    assignedChannelIds: [],
    onAssign: fn(),
    onUnassign: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const ToggleAssignment: Story = {
  args: {
    channels: mockChannels.slice(0, 2),
    assignedChannelIds: [],
    onAssign: fn(),
    onUnassign: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: mockChannels[0].title }));
    await expect(args.onAssign).toHaveBeenCalledWith(mockChannels[0].id);
  },
};
