import { useId, useState } from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import type { SubscriptionChannel } from '../../../types/channel';
import './ChannelAssignmentList.css';

export type ChannelAssignmentListProps = {
  /** The user's full synced channel list, sourced from `useYoutubeSyncContext()` — not `mockChannels.ts`. */
  channels: SubscriptionChannel[];
  /** The current room's assigned channel ids. */
  assignedChannelIds: string[];
  /** Called with a channel's id when it's checked. */
  onAssign: (channelId: string) => void;
  /** Called with a channel's id when it's unchecked. */
  onUnassign: (channelId: string) => void;
  /** Called when the "no synced channels" empty state's action is activated. Omit to hide the action. */
  onConnectAccount?: () => void;
  /** Video category names to show as tags under each channel, derived from that channel's synced videos (e.g. "Gaming", "Music"). Also drives the category filter chips — their union across all channels is offered as toggleable filters. Omit or leave empty for a channel to show no tags or filter chips. */
  categoryNamesByChannelId?: Map<string, string[]>;
};

function ChannelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function ChannelThumbnail({ channel }: { channel: SubscriptionChannel }) {
  if (channel.thumbnailUrl) {
    return (
      <span className="sr-channel-assignment-list__thumbnail">
        <img src={channel.thumbnailUrl} alt="" className="sr-channel-assignment-list__thumbnail-image" />
      </span>
    );
  }

  return (
    <span className="sr-channel-assignment-list__thumbnail sr-channel-assignment-list__thumbnail--fallback" aria-hidden="true">
      <ChannelIcon />
    </span>
  );
}

type ChannelGroupProps = {
  legend: string;
  channels: SubscriptionChannel[];
  assignedSet: Set<string>;
  onAssign: (channelId: string) => void;
  onUnassign: (channelId: string) => void;
  categoryNamesByChannelId?: Map<string, string[]>;
};

function ChannelGroup({
  legend,
  channels,
  assignedSet,
  onAssign,
  onUnassign,
  categoryNamesByChannelId,
}: ChannelGroupProps) {
  return (
    <fieldset className="sr-channel-assignment-list__group">
      <legend className="sr-channel-assignment-list__legend">{legend}</legend>
      <ul className="sr-channel-assignment-list__items">
        {channels.map((channel) => {
          const assigned = assignedSet.has(channel.id);
          const categoryNames = categoryNamesByChannelId?.get(channel.id) ?? [];
          return (
            <li
              key={channel.id}
              className={`sr-channel-assignment-list__item${assigned ? ' sr-channel-assignment-list__item--assigned' : ''}`}
            >
              <label className="sr-channel-assignment-list__label">
                <input
                  type="checkbox"
                  className="sr-visually-hidden"
                  checked={assigned}
                  onChange={() => (assigned ? onUnassign(channel.id) : onAssign(channel.id))}
                  aria-label={channel.title}
                />
                <ChannelThumbnail channel={channel} />
                <span className="sr-channel-assignment-list__body">
                  <span className="sr-channel-assignment-list__title">{channel.title}</span>
                  {categoryNames.length > 0 ? (
                    <span className="sr-channel-assignment-list__tags">
                      {categoryNames.map((name) => (
                        <Badge key={name} tone="neutral">
                          {name}
                        </Badge>
                      ))}
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/**
 * Lets a user assign/unassign a room's channels from their full synced
 * channel list via checkboxes. Renders an `EmptyState` when there are no
 * synced channels at all, distinct from a room simply having none assigned
 * yet — that distinction is the caller's to draw with `RoomDetailPage`'s own
 * empty-state copy for the video feed.
 */
export function ChannelAssignmentList({
  channels,
  assignedChannelIds,
  onAssign,
  onUnassign,
  onConnectAccount,
  categoryNamesByChannelId,
}: ChannelAssignmentListProps) {
  const filterInputId = useId();
  const [filter, setFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  if (channels.length === 0) {
    return (
      <div className="sr-channel-assignment-list sr-channel-assignment-list--empty">
        <EmptyState
          headingLevel="h3"
          title="No synced channels yet"
          description="Connect your YouTube account to assign channels to this room."
          actionLabel={onConnectAccount ? 'Go to Settings' : undefined}
          onAction={onConnectAccount}
        />
      </div>
    );
  }

  const assignedSet = new Set(assignedChannelIds);
  const trimmedFilter = filter.trim().toLowerCase();
  const textFilteredChannels = trimmedFilter
    ? channels.filter((channel) => channel.title.toLowerCase().includes(trimmedFilter))
    : channels;

  const availableCategoryNames = Array.from(
    new Set(Array.from(categoryNamesByChannelId?.values() ?? []).flat()),
  ).sort((a, b) => a.localeCompare(b));

  const selectedCategorySet = new Set(selectedCategories);
  const filteredChannels =
    selectedCategorySet.size === 0
      ? textFilteredChannels
      : textFilteredChannels.filter((channel) => {
          const channelCategories = categoryNamesByChannelId?.get(channel.id) ?? [];
          return channelCategories.some((name) => selectedCategorySet.has(name));
        });

  function toggleCategory(name: string) {
    setSelectedCategories((current) =>
      current.includes(name) ? current.filter((existing) => existing !== name) : [...current, name],
    );
  }

  const assignedChannels = filteredChannels.filter((channel) => assignedSet.has(channel.id));
  const unassignedChannels = filteredChannels.filter((channel) => !assignedSet.has(channel.id));
  const hasNoMatches = filteredChannels.length === 0;

  const resultCountMessage =
    filteredChannels.length === 1 ? '1 channel shown' : `${filteredChannels.length} channels shown`;

  return (
    <div className="sr-channel-assignment-list">
      <div className="sr-channel-assignment-list__filter">
        <label className="sr-channel-assignment-list__filter-label" htmlFor={filterInputId}>
          Filter channels
        </label>
        <input
          id={filterInputId}
          type="text"
          className="sr-channel-assignment-list__filter-input"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search by channel name"
        />
      </div>
      {availableCategoryNames.length > 0 ? (
        <div className="sr-channel-assignment-list__categories" role="group" aria-label="Filter by category">
          {availableCategoryNames.map((name) => {
            const isSelected = selectedCategorySet.has(name);
            return (
              <button
                key={name}
                type="button"
                className={`sr-channel-assignment-list__category-chip${isSelected ? ' sr-channel-assignment-list__category-chip--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => toggleCategory(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
      ) : null}
      <p className="sr-visually-hidden" role="status" aria-live="polite">
        {resultCountMessage}
      </p>
      {hasNoMatches ? (
        <div className="sr-channel-assignment-list__no-matches">
          <EmptyState
            headingLevel="h4"
            title={trimmedFilter ? `No channels match '${filter.trim()}'` : 'No channels match the selected categories'}
            description={
              trimmedFilter && selectedCategorySet.size > 0
                ? 'Try a different search term or category.'
                : trimmedFilter
                  ? 'Try a different search term.'
                  : 'Try a different category.'
            }
          />
        </div>
      ) : (
        <>
          {assignedChannels.length > 0 ? (
            <ChannelGroup
              legend="Assigned"
              channels={assignedChannels}
              assignedSet={assignedSet}
              onAssign={onAssign}
              onUnassign={onUnassign}
              categoryNamesByChannelId={categoryNamesByChannelId}
            />
          ) : null}
          {unassignedChannels.length > 0 ? (
            <div className="sr-channel-assignment-list__scroll">
              <ChannelGroup
                legend={assignedChannels.length > 0 ? 'Unassigned' : 'All channels'}
                channels={unassignedChannels}
                assignedSet={assignedSet}
                onAssign={onAssign}
                onUnassign={onUnassign}
                categoryNamesByChannelId={categoryNamesByChannelId}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
