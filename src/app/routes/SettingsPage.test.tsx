import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useYoutubeSync } from '../../hooks/useYoutubeSync';
import { SettingsPage } from './SettingsPage';

vi.mock('../../hooks/useYoutubeSync');

const mockedUseYoutubeSync = vi.mocked(useYoutubeSync);

const connect = vi.fn();
const disconnect = vi.fn();
const sync = vi.fn();

function stubSync(overrides: Partial<ReturnType<typeof useYoutubeSync>> = {}) {
  mockedUseYoutubeSync.mockReturnValue({
    status: 'disconnected',
    error: null,
    lastSyncedAt: null,
    channels: [],
    videos: [],
    connect,
    disconnect,
    sync,
    ...overrides,
  });
}

describe('SettingsPage', () => {
  it('shows a connect action when disconnected', async () => {
    stubSync();
    const user = userEvent.setup();
    render(<SettingsPage />);

    expect(screen.getByText('Not connected')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Connect YouTube account' }));
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it('shows sync/disconnect actions and counts when connected', async () => {
    stubSync({
      status: 'connected',
      lastSyncedAt: '2026-01-01T00:00:00.000Z',
      channels: [{ id: 'UC1', youtubeChannelId: 'UC1', title: 'Channel One', topicTags: [] }],
      videos: [
        {
          id: 'v1',
          youtubeVideoId: 'v1',
          channelId: 'UC1',
          title: 'Video One',
          publishedAt: '2026-01-01T00:00:00Z',
        },
      ],
    });
    const user = userEvent.setup();
    render(<SettingsPage />);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('1 channel, 1 recent video synced.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sync now' }));
    expect(sync).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Disconnect' }));
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('renders the sync button as loading while syncing', () => {
    stubSync({ status: 'syncing', lastSyncedAt: '2026-01-01T00:00:00.000Z' });
    render(<SettingsPage />);

    expect(screen.getByText('Syncing…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sync now' })).toHaveAttribute('aria-busy', 'true');
  });

  it('surfaces the error message as an alert', () => {
    stubSync({
      status: 'error',
      error: { code: 'quota-exceeded', message: 'YouTube API quota has been used up for today.' },
    });
    render(<SettingsPage />);

    expect(screen.getByRole('alert')).toHaveTextContent('YouTube API quota has been used up for today.');
  });
});
