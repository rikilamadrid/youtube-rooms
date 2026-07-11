import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoFeed } from './VideoFeed';
import type { RoomVideoFeedItem } from '../../../utils/resolveRoomVideoFeed';
import type { VideoSummary } from '../../../types/video';

function makeItem(overrides: Partial<VideoSummary> = {}): RoomVideoFeedItem {
  return {
    video: {
      id: 'video-1',
      youtubeVideoId: 'yt-1',
      channelId: 'channel-1',
      title: 'Video One',
      publishedAt: '2026-01-01T00:00:00.000Z',
      ...overrides,
    },
    channelTitle: 'Channel One',
  };
}

describe('VideoFeed', () => {
  it('renders a VideoCard list item per video', () => {
    render(
      <VideoFeed
        items={[makeItem({ id: 'video-1' }), makeItem({ id: 'video-2' })]}
        onAddToQueue={vi.fn()}
        emptyStateTitle="No videos"
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('forwards video id when a VideoCard fires onAddToQueue', async () => {
    const user = userEvent.setup();
    const handleAddToQueue = vi.fn();
    render(
      <VideoFeed
        items={[makeItem({ id: 'video-1', title: 'Video One' })]}
        onAddToQueue={handleAddToQueue}
        emptyStateTitle="No videos"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Add Video One to queue' }));

    expect(handleAddToQueue).toHaveBeenCalledWith('video-1');
  });

  it('disables "Add to queue" for videos already in queuedVideoIds', () => {
    render(
      <VideoFeed
        items={[makeItem({ id: 'video-1', title: 'Video One' }), makeItem({ id: 'video-2', title: 'Video Two' })]}
        onAddToQueue={vi.fn()}
        queuedVideoIds={new Set(['video-1'])}
        emptyStateTitle="No videos"
      />,
    );

    expect(screen.getByRole('button', { name: 'Video One is already in the queue' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add Video Two to queue' })).toBeEnabled();
  });

  it('omits the "Add to queue" action when onAddToQueue is not provided', () => {
    render(<VideoFeed items={[makeItem({ id: 'video-1', title: 'Video One' })]} emptyStateTitle="No videos" />);

    expect(screen.queryByRole('button', { name: 'Add Video One to queue' })).not.toBeInTheDocument();
  });

  it('renders the given empty state title and description when there are no items', () => {
    render(
      <VideoFeed
        items={[]}
        onAddToQueue={vi.fn()}
        emptyStateTitle="No channels yet"
        emptyStateDescription="Add channels to this room to see their latest videos here."
      />,
    );

    expect(screen.getByRole('heading', { name: 'No channels yet' })).toBeInTheDocument();
    expect(
      screen.getByText('Add channels to this room to see their latest videos here.'),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
