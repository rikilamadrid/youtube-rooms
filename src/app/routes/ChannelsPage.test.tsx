import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useYoutubeSyncContext } from '../../hooks/YoutubeSyncContext';
import { ChannelsPage } from './ChannelsPage';

vi.mock('../../hooks/YoutubeSyncContext');

const mockedUseYoutubeSyncContext = vi.mocked(useYoutubeSyncContext);

function stubSync(overrides: Partial<ReturnType<typeof useYoutubeSyncContext>> = {}) {
  mockedUseYoutubeSyncContext.mockReturnValue({
    status: 'disconnected',
    error: null,
    lastSyncedAt: null,
    channels: [],
    videos: [],
    categories: [],
    connect: vi.fn(),
    disconnect: vi.fn(),
    sync: vi.fn(),
    ...overrides,
  });
}

function renderChannelsPage() {
  return render(
    <MemoryRouter initialEntries={['/channels']}>
      <Routes>
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/settings" element={<div>Settings placeholder</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ChannelsPage', () => {
  it('prompts to connect when disconnected, and navigates to Settings', async () => {
    stubSync();
    const user = userEvent.setup();
    renderChannelsPage();

    expect(screen.getByText('Connect your YouTube account')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to Settings' }));
    expect(screen.getByText('Settings placeholder')).toBeInTheDocument();
  });

  it('renders synced videos sorted by recency with no queue action', () => {
    stubSync({
      status: 'connected',
      channels: [{ id: 'UC1', youtubeChannelId: 'UC1', title: 'Channel One', topicTags: [] }],
      videos: [
        { id: 'v1', youtubeVideoId: 'v1', channelId: 'UC1', title: 'Older', publishedAt: '2026-01-01T00:00:00Z' },
        { id: 'v2', youtubeVideoId: 'v2', channelId: 'UC1', title: 'Newer', publishedAt: '2026-02-01T00:00:00Z' },
      ],
    });
    renderChannelsPage();

    const titles = screen.getAllByText(/Older|Newer/).map((el) => el.textContent);
    expect(titles).toEqual(['Newer', 'Older']);
    expect(screen.queryByRole('button', { name: /add .* to queue/i })).not.toBeInTheDocument();
  });

  it('shows an empty state with no videos synced yet', () => {
    stubSync({ status: 'connected', channels: [], videos: [] });
    renderChannelsPage();

    expect(screen.getByRole('heading', { name: 'No recent videos yet' })).toBeInTheDocument();
  });

  it('prompts to connect when a sync errors before any data has synced', () => {
    stubSync({
      status: 'error',
      error: { code: 'quota-exceeded', message: 'YouTube API quota has been used up for today.' },
      channels: [],
    });
    renderChannelsPage();

    expect(screen.getByText('Connect your YouTube account')).toBeInTheDocument();
  });

  it('keeps showing previously synced videos alongside an error banner when a re-sync fails', () => {
    stubSync({
      status: 'error',
      error: { code: 'quota-exceeded', message: 'YouTube API quota has been used up for today.' },
      channels: [{ id: 'UC1', youtubeChannelId: 'UC1', title: 'Channel One', topicTags: [] }],
      videos: [{ id: 'v1', youtubeVideoId: 'v1', channelId: 'UC1', title: 'Older', publishedAt: '2026-01-01T00:00:00Z' }],
    });
    renderChannelsPage();

    expect(screen.getByRole('alert')).toHaveTextContent('YouTube API quota has been used up for today.');
    expect(screen.getByText('Older')).toBeInTheDocument();
  });
});
