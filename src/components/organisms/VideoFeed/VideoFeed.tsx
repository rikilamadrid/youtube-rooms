import { VideoCard } from '../../molecules/VideoCard/VideoCard';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import type { RoomVideoFeedItem } from '../../../utils/resolveRoomVideoFeed';
import './VideoFeed.css';

export type VideoFeedProps = {
  /** Videos to render, one `VideoCard` each, already resolved and sorted by the caller. */
  items: RoomVideoFeedItem[];
  /** Called with a video's id when its "Add to queue" action is activated. Omit to render a read-only feed with no queue action. */
  onAddToQueue?: (videoId: string) => void;
  /** Ids of videos already in the room's queue; matching cards disable their "Add to queue" button. */
  queuedVideoIds?: Set<string>;
  /** Empty-state headline; callers supply copy specific to why the feed is empty. */
  emptyStateTitle: string;
  /** Empty-state supporting copy. */
  emptyStateDescription?: string;
};

/**
 * Renders a mobile-first, single-column list of `VideoCard`s, or an
 * `EmptyState` when there are none. Presentational and route-agnostic —
 * resolving which videos belong here is the caller's job.
 */
export function VideoFeed({
  items,
  onAddToQueue,
  queuedVideoIds,
  emptyStateTitle,
  emptyStateDescription,
}: VideoFeedProps) {
  if (items.length === 0) {
    return (
      <div className="sr-video-feed sr-video-feed--empty">
        <EmptyState headingLevel="h3" title={emptyStateTitle} description={emptyStateDescription} />
      </div>
    );
  }

  return (
    <ul className="sr-video-feed" aria-label="Latest videos">
      {items.map(({ video, channelTitle }) => (
        <li key={video.id} className="sr-video-feed__item">
          <VideoCard
            video={video}
            channelTitle={channelTitle}
            onAddToQueue={onAddToQueue}
            isQueued={queuedVideoIds?.has(video.id) ?? false}
          />
        </li>
      ))}
    </ul>
  );
}
