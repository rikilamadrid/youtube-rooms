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

  return (
    <fieldset className="sr-channel-assignment-list">
      <legend className="sr-channel-assignment-list__legend">Assign channels</legend>
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
