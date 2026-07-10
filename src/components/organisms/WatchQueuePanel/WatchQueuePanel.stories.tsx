import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { WatchQueue } from '../../../types/queue';
import type { WatchQueuePanelItem } from './WatchQueuePanel';
import { WatchQueuePanel } from './WatchQueuePanel';

function makeItem(index: number): WatchQueuePanelItem {
  return {
    video: {
      id: `video-${index}`,
      youtubeVideoId: `yt-${index}`,
      channelId: 'channel-1',
      title: `Video ${index}`,
      thumbnailUrl: `https://picsum.photos/seed/queue-video-${index}/480/270`,
      publishedAt: `2026-0${index}-01T00:00:00.000Z`,
      duration: 'PT12M34S',
    },
    channelTitle: 'Weeknight Cooking Club',
  };
}

const baseQueue: WatchQueue = {
  id: 'queue-1',
  roomId: 'room-1',
  videoIds: ['video-1', 'video-2', 'video-3'],
};

const meta: Meta<typeof WatchQueuePanel> = {
  title: 'Organisms/WatchQueuePanel',
  component: WatchQueuePanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onRemoveFromQueue: fn(),
    onSetActive: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WatchQueuePanel>;

export const Empty: Story = {
  args: {
    queue: { ...baseQueue, videoIds: [] },
    items: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Your queue is empty' })).toBeInTheDocument();
  },
};

export const SeveralItems: Story = {
  args: {
    queue: baseQueue,
    items: [makeItem(1), makeItem(2), makeItem(3)],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

export const WithActiveItem: Story = {
  args: {
    queue: { ...baseQueue, activeVideoId: 'video-2' },
    items: [makeItem(1), makeItem(2), makeItem(3)],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Video 2 is the active video' })).toBeDisabled();
  },
};

export const RemoveAndSetActive: Story = {
  args: {
    queue: baseQueue,
    items: [makeItem(1), makeItem(2)],
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Set Video 1 as active' }));
    await expect(args.onSetActive).toHaveBeenCalledWith('video-1');

    await userEvent.click(canvas.getByRole('button', { name: 'Remove Video 2 from queue' }));
    await expect(args.onRemoveFromQueue).toHaveBeenCalledWith('video-2');
  },
};
