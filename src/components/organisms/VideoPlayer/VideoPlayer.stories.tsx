import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { VideoPlayer } from './VideoPlayer';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Organisms/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onEnded: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof VideoPlayer>;

/**
 * Loads the real YouTube IFrame Player API against a public demo video, the
 * same way it does in the app — there's no mock embed to substitute for the
 * genuine third-party player. Next/previous are omitted, so those controls
 * render disabled.
 */
export const Playing: Story = {
  args: {
    youtubeVideoId: 'M7lc1UVf-VE',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('video-player')).toBeInTheDocument();
  },
};

/**
 * With a multi-item queue behind it, next/previous become active — hover or
 * tab into the player to reveal the control bar.
 */
export const WithQueueNavigation: Story = {
  args: {
    youtubeVideoId: 'M7lc1UVf-VE',
    onNext: fn(),
    onPrevious: fn(),
    hasNext: true,
    hasPrevious: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Play next video' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Play previous video' })).toBeEnabled();
  },
};
