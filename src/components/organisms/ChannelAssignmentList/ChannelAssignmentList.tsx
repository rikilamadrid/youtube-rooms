import { useId, useState } from 'react';
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
};

type ChannelGroupProps = {
  legend: string;
  channels: SubscriptionChannel[];
  assignedSet: Set<string>;
  onAssign: (channelId: string) => void;
  onUnassign: (channelId: string) => void;
};

function ChannelGroup({ legend, channels, assignedSet, onAssign, onUnassign }: ChannelGroupProps) {
  return (
    <fieldset className="sr-channel-assignment-list__group">
      <legend className="sr-channel-assignment-list__legend">{legend}</legend>
      <ul className="sr-channel-assignment-list__items">
        {channels.map((channel) => {
          const assigned = assignedSet.has(channel.id);
          return (
            <li key={channel.id} className="sr-channel-assignment-list__item">
              <label className="sr-channel-assignment-list__label">
                <input
                  type="checkbox"
                  checked={assigned}
                  onChange={() => (assigned ? onUnassign(channel.id) : onAssign(channel.id))}
                />
                <span className="sr-channel-assignment-list__title">{channel.title}</span>
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
}: ChannelAssignmentListProps) {
  const filterInputId = useId();
  const [filter, setFilter] = useState('');

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
  const filteredChannels = trimmedFilter
    ? channels.filter((channel) => channel.title.toLowerCase().includes(trimmedFilter))
    : channels;

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
      <p className="sr-visually-hidden" role="status" aria-live="polite">
        {resultCountMessage}
      </p>
      {hasNoMatches ? (
        <div className="sr-channel-assignment-list__no-matches">
          <EmptyState
            headingLevel="h4"
            title={`No channels match '${filter.trim()}'`}
            description="Try a different search term."
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
            />
          ) : null}
          {unassignedChannels.length > 0 ? (
            <ChannelGroup
              legend={assignedChannels.length > 0 ? 'Unassigned' : 'All channels'}
              channels={unassignedChannels}
              assignedSet={assignedSet}
              onAssign={onAssign}
              onUnassign={onUnassign}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
