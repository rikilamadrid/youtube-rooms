import { VideoCard } from '../../molecules/VideoCard/VideoCard';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import type { VideoSummary } from '../../../types/video';
import type { WatchQueue } from '../../../types/queue';
import './WatchQueuePanel.css';

export type WatchQueuePanelItem = {
  video: VideoSummary;
  channelTitle: string;
};

export type WatchQueuePanelProps = {
  /** The room's watch queue, used only to resolve `activeVideoId`. */
  queue: WatchQueue;
  /** Queued videos, already resolved and ordered by the caller to match `queue.videoIds`. */
  items: WatchQueuePanelItem[];
  /** Called with a video's id when its "Remove" action is activated. */
  onRemoveFromQueue: (videoId: string) => void;
  /** Called with a video's id when its "Set as active" action is activated. */
  onSetActive: (videoId: string) => void;
};

/**
 * Renders a room's watch queue as an ordered list of `VideoCard`s with
 * remove and set-active controls, or an `EmptyState` guiding the viewer
 * back to the video feed when the queue has no items. Visually distinct
 * from `VideoFeed` (a "Your queue" heading + a bordered container) so the
 * two lists aren't confused.
 */
export function WatchQueuePanel({ queue, items, onRemoveFromQueue, onSetActive }: WatchQueuePanelProps) {
  if (items.length === 0) {
    return (
      <div className="sr-watch-queue-panel sr-watch-queue-panel--empty">
        <EmptyState
          headingLevel="h3"
          title="Your queue is empty"
          description="Add videos from the feed above to start building your queue."
        />
      </div>
    );
  }

  return (
    <ul className="sr-watch-queue-panel" aria-label="Your queue">
      {items.map(({ video, channelTitle }) => (
        <li key={video.id} className="sr-watch-queue-panel__item">
          <VideoCard
            video={video}
            channelTitle={channelTitle}
            onRemoveFromQueue={onRemoveFromQueue}
            onSetActive={onSetActive}
            isActive={video.id === queue.activeVideoId}
          />
        </li>
      ))}
    </ul>
  );
}
