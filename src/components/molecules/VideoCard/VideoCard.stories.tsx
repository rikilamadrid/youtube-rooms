import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { VideoSummary } from '../../../types/video';
import { VideoCard } from './VideoCard';

const baseVideo: VideoSummary = {
  id: 'video-1',
  youtubeVideoId: 'yt-1',
  channelId: 'channel-1',
  title: 'Weeknight Pasta in 20 Minutes',
  description: 'A quick, low-effort pasta recipe for busy weeknights.',
  thumbnailUrl: 'https://picsum.photos/seed/video-1/320/180',
  publishedAt: '2024-01-15T00:00:00.000Z',
  duration: 'PT12M34S',
};

const meta: Meta<typeof VideoCard> = {
  title: 'Molecules/VideoCard',
  component: VideoCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    channelTitle: 'Weeknight Cooking Club',
    onAddToQueue: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '20rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof VideoCard>;

export const Typical: Story = {
  args: { video: baseVideo, onAddToQueue: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', {
      name: 'Add Weeknight Pasta in 20 Minutes to queue',
    });

    await userEvent.click(button);

    await expect(args.onAddToQueue).toHaveBeenCalledTimes(1);
    await expect(args.onAddToQueue).toHaveBeenCalledWith('video-1');
  },
};

export const Watched: Story = {
  args: { video: { ...baseVideo, id: 'video-2', watched: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Watched')).toBeInTheDocument();
  },
};

export const MissingThumbnail: Story = {
  args: { video: { ...baseVideo, id: 'video-3', thumbnailUrl: undefined } },
};

export const MissingDuration: Story = {
  args: { video: { ...baseVideo, id: 'video-4', duration: undefined } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/^\d+:\d{2}$/)).not.toBeInTheDocument();
    await expect(canvas.getByText('Weeknight Cooking Club')).toBeInTheDocument();
  },
};

export const LongTitle: Story = {
  args: {
    video: {
      ...baseVideo,
      id: 'video-5',
      title:
        'An Extremely Long Video Title About A Thirty Ingredient Weeknight Pasta Recipe That Should Wrap Gracefully',
    },
  },
};

export const QueueRow: Story = {
  args: {
    video: { ...baseVideo, id: 'video-7' },
    onAddToQueue: undefined,
    onRemoveFromQueue: fn(),
    onSetActive: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.queryByRole('button', { name: /add .* to queue/i })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Set Weeknight Pasta in 20 Minutes as active' }));
    await expect(args.onSetActive).toHaveBeenCalledWith('video-7');

    await userEvent.click(canvas.getByRole('button', { name: 'Remove Weeknight Pasta in 20 Minutes from queue' }));
    await expect(args.onRemoveFromQueue).toHaveBeenCalledWith('video-7');
  },
};

export const QueueRowActive: Story = {
  args: {
    video: { ...baseVideo, id: 'video-8' },
    onAddToQueue: undefined,
    onRemoveFromQueue: fn(),
    onSetActive: fn(),
    isActive: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Weeknight Pasta in 20 Minutes is the active video' })).toBeDisabled();
  },
};

export const KeyboardActivation: Story = {
  args: { video: { ...baseVideo, id: 'video-6' }, onAddToQueue: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', {
      name: 'Add Weeknight Pasta in 20 Minutes to queue',
    });

    button.focus();
    await userEvent.keyboard('{Enter}');

    await expect(args.onAddToQueue).toHaveBeenCalledWith('video-6');
  },
};
