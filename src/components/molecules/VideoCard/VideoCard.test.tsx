import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { VideoSummary } from '../../../types/video';
import { VideoCard } from './VideoCard';

const video: VideoSummary = {
  id: 'video-1',
  youtubeVideoId: 'yt-1',
  channelId: 'channel-1',
  title: 'Weeknight Pasta in 20 Minutes',
  description: 'A quick, low-effort pasta recipe for busy weeknights.',
  thumbnailUrl: 'https://picsum.photos/seed/video-1/320/180',
  publishedAt: '2024-01-15T00:00:00.000Z',
  duration: 'PT12M34S',
};

describe('VideoCard', () => {
  it('renders title, channel name, published date, and duration', () => {
    render(
      <VideoCard video={video} channelTitle="Weeknight Cooking Club" onAddToQueue={vi.fn()} />,
    );

    expect(screen.getByText('Weeknight Pasta in 20 Minutes')).toBeInTheDocument();
    expect(screen.getByText('Weeknight Cooking Club')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('12:34')).toBeInTheDocument();
  });

  it('renders a watched badge only when the video is watched', () => {
    const { rerender } = render(
      <VideoCard video={video} channelTitle="Weeknight Cooking Club" onAddToQueue={vi.fn()} />,
    );

    expect(screen.queryByText('Watched')).not.toBeInTheDocument();

    rerender(
      <VideoCard
        video={{ ...video, watched: true }}
        channelTitle="Weeknight Cooking Club"
        onAddToQueue={vi.fn()}
      />,
    );

    expect(screen.getByText('Watched')).toBeInTheDocument();
  });

  it('renders the thumbnail as decorative when present', () => {
    const { container } = render(
      <VideoCard video={video} channelTitle="Weeknight Cooking Club" onAddToQueue={vi.fn()} />,
    );

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('renders a decorative fallback when the thumbnail is missing', () => {
    const { container } = render(
      <VideoCard
        video={{ ...video, thumbnailUrl: undefined }}
        channelTitle="Weeknight Cooking Club"
        onAddToQueue={vi.fn()}
      />,
    );

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('omits the duration text when duration is missing', () => {
    render(
      <VideoCard
        video={{ ...video, duration: undefined }}
        channelTitle="Weeknight Cooking Club"
        onAddToQueue={vi.fn()}
      />,
    );

    expect(screen.queryByText('12:34')).not.toBeInTheDocument();
  });

  it('gives the action button a video-specific accessible name', () => {
    render(
      <VideoCard video={video} channelTitle="Weeknight Cooking Club" onAddToQueue={vi.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: 'Add Weeknight Pasta in 20 Minutes to queue' }),
    ).toBeInTheDocument();
  });

  it('fires onAddToQueue with the video id when the action button is clicked', async () => {
    const user = userEvent.setup();
    const handleAddToQueue = vi.fn();
    render(
      <VideoCard
        video={video}
        channelTitle="Weeknight Cooking Club"
        onAddToQueue={handleAddToQueue}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Add Weeknight Pasta in 20 Minutes to queue' }),
    );

    expect(handleAddToQueue).toHaveBeenCalledTimes(1);
    expect(handleAddToQueue).toHaveBeenCalledWith('video-1');
  });

  it('fires onAddToQueue via keyboard activation', async () => {
    const user = userEvent.setup();
    const handleAddToQueue = vi.fn();
    render(
      <VideoCard
        video={video}
        channelTitle="Weeknight Cooking Club"
        onAddToQueue={handleAddToQueue}
      />,
    );

    await user.tab();
    await user.keyboard('{Enter}');

    expect(handleAddToQueue).toHaveBeenCalledTimes(1);
  });
});
