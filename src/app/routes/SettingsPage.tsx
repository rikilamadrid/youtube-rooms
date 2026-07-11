import { Badge, type BadgeTone } from '../../components/atoms/Badge/Badge';
import { Button } from '../../components/atoms/Button/Button';
import { useYoutubeSync } from '../../hooks/useYoutubeSync';
import './SettingsPage.css';

const STATUS_COPY: Record<string, { label: string; tone: BadgeTone }> = {
  disconnected: { label: 'Not connected', tone: 'neutral' },
  connecting: { label: 'Connecting…', tone: 'accent' },
  connected: { label: 'Connected', tone: 'success' },
  syncing: { label: 'Syncing…', tone: 'accent' },
  error: { label: 'Connection error', tone: 'warning' },
};

/**
 * Settings route (`/settings`): connect/disconnect the YouTube account and
 * trigger a manual sync, surfacing connection/sync status and any
 * auth/quota/network errors via `useYoutubeSync`.
 */
export function SettingsPage() {
  const { status, error, lastSyncedAt, channels, videos, connect, disconnect, sync } = useYoutubeSync();

  const isBusy = status === 'connecting' || status === 'syncing';
  const isConnected = status === 'connected' || status === 'syncing';
  const statusCopy = STATUS_COPY[status];

  return (
    <>
      <h1>Settings</h1>
      <section className="sr-settings__section" aria-labelledby="sr-settings-youtube-heading">
        <h2 id="sr-settings-youtube-heading">YouTube account</h2>
        <div className="sr-settings__status-row">
          <Badge tone={statusCopy.tone}>{statusCopy.label}</Badge>
          {isConnected && lastSyncedAt ? (
            <span className="sr-settings__last-synced">Last synced {new Date(lastSyncedAt).toLocaleString()}</span>
          ) : null}
        </div>

        {isConnected ? (
          <p className="sr-settings__description">
            {lastSyncedAt
              ? `${channels.length} channel${channels.length === 1 ? '' : 's'}, ${videos.length} recent video${videos.length === 1 ? '' : 's'} synced.`
              : 'Connected. Run a sync to import your subscriptions and recent videos.'}
          </p>
        ) : (
          <p className="sr-settings__description">
            Connect your YouTube account to sync your subscriptions and recent videos into SubRooms.
          </p>
        )}

        {error ? (
          <p className="sr-settings__error" role="alert">
            {error.message}
          </p>
        ) : null}

        <div className="sr-settings__actions">
          {isConnected ? (
            <>
              <Button onClick={() => void sync()} loading={status === 'syncing'}>
                Sync now
              </Button>
              <Button variant="secondary" onClick={() => void disconnect()} disabled={isBusy}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button onClick={() => void connect()} loading={status === 'connecting'}>
              Connect YouTube account
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
