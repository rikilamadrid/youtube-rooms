import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { RoomVideoFeedItem } from '../../../utils/resolveRoomVideoFeed';
import { VideoFeed } from './VideoFeed';

function makeItem(index: number, overrides: Partial<RoomVideoFeedItem['video']> = {}): RoomVideoFeedItem {
  return {
    video: {
      id: `video-${index}`,
      youtubeVideoId: `yt-${index}`,
      channelId: 'channel-1',
      title: `Video ${index}`,
      thumbnailUrl: `https://picsum.photos/seed/video-${index}/480/270`,
      publishedAt: `2026-0${index}-01T00:00:00.000Z`,
      duration: 'PT12M34S',
      ...overrides,
    },
    channelTitle: 'Weeknight Cooking Club',
  };
}

const meta: Meta<typeof VideoFeed> = {
  title: 'Organisms/VideoFeed',
  component: VideoFeed,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onAddToQueue: fn(),
    emptyStateTitle: 'No videos yet',
  },
};

export default meta;

type Story = StoryObj<typeof VideoFeed>;

export const Typical: Story = {
  args: {
    items: [makeItem(1), makeItem(2), makeItem(3)],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

export const SingleVideo: Story = {
  args: {
    items: [makeItem(1)],
  },
};

export const NoChannelsAssigned: Story = {
  args: {
    items: [],
    emptyStateTitle: 'This room has no channels yet',
    emptyStateDescription: 'Add channels to this room to see their latest videos here.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'This room has no channels yet' })).toBeInTheDocument();
  },
};

export const ChannelsWithNoVideos: Story = {
  args: {
    items: [],
    emptyStateTitle: 'No recent videos',
    emptyStateDescription: "This room's channels haven't posted anything recently.",
  },
};
