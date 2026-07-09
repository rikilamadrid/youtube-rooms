import type { MouseEvent } from 'react';
import { Card } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import type { BadgeTone } from '../../atoms/Badge/Badge';
import type { Room } from '../../../types/room';
import './RoomCard.css';

type RoomCardBaseProps = {
  room: Room;
  channelCount?: number;
};

type RoomCardAsLinkProps = RoomCardBaseProps & {
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type RoomCardAsButtonProps = RoomCardBaseProps & {
  href?: undefined;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type RoomCardProps = RoomCardAsLinkProps | RoomCardAsButtonProps;

function isLinkProps(props: RoomCardProps): props is RoomCardAsLinkProps {
  return typeof props.href === 'string';
}

function getInitial(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

function RoomIcon({ room }: { room: Room }) {
  const { iconName, name } = room;
  const glyph = iconName ? getInitial(iconName) : getInitial(name);

  return (
    <span
      className={
        iconName ? 'sr-room-card__icon sr-room-card__icon--custom' : 'sr-room-card__icon'
      }
      aria-hidden="true"
    >
      {glyph}
    </span>
  );
}

function getChannelBadge(count: number): { tone: BadgeTone; label: string } {
  if (count === 0) {
    return { tone: 'neutral', label: 'No channels yet' };
  }
  return { tone: 'accent', label: `${count} channel${count === 1 ? '' : 's'}` };
}

export function RoomCard(props: RoomCardProps) {
  const { room, channelCount } = props;
  const count = channelCount ?? room.channelIds.length;
  const badge = getChannelBadge(count);
  const accessibleName = `Open ${room.name} room`;

  const content = (
    <span className="sr-room-card">
      <RoomIcon room={room} />
      <span className="sr-room-card__body">
        <span className="sr-room-card__name">{room.name}</span>
        {room.description ? (
          <span className="sr-room-card__description">{room.description}</span>
        ) : null}
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </span>
    </span>
  );

  if (isLinkProps(props)) {
    return (
      <Card as="a" href={props.href} onClick={props.onClick} aria-label={accessibleName}>
        {content}
      </Card>
    );
  }

  return (
    <Card as="button" onClick={props.onClick} aria-label={accessibleName}>
      {content}
    </Card>
  );
}
