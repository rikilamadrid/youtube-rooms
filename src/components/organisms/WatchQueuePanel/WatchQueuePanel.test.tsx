import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { VideoSummary } from '../../../types/video';
import type { WatchQueue } from '../../../types/queue';
import { WatchQueuePanel } from './WatchQueuePanel';

function makeVideo(id: string, title: string): VideoSummary {
  return {
    id,
    youtubeVideoId: `yt-${id}`,
    channelId: 'channel-1',
    title,
    publishedAt: '2026-01-01T00:00:00.000Z',
  };
}

const queue: WatchQueue = {
  id: 'queue-1',
  roomId: 'room-1',
  videoIds: ['video-1', 'video-2'],
};

const items = [
  { video: makeVideo('video-1', 'First Video'), channelTitle: 'Channel One' },
  { video: makeVideo('video-2', 'Second Video'), channelTitle: 'Channel One' },
];

describe('WatchQueuePanel', () => {
  it('renders queued videos in order', () => {
    render(
      <WatchQueuePanel queue={queue} items={items} onRemoveFromQueue={vi.fn()} onSetActive={vi.fn()} />,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('First Video');
    expect(listItems[1]).toHaveTextContent('Second Video');
  });

  it('renders EmptyState with guidance copy when the queue has no items', () => {
    render(
      <WatchQueuePanel
        queue={{ ...queue, videoIds: [] }}
        items={[]}
        onRemoveFromQueue={vi.fn()}
        onSetActive={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Your queue is empty' })).toBeInTheDocument();
    expect(screen.getByText(/Add videos from the feed above/)).toBeInTheDocument();
  });

  it('fires onRemoveFromQueue with the video id when a row is removed', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(
      <WatchQueuePanel queue={queue} items={items} onRemoveFromQueue={handleRemove} onSetActive={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove First Video from queue' }));

    expect(handleRemove).toHaveBeenCalledWith('video-1');
  });

  it('fires onSetActive with the video id when a row is set active', async () => {
    const user = userEvent.setup();
    const handleSetActive = vi.fn();
    render(
      <WatchQueuePanel queue={queue} items={items} onRemoveFromQueue={vi.fn()} onSetActive={handleSetActive} />,
    );

    await user.click(screen.getByRole('button', { name: 'Set Second Video as active' }));

    expect(handleSetActive).toHaveBeenCalledWith('video-2');
  });

  it('shows a non-color-only indicator for the active video', () => {
    render(
      <WatchQueuePanel
        queue={{ ...queue, activeVideoId: 'video-2' }}
        items={items}
        onRemoveFromQueue={vi.fn()}
        onSetActive={vi.fn()}
      />,
    );

    expect(screen.getByText('Now playing', { selector: '.sr-badge__label' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second Video is the active video' })).toBeDisabled();
  });
});
