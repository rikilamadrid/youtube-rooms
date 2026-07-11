import { Card } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import type { VideoSummary } from '../../../types/video';
import { formatDuration } from '../../../utils/formatDuration';
import { formatPublishedDate } from '../../../utils/formatPublishedDate';
import './VideoCard.css';

export type VideoCardProps = {
  /** The video to represent. */
  video: VideoSummary;
  /** Display name of the video's channel; resolved by the parent, not embedded in `video`. */
  channelTitle: string;
  /** Called with `video.id` when the "Add to queue" button is activated. Omit in queue contexts, where adding again doesn't apply. VideoCard owns no queue logic itself. */
  onAddToQueue?: (videoId: string) => void;
  /** Called with `video.id` when the "Remove from queue" button is activated. Only relevant when rendering a queue list. */
  onRemoveFromQueue?: (videoId: string) => void;
  /** Called with `video.id` when the "Set as active" button is activated. Only relevant when rendering a queue list. */
  onSetActive?: (videoId: string) => void;
  /** Whether this video is the queue's active video. Only meaningful alongside `onSetActive`. */
  isActive?: boolean;
  /** Whether this video is already in the queue. Disables the "Add to queue" button so it's obvious at a glance. Only meaningful alongside `onAddToQueue`. */
  isQueued?: boolean;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function Thumbnail({ video }: { video: VideoSummary }) {
  if (video.thumbnailUrl) {
    return (
      <span className="sr-video-card__thumbnail">
        <img src={video.thumbnailUrl} alt="" className="sr-video-card__thumbnail-image" />
      </span>
    );
  }

  return (
    <span className="sr-video-card__thumbnail sr-video-card__thumbnail--fallback" aria-hidden="true">
      <PlayIcon />
    </span>
  );
}

/**
 * Represents a `VideoSummary` for feed/queue lists: thumbnail (with a
 * decorative fallback when `thumbnailUrl` is missing), title, channel
 * name, published date, duration, and a "Watched" badge when applicable.
 * Missing optional fields (thumbnail, duration) are omitted gracefully.
 * The "Add to queue" action gets a video-specific accessible name
 * ("Add {title} to queue") rather than a generic one.
 */
export function VideoCard({
  video,
  channelTitle,
  onAddToQueue,
  onRemoveFromQueue,
  onSetActive,
  isActive = false,
  isQueued = false,
}: VideoCardProps) {
  const publishedDate = formatPublishedDate(video.publishedAt);
  const duration = formatDuration(video.duration);

  const handleAddToQueue = () => {
    onAddToQueue?.(video.id);
  };

  const handleRemoveFromQueue = () => {
    onRemoveFromQueue?.(video.id);
  };

  const handleSetActive = () => {
    onSetActive?.(video.id);
  };

  return (
    <Card padding="none" className="sr-video-card">
      <Thumbnail video={video} />
      <span className="sr-video-card__body">
        <span className="sr-video-card__title">{video.title}</span>
        <span className="sr-video-card__meta">
          <span className="sr-video-card__channel">{channelTitle}</span>
          <span className="sr-video-card__separator" aria-hidden="true">
            &middot;
          </span>
          <span className="sr-video-card__date">{publishedDate}</span>
          {duration ? (
            <>
              <span className="sr-video-card__separator" aria-hidden="true">
                &middot;
              </span>
              <span className="sr-video-card__duration">{duration}</span>
            </>
          ) : null}
          {video.watched ? <Badge tone="success">Watched</Badge> : null}
          {isActive ? (
            <Badge tone="accent" icon={<PlayIcon />}>
              Now playing
            </Badge>
          ) : null}
        </span>
        <span className="sr-video-card__footer">
          {onAddToQueue ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToQueue}
              disabled={isQueued}
              aria-label={isQueued ? `${video.title} is already in the queue` : `Add ${video.title} to queue`}
            >
              {isQueued ? 'Added to queue' : 'Add to queue'}
            </Button>
          ) : null}
          {onSetActive ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSetActive}
              disabled={isActive}
              aria-label={isActive ? `${video.title} is the active video` : `Set ${video.title} as active`}
            >
              {isActive ? 'Now playing' : 'Set as active'}
            </Button>
          ) : null}
          {onRemoveFromQueue ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFromQueue}
              aria-label={`Remove ${video.title} from queue`}
            >
              Remove
            </Button>
          ) : null}
        </span>
      </span>
    </Card>
  );
}
