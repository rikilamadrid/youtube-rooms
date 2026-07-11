import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useYoutubeSyncContext } from '../../hooks/YoutubeSyncContext';
import { saveRooms } from '../../utils/roomStorage';
import type { Room } from '../../types/room';
import type { SubscriptionChannel } from '../../types/channel';
import type { VideoSummary } from '../../types/video';
import { RoomDetailPage } from './RoomDetailPage';

vi.mock('../../hooks/YoutubeSyncContext');

const mockedUseYoutubeSyncContext = vi.mocked(useYoutubeSyncContext);

function stubSync(overrides: Partial<ReturnType<typeof useYoutubeSyncContext>> = {}) {
  mockedUseYoutubeSyncContext.mockReturnValue({
    status: 'connected',
    error: null,
    lastSyncedAt: null,
    channels: [],
    videos: [],
    connect: vi.fn(),
    disconnect: vi.fn(),
    sync: vi.fn(),
    ...overrides,
  });
}

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'room-coding',
    name: 'Coding',
    description: 'Tutorials and live coding.',
    channelIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeChannel(overrides: Partial<SubscriptionChannel> = {}): SubscriptionChannel {
  return {
    id: 'channel-fireship',
    youtubeChannelId: 'UCsBjURrPoezykLs9EqgamOA',
    title: 'Fireship',
    topicTags: [],
    ...overrides,
  };
}

function makeVideo(overrides: Partial<VideoSummary> = {}): VideoSummary {
  return {
    id: 'video-1',
    youtubeVideoId: 'video-1',
    channelId: 'channel-fireship',
    title: 'React 19',
    publishedAt: '2026-06-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderAtRoom(roomId: string) {
  return render(
    <MemoryRouter initialEntries={[`/rooms/${roomId}`]}>
      <Routes>
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/settings" element={<div>Settings placeholder</div>} />
        <Route path="/" element={<div>Dashboard placeholder</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('RoomDetailPage', () => {
  it('renders a tablist for switching between Channels, Videos, and Queue', () => {
    const room = makeRoom();
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);

    const tablist = screen.getByRole('tablist', { name: 'Room sections' });
    expect(within(tablist).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Channels',
      'Videos',
      'Queue',
    ]);
  });

  it('shows the Videos section by default', () => {
    const room = makeRoom();
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);

    expect(screen.getByRole('tab', { name: 'Videos' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Latest videos' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Channels' })).not.toBeInTheDocument();
  });

  it('switches sections when a tab is activated', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);

    await user.click(screen.getByRole('tab', { name: 'Channels' }));
    expect(screen.getByRole('tab', { name: 'Channels' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Channels' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Latest videos' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Queue' }));
    expect(screen.getByRole('tab', { name: 'Queue' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Your queue' })).toBeInTheDocument();
  });

  it('renders the matching room name, description, and sorted videos', () => {
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const older = makeVideo({ id: 'v1', title: 'Older', publishedAt: '2026-01-01T00:00:00Z' });
    const newer = makeVideo({ id: 'v2', title: 'Newer', publishedAt: '2026-02-01T00:00:00Z' });
    stubSync({ channels: [makeChannel()], videos: [older, newer] });

    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { level: 1, name: room.name })).toBeInTheDocument();
    expect(screen.getByText(room.description!, { selector: 'p' })).toBeInTheDocument();

    const feed = screen.getByRole('list', { name: 'Latest videos' });
    const items = within(feed)
      .getAllByRole('listitem')
      .map((item) => item.textContent);
    expect(items[0]).toContain('Newer');
    expect(items[1]).toContain('Older');
  });

  it('renders a not-found message for an unknown room id', () => {
    stubSync();
    renderAtRoom('room-does-not-exist');

    expect(screen.getByRole('heading', { name: 'Room not found' })).toBeInTheDocument();
  });

  it('renders a distinct empty state for a room with no channels', () => {
    const room = makeRoom({ channelIds: [] });
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { name: 'This room has no channels yet' })).toBeInTheDocument();
    expect(screen.getByText('No channels yet')).toBeInTheDocument();
  });

  it('renders a distinct empty state for a room whose channels have no videos', () => {
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    stubSync({ channels: [makeChannel()], videos: [] });

    renderAtRoom(room.id);

    expect(screen.getByRole('heading', { name: 'No recent videos' })).toBeInTheDocument();
  });

  it('resolves and renders a channel title for its videos', () => {
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    stubSync({ channels: [makeChannel()], videos: [makeVideo()] });

    renderAtRoom(room.id);

    expect(screen.getAllByText('Fireship').length).toBeGreaterThan(0);
  });

  it('renders an empty queue state', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);
    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    expect(screen.getByRole('heading', { name: 'Your queue is empty' })).toBeInTheDocument();
  });

  it('adds, removes, and sets an active video in the queue end to end', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const video = makeVideo();
    stubSync({ channels: [makeChannel()], videos: [video] });

    renderAtRoom(room.id);

    const feed = screen.getByRole('list', { name: 'Latest videos' });
    const addButton = within(feed).getByRole('button', { name: `Add ${video.title} to queue` });

    await user.click(addButton);
    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    const queuePanel = screen.getByRole('list', { name: 'Your queue' });
    expect(within(queuePanel).getAllByText(video.title)).toHaveLength(1);

    await user.click(within(queuePanel).getByRole('button', { name: `Set ${video.title} as active` }));
    expect(
      within(queuePanel).getByRole('button', { name: `${video.title} is the active video` }),
    ).toBeDisabled();

    await user.click(within(queuePanel).getByRole('button', { name: `Remove ${video.title} from queue` }));
    expect(within(queuePanel).queryByText(video.title)).not.toBeInTheDocument();
  });

  it('assigns and unassigns a synced channel', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: [] });
    saveRooms([room]);
    stubSync({ channels: [makeChannel()], videos: [] });

    renderAtRoom(room.id);
    await user.click(screen.getByRole('tab', { name: 'Channels' }));

    const checkbox = screen.getByRole('checkbox', { name: 'Fireship' });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(screen.getByRole('checkbox', { name: 'Fireship' })).toBeChecked();
    expect(screen.getByText('1 channel')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Fireship' }));
    expect(screen.getByRole('checkbox', { name: 'Fireship' })).not.toBeChecked();
  });

  it('shows a connect prompt in the channel list when nothing is synced yet', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync({ status: 'disconnected', channels: [] });

    renderAtRoom(room.id);
    await user.click(screen.getByRole('tab', { name: 'Channels' }));

    await user.click(screen.getByRole('button', { name: 'Go to Settings' }));
    expect(screen.getByText('Settings placeholder')).toBeInTheDocument();
  });

  it('edits a room name and description', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);

    await user.click(screen.getByRole('button', { name: 'Edit room' }));
    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Software');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Software' })).toBeInTheDocument();
  });

  it('deletes a room after confirmation and navigates to the dashboard', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderAtRoom(room.id);
    await user.click(screen.getByRole('button', { name: 'Delete room' }));

    expect(screen.getByText('Dashboard placeholder')).toBeInTheDocument();
  });

  it('does not delete a room when confirmation is declined', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderAtRoom(room.id);
    await user.click(screen.getByRole('button', { name: 'Delete room' }));

    expect(screen.getByRole('heading', { level: 1, name: room.name })).toBeInTheDocument();
  });
});
