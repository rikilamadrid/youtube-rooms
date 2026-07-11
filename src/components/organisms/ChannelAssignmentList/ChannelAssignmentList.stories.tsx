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

export const WithCategoryTags: Story = {
  args: {
    channels: mockChannels.slice(0, 3),
    assignedChannelIds: [mockChannels[0].id],
    onAssign: fn(),
    onUnassign: fn(),
    categoryNamesByChannelId: new Map([
      [mockChannels[0].id, ['Science & Technology', 'Education']],
      [mockChannels[1].id, ['Gaming']],
    ]),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Science & Technology' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Gaming' })).toBeInTheDocument();
    await expect(canvas.getByRole('checkbox', { name: mockChannels[0].title })).toBeInTheDocument();
  },
};

export const FilterByCategory: Story = {
  args: {
    channels: mockChannels.slice(0, 3),
    assignedChannelIds: [],
    onAssign: fn(),
    onUnassign: fn(),
    categoryNamesByChannelId: new Map([
      [mockChannels[0].id, ['Science & Technology']],
      [mockChannels[1].id, ['Gaming']],
    ]),
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('checkbox', { name: mockChannels[0].title })).toBeInTheDocument();
    await expect(canvas.getByRole('checkbox', { name: mockChannels[1].title })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Gaming' }));

    await expect(canvas.getByRole('checkbox', { name: mockChannels[1].title })).toBeInTheDocument();
    await expect(canvas.queryByRole('checkbox', { name: mockChannels[0].title })).not.toBeInTheDocument();
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

export const FilterNarrowsResults: Story = {
  args: {
    channels: mockChannels,
    assignedChannelIds: [mockChannels[0].id],
    onAssign: fn(),
    onUnassign: fn(),
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Assigned' })).toBeInTheDocument();
    await userEvent.type(canvas.getByLabelText('Filter channels'), mockChannels[1].title);
    await expect(canvas.getByRole('checkbox', { name: mockChannels[1].title })).toBeInTheDocument();
    await expect(canvas.queryByRole('checkbox', { name: mockChannels[0].title })).not.toBeInTheDocument();
  },
};

export const FilterNoMatches: Story = {
  args: {
    channels: mockChannels.slice(0, 4),
    assignedChannelIds: [],
    onAssign: fn(),
    onUnassign: fn(),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Filter channels'), 'zzz-no-match');
    await expect(canvas.getByRole('heading', { name: "No channels match 'zzz-no-match'" })).toBeInTheDocument();
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
  },
};
