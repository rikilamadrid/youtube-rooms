import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useYoutubeSyncContext } from '../../hooks/YoutubeSyncContext';
import { saveRooms } from '../../utils/roomStorage';
import type { Room } from '../../types/room';
import type { SubscriptionChannel } from '../../types/channel';
import type { VideoSummary } from '../../types/video';
import type { VideoPlayerProps } from '../../components/organisms/VideoPlayer/VideoPlayer';
import { RoomDetailPage } from './RoomDetailPage';

vi.mock('../../hooks/YoutubeSyncContext');
vi.mock('../../components/organisms/VideoPlayer/VideoPlayer', () => ({
  VideoPlayer: ({ youtubeVideoId, onEnded, onPrevious, onNext, hasPrevious, hasNext }: VideoPlayerProps) => (
    <div data-testid="stub-video-player">
      <span>Now playing: {youtubeVideoId}</span>
      <button type="button" onClick={onEnded}>
        Simulate video ended
      </button>
      <button type="button" onClick={onPrevious} disabled={!hasPrevious}>
        Previous
      </button>
      <button type="button" onClick={onNext} disabled={!hasNext}>
        Next
      </button>
    </div>
  ),
}));

const mockedUseYoutubeSyncContext = vi.mocked(useYoutubeSyncContext);

function stubSync(overrides: Partial<ReturnType<typeof useYoutubeSyncContext>> = {}) {
  mockedUseYoutubeSyncContext.mockReturnValue({
    status: 'connected',
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

  it('shows no category filter chips when no video has a categoryId', () => {
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    stubSync({ channels: [makeChannel()], videos: [makeVideo()] });

    renderAtRoom(room.id);

    expect(screen.queryByRole('group', { name: 'Filter by category' })).not.toBeInTheDocument();
  });

  it('filters the video feed by category and back to All', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const gamingVideo = makeVideo({ id: 'video-gaming', title: 'Speedrun Tips', categoryId: '20' });
    const musicVideo = makeVideo({ id: 'video-music', title: 'Lo-fi Beats', categoryId: '10' });
    stubSync({
      channels: [makeChannel()],
      videos: [gamingVideo, musicVideo],
      categories: [
        { id: '20', title: 'Gaming' },
        { id: '10', title: 'Music' },
      ],
    });

    renderAtRoom(room.id);

    const filterGroup = screen.getByRole('group', { name: 'Filter by category' });
    expect(within(filterGroup).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(within(filterGroup).getByRole('button', { name: 'Gaming' }));

    const feed = screen.getByRole('list', { name: 'Latest videos' });
    expect(within(feed).getByText('Speedrun Tips')).toBeInTheDocument();
    expect(within(feed).queryByText('Lo-fi Beats')).not.toBeInTheDocument();
    expect(within(filterGroup).getByRole('button', { name: 'Gaming' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(within(filterGroup).getByRole('button', { name: 'All' }));
    expect(within(feed).getByText('Lo-fi Beats')).toBeInTheDocument();
  });

  it('only shows chips for categories present among the room’s videos, not every synced category', () => {
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const gamingVideo = makeVideo({ id: 'video-gaming', title: 'Speedrun Tips', categoryId: '20' });
    stubSync({
      channels: [makeChannel()],
      videos: [gamingVideo],
      categories: [
        { id: '20', title: 'Gaming' },
        { id: '10', title: 'Music' },
      ],
    });

    renderAtRoom(room.id);

    const filterGroup = screen.getByRole('group', { name: 'Filter by category' });
    expect(within(filterGroup).getByRole('button', { name: 'Gaming' })).toBeInTheDocument();
    expect(within(filterGroup).queryByRole('button', { name: 'Music' })).not.toBeInTheDocument();
  });

  it('renders an empty queue state with no player', async () => {
    const user = userEvent.setup();
    const room = makeRoom();
    saveRooms([room]);
    stubSync();

    renderAtRoom(room.id);
    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    expect(screen.getByRole('heading', { name: 'Your queue is empty' })).toBeInTheDocument();
    expect(screen.queryByTestId('stub-video-player')).not.toBeInTheDocument();
  });

  it('disables "Add to queue" once a video is queued', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const video = makeVideo();
    stubSync({ channels: [makeChannel()], videos: [video] });

    renderAtRoom(room.id);
    const feed = screen.getByRole('list', { name: 'Latest videos' });
    await user.click(within(feed).getByRole('button', { name: `Add ${video.title} to queue` }));

    expect(within(feed).getByRole('button', { name: `${video.title} is already in the queue` })).toBeDisabled();
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

  it('shows the player inline in the Queue tab once a video is selected, with no separate watch page', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const video = makeVideo();
    stubSync({ channels: [makeChannel()], videos: [video] });

    renderAtRoom(room.id);
    const feed = screen.getByRole('list', { name: 'Latest videos' });
    await user.click(within(feed).getByRole('button', { name: `Add ${video.title} to queue` }));
    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    expect(screen.queryByRole('button', { name: 'Watch' })).not.toBeInTheDocument();
    expect(screen.getByText('Select a video from the queue below to start watching.')).toBeInTheDocument();

    const queuePanel = screen.getByRole('list', { name: 'Your queue' });
    await user.click(within(queuePanel).getByRole('button', { name: `Set ${video.title} as active` }));

    expect(screen.getByText(`Now playing: ${video.youtubeVideoId}`)).toBeInTheDocument();
  });

  it('advances to the next queued video when the player reports it ended, and stops cleanly at the end', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const first = makeVideo({ id: 'video-1', youtubeVideoId: 'yt-1', title: 'First video' });
    const second = makeVideo({ id: 'video-2', youtubeVideoId: 'yt-2', title: 'Second video' });
    stubSync({ channels: [makeChannel()], videos: [first, second] });

    renderAtRoom(room.id);
    const feed = screen.getByRole('list', { name: 'Latest videos' });
    await user.click(within(feed).getByRole('button', { name: `Add ${first.title} to queue` }));
    await user.click(within(feed).getByRole('button', { name: `Add ${second.title} to queue` }));
    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    const queuePanel = screen.getByRole('list', { name: 'Your queue' });
    await user.click(within(queuePanel).getByRole('button', { name: `Set ${first.title} as active` }));
    expect(screen.getByText(`Now playing: ${first.youtubeVideoId}`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Simulate video ended' }));
    expect(screen.getByText(`Now playing: ${second.youtubeVideoId}`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Simulate video ended' }));
    expect(screen.getByText('Select a video from the queue below to start watching.')).toBeInTheDocument();
  });

  it('navigates the queue via the player’s next/previous controls', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: ['channel-fireship'] });
    saveRooms([room]);
    const first = makeVideo({ id: 'video-1', youtubeVideoId: 'yt-1', title: 'First video' });
    const second = makeVideo({ id: 'video-2', youtubeVideoId: 'yt-2', title: 'Second video' });
    stubSync({ channels: [makeChannel()], videos: [first, second] });

    renderAtRoom(room.id);
    const feed = screen.getByRole('list', { name: 'Latest videos' });
    await user.click(within(feed).getByRole('button', { name: `Add ${first.title} to queue` }));
    await user.click(within(feed).getByRole('button', { name: `Add ${second.title} to queue` }));
    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    const queuePanel = screen.getByRole('list', { name: 'Your queue' });
    await user.click(within(queuePanel).getByRole('button', { name: `Set ${first.title} as active` }));

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(`Now playing: ${second.youtubeVideoId}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByText(`Now playing: ${first.youtubeVideoId}`)).toBeInTheDocument();
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

  it('shows category tags under a channel derived from its synced videos', async () => {
    const user = userEvent.setup();
    const room = makeRoom({ channelIds: [] });
    saveRooms([room]);
    const video = makeVideo({ channelId: 'channel-fireship', categoryId: '28' });
    stubSync({
      channels: [makeChannel()],
      videos: [video],
      categories: [{ id: '28', title: 'Science & Technology' }],
    });

    renderAtRoom(room.id);
    await user.click(screen.getByRole('tab', { name: 'Channels' }));

    expect(screen.getByRole('button', { name: 'Science & Technology' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Fireship' })).toBeInTheDocument();
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
