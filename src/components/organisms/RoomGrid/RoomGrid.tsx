import type { ReactNode } from 'react';
import { RoomCard } from '../../molecules/RoomCard/RoomCard';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import type { Room } from '../../../types/room';
import './RoomGrid.css';

type RoomGridBaseProps = {
  /** Rooms to render, one `RoomCard` each. Renders `EmptyState` when empty. */
  rooms: Room[];
  /** Decorative icon shown in the empty state; hidden from assistive tech. */
  emptyStateIcon?: ReactNode;
  /** Called when the empty state's "create a room" action is activated. Omit to hide the action. */
  onCreateRoom?: () => void;
};

type RoomGridAsLinksProps = RoomGridBaseProps & {
  /** Resolves each room to a URL; `RoomCard`s render as links. */
  getHref: (room: Room) => string;
  onRoomSelect?: (room: Room) => void;
};

type RoomGridAsButtonsProps = RoomGridBaseProps & {
  getHref?: undefined;
  /** Fires when a room's `RoomCard` is activated; `RoomCard`s render as buttons. */
  onRoomSelect: (room: Room) => void;
};

export type RoomGridProps = RoomGridAsLinksProps | RoomGridAsButtonsProps;

function isLinkProps(props: RoomGridProps): props is RoomGridAsLinksProps {
  return typeof props.getHref === 'function';
}

/**
 * Arranges a collection of rooms into a responsive, mobile-first grid of
 * `RoomCard`s, or an `EmptyState` when there are none. Presentational only —
 * navigation and room creation are forwarded to the caller via props.
 */
export function RoomGrid(props: RoomGridProps) {
  const { rooms, emptyStateIcon, onCreateRoom } = props;

  if (rooms.length === 0) {
    return (
      <div className="sr-room-grid sr-room-grid--empty">
        <EmptyState
          icon={emptyStateIcon}
          title="No rooms yet"
          description="Create a room to start organizing your subscriptions around a topic or mood."
          actionLabel={onCreateRoom ? 'Create your first room' : undefined}
          onAction={onCreateRoom}
        />
      </div>
    );
  }

  if (isLinkProps(props)) {
    const { getHref, onRoomSelect } = props;
    return (
      <ul className="sr-room-grid">
        {rooms.map((room) => (
          <li key={room.id} className="sr-room-grid__item">
            <RoomCard
              room={room}
              href={getHref(room)}
              onClick={onRoomSelect ? () => onRoomSelect(room) : undefined}
            />
          </li>
        ))}
      </ul>
    );
  }

  const { onRoomSelect } = props;
  return (
    <ul className="sr-room-grid">
      {rooms.map((room) => (
        <li key={room.id} className="sr-room-grid__item">
          <RoomCard room={room} onClick={() => onRoomSelect(room)} />
        </li>
      ))}
    </ul>
  );
}
