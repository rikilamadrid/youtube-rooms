import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge } from '../../components/atoms/Badge/Badge';
import { Button } from '../../components/atoms/Button/Button';
import { RoomFormDialog } from '../../components/molecules/RoomFormDialog/RoomFormDialog';
import { Tabs, type TabItem } from '../../components/molecules/Tabs/Tabs';
import { ChannelAssignmentList } from '../../components/organisms/ChannelAssignmentList/ChannelAssignmentList';
import { VideoFeed } from '../../components/organisms/VideoFeed/VideoFeed';
import { VideoPlayer } from '../../components/organisms/VideoPlayer/VideoPlayer';
import { WatchQueuePanel } from '../../components/organisms/WatchQueuePanel/WatchQueuePanel';
import { useRooms } from '../../hooks/useRooms';
import { useYoutubeSyncContext } from '../../hooks/YoutubeSyncContext';
import type { WatchQueue } from '../../types/queue';
import {
  addToQueue,
  emptyQueueForRoom,
  nextInQueue,
  prevInQueue,
  removeFromQueue,
  resolveQueueItems,
  setActiveVideo,
} from '../../utils/watchQueue';
import { resolveRoomVideoFeed } from '../../utils/resolveRoomVideoFeed';
import './RoomDetailPage.css';

type SectionId = 'channels' | 'videos' | 'queue';

const SECTIONS: TabItem[] = [
  { id: 'channels', label: 'Channels', panelId: 'panel-channels' },
  { id: 'videos', label: 'Videos', panelId: 'panel-videos' },
  { id: 'queue', label: 'Queue', panelId: 'panel-queue' },
];

const DEFAULT_SECTION: SectionId = 'videos';

function isSectionId(value: string | null): value is SectionId {
  return value === 'channels' || value === 'videos' || value === 'queue';
}

/**
 * Room detail route (`/rooms/:roomId`): the room's name/description/channel
 * count, controls to edit or delete the room and assign synced channels to
 * it, its latest videos across assigned channels (sourced from
 * `useYoutubeSyncContext()`), and the room's watch queue with an embedded
 * player right in the Queue tab — no separate page to jump to. Queue state
 * is local to this page and always starts empty.
 */
export function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { rooms, updateRoom, deleteRoom, assignChannel, unassignChannel } = useRooms();
  const { channels, videos, categories } = useYoutubeSyncContext();
  const room = rooms.find((candidate) => candidate.id === roomId);
  const [queue, setQueue] = useState<WatchQueue | null>(() =>
    room ? emptyQueueForRoom(room.id) : null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [trackedRoomId, setTrackedRoomId] = useState(roomId);
  const [searchParams, setSearchParams] = useSearchParams();
  const rawSection = searchParams.get('section');
  const activeSection: SectionId = isSectionId(rawSection) ? rawSection : DEFAULT_SECTION;
  const panelRef = useRef<HTMLDivElement>(null);
  const previousSection = useRef<SectionId | null>(null);

  // Clear the category filter when navigating to a different room, following
  // React's recommended "adjust state during render" pattern rather than an
  // effect, since it's purely derived from the roomId param.
  if (roomId !== trackedRoomId) {
    setTrackedRoomId(roomId);
    setCategoryFilter(null);
  }

  useEffect(() => {
    if (previousSection.current !== null && previousSection.current !== activeSection) {
      panelRef.current?.focus();
    }
    previousSection.current = activeSection;
  }, [activeSection]);

  function handleSectionChange(id: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('section', id);
        return next;
      },
      { replace: true },
    );
  }

  if (!room || !queue) {
    return (
      <>
        <h1>Room not found</h1>
        <p>No room matches “{roomId}”.</p>
        <Link to="/">Back to rooms</Link>
      </>
    );
  }

  const channelCount = room.channelIds.length;
  const items = resolveRoomVideoFeed(room, channels, videos);
  const categoryNameById = new Map(categories.map((category) => [category.id, category.title]));
  const presentCategoryIds = Array.from(
    new Set(
      items
        .map((item) => item.video.categoryId)
        .filter((categoryId): categoryId is string => Boolean(categoryId)),
    ),
  );
  const filteredItems = categoryFilter
    ? items.filter((item) => item.video.categoryId === categoryFilter)
    : items;
  const categoryNameSetByChannelId = new Map<string, Set<string>>();
  for (const video of videos) {
    const categoryName = video.categoryId ? categoryNameById.get(video.categoryId) : undefined;
    if (!categoryName) {
      continue;
    }
    const names = categoryNameSetByChannelId.get(video.channelId) ?? new Set<string>();
    names.add(categoryName);
    categoryNameSetByChannelId.set(video.channelId, names);
  }
  const categoryNamesByChannelId = new Map(
    Array.from(categoryNameSetByChannelId, ([channelId, names]) => [channelId, Array.from(names)]),
  );
  const queueItems = resolveQueueItems(queue, channels, videos);
  const queuedVideoIds = new Set(queue.videoIds);
  const activeItem = queueItems.find((item) => item.video.id === queue.activeVideoId);

  function handleAddToQueue(videoId: string) {
    setQueue((current) => (current ? addToQueue(current, videoId) : current));
  }

  function handleRemoveFromQueue(videoId: string) {
    setQueue((current) => (current ? removeFromQueue(current, videoId) : current));
  }

  function handleSetActive(videoId: string) {
    setQueue((current) => (current ? setActiveVideo(current, videoId) : current));
  }

  function handleEnded() {
    if (!activeItem) {
      return;
    }
    setQueue((current) => (current ? setActiveVideo(current, nextInQueue(current, activeItem.video.id)) : current));
  }

  function handlePrevious() {
    if (!activeItem) {
      return;
    }
    setQueue((current) => (current ? setActiveVideo(current, prevInQueue(current, activeItem.video.id)) : current));
  }

  function handleNext() {
    if (!activeItem) {
      return;
    }
    setQueue((current) => (current ? setActiveVideo(current, nextInQueue(current, activeItem.video.id)) : current));
  }

  function handleEditRoom(input: { name: string; description?: string }) {
    updateRoom(room!.id, input);
    setIsEditOpen(false);
  }

  function handleDeleteRoom() {
    if (!window.confirm(`Delete “${room!.name}”? This can’t be undone.`)) {
      return;
    }
    deleteRoom(room!.id);
    navigate('/');
  }

  const emptyStateTitle =
    channelCount === 0 ? 'This room has no channels yet' : 'No recent videos';
  const emptyStateDescription =
    channelCount === 0
      ? 'Add channels to this room to see their latest videos here.'
      : "This room's channels haven't posted any videos yet.";

  return (
    <>
      <header className="sr-room-detail__header">
        <div className="sr-room-detail__heading-row">
          <h1>{room.name}</h1>
          <div className="sr-room-detail__actions">
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
              Edit room
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeleteRoom}>
              Delete room
            </Button>
          </div>
        </div>
        {room.description ? <p className="sr-room-detail__description">{room.description}</p> : null}
        <Badge tone={channelCount === 0 ? 'neutral' : 'accent'}>
          {channelCount === 0 ? 'No channels yet' : `${channelCount} channel${channelCount === 1 ? '' : 's'}`}
        </Badge>
      </header>
      <Tabs
        label="Room sections"
        tabs={SECTIONS}
        activeTabId={activeSection}
        onTabChange={handleSectionChange}
      />
      {activeSection === 'channels' ? (
        <div
          id="panel-channels"
          role="tabpanel"
          aria-labelledby="tab-channels"
          tabIndex={-1}
          ref={panelRef}
          className="sr-room-detail__panel"
        >
          <h2 className="sr-room-detail__section-heading">Channels</h2>
          <ChannelAssignmentList
            channels={channels}
            assignedChannelIds={room.channelIds}
            onAssign={(channelId) => assignChannel(room.id, channelId)}
            onUnassign={(channelId) => unassignChannel(room.id, channelId)}
            onConnectAccount={() => navigate('/settings')}
            categoryNamesByChannelId={categoryNamesByChannelId}
          />
        </div>
      ) : null}
      {activeSection === 'videos' ? (
        <div
          id="panel-videos"
          role="tabpanel"
          aria-labelledby="tab-videos"
          tabIndex={-1}
          ref={panelRef}
          className="sr-room-detail__panel"
        >
          <h2 className="sr-room-detail__section-heading">Latest videos</h2>
          {presentCategoryIds.length > 0 ? (
            <div className="sr-room-detail__category-filters" role="group" aria-label="Filter by category">
              <Button
                variant={categoryFilter === null ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCategoryFilter(null)}
                aria-pressed={categoryFilter === null}
              >
                All
              </Button>
              {presentCategoryIds.map((categoryId) => (
                <Button
                  key={categoryId}
                  variant={categoryFilter === categoryId ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCategoryFilter(categoryId)}
                  aria-pressed={categoryFilter === categoryId}
                >
                  {categoryNameById.get(categoryId) ?? 'Unknown'}
                </Button>
              ))}
            </div>
          ) : null}
          <VideoFeed
            items={filteredItems}
            onAddToQueue={handleAddToQueue}
            queuedVideoIds={queuedVideoIds}
            emptyStateTitle={emptyStateTitle}
            emptyStateDescription={emptyStateDescription}
          />
        </div>
      ) : null}
      {activeSection === 'queue' ? (
        <div
          id="panel-queue"
          role="tabpanel"
          aria-labelledby="tab-queue"
          tabIndex={-1}
          ref={panelRef}
          className="sr-room-detail__panel"
        >
          <h2 className="sr-room-detail__section-heading">Your queue</h2>
          {activeItem ? (
            <VideoPlayer
              youtubeVideoId={activeItem.video.youtubeVideoId}
              onEnded={handleEnded}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={prevInQueue(queue, activeItem.video.id) !== undefined}
              hasNext={nextInQueue(queue, activeItem.video.id) !== undefined}
            />
          ) : queueItems.length > 0 ? (
            <div className="sr-room-detail__player-placeholder">
              <p>Select a video from the queue below to start watching.</p>
            </div>
          ) : null}
          <WatchQueuePanel
            queue={queue}
            items={queueItems}
            onRemoveFromQueue={handleRemoveFromQueue}
            onSetActive={handleSetActive}
          />
        </div>
      ) : null}
      <RoomFormDialog
        open={isEditOpen}
        mode="edit"
        initialValues={{ name: room.name, description: room.description }}
        onSubmit={handleEditRoom}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
