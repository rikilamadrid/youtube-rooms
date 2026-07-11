import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { VideoFeed } from '../../components/organisms/VideoFeed/VideoFeed';
import { useYoutubeSyncContext } from '../../hooks/YoutubeSyncContext';
import type { RoomVideoFeedItem } from '../../utils/resolveRoomVideoFeed';
import './ChannelsPage.css';

/**
 * Channels route (`/channels`): a read-only, reverse-chronological feed of
 * every synced channel's recent videos, proving real YouTube data renders
 * through the existing `VideoFeed`/`VideoCard` components unchanged. No
 * queue action (there is no room context here) and no room assignment yet
 * — see `context/features/19-room-channel-assignment.md`.
 */
export function ChannelsPage() {
  const navigate = useNavigate();
  const { status, error, channels, videos } = useYoutubeSyncContext();

  // `channels` only populates after a successful sync, so its presence
  // distinguishes "never connected/synced" from "an in-flight re-sync
  // failed but earlier synced data is still good" — the latter should
  // keep showing that data rather than discarding it behind a connect
  // prompt.
  const hasSyncedData = channels.length > 0;

  if (status === 'disconnected' || status === 'connecting' || (status === 'error' && !hasSyncedData)) {
    return (
      <>
        <h1>Channels</h1>
        <EmptyState
          title="Connect your YouTube account"
          description="Connect on the Settings page to see your synced channels' recent videos here."
          actionLabel="Go to Settings"
          onAction={() => navigate('/settings')}
        />
      </>
    );
  }

  const channelTitleById = new Map(channels.map((channel) => [channel.id, channel.title]));
  const items: RoomVideoFeedItem[] = videos
    .map((video) => ({ video, channelTitle: channelTitleById.get(video.channelId) ?? 'Unknown channel' }))
    .sort((a, b) => Date.parse(b.video.publishedAt) - Date.parse(a.video.publishedAt));

  return (
    <>
      <h1>Channels</h1>
      {status === 'error' && error ? (
        <p className="sr-channels__error" role="alert">
          {error.message}
        </p>
      ) : null}
      <VideoFeed
        items={items}
        emptyStateTitle="No recent videos yet"
        emptyStateDescription="Run a sync from the Settings page to import your subscriptions and recent videos."
      />
    </>
  );
}
