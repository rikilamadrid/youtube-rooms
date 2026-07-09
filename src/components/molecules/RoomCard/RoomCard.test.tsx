import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Room } from '../../../types/room';
import { RoomCard } from './RoomCard';

const room: Room = {
  id: 'room-1',
  name: 'Weeknight Cooking',
  description: 'Quick, low-effort dinners for busy weeknights.',
  channelIds: ['channel-1', 'channel-2'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('RoomCard', () => {
  it('renders the room name, description, and channel-count badge', () => {
    render(<RoomCard room={room} href="/rooms/room-1" />);

    expect(screen.getByText('Weeknight Cooking')).toBeInTheDocument();
    expect(screen.getByText('Quick, low-effort dinners for busy weeknights.')).toBeInTheDocument();
    expect(screen.getByText('2 channels')).toBeInTheDocument();
  });

  it('exposes an accessible name that includes the room name', () => {
    render(<RoomCard room={room} href="/rooms/room-1" />);

    expect(
      screen.getByRole('link', { name: 'Open Weeknight Cooking room' }),
    ).toBeInTheDocument();
  });

  it('renders as a link with the given href', () => {
    render(<RoomCard room={room} href="/rooms/room-1" />);

    expect(screen.getByRole('link', { name: 'Open Weeknight Cooking room' })).toHaveAttribute(
      'href',
      '/rooms/room-1',
    );
  });

  it('renders as a button and fires onClick when no href is given', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<RoomCard room={room} onClick={handleClick} />);

    await user.click(screen.getByRole('button', { name: 'Open Weeknight Cooking room' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('triggers the callback via keyboard activation', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<RoomCard room={room} onClick={handleClick} />);

    await user.tab();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders distinct, non-broken guidance copy for a zero-channel room', () => {
    render(<RoomCard room={{ ...room, channelIds: [] }} href="/rooms/room-1" />);

    expect(screen.getByText('No channels yet')).toBeInTheDocument();
    expect(screen.queryByText('0 channels')).not.toBeInTheDocument();
  });

  it('uses an explicit channelCount over the room channelIds length when provided', () => {
    render(<RoomCard room={room} channelCount={5} href="/rooms/room-1" />);

    expect(screen.getByText('5 channels')).toBeInTheDocument();
  });

  it('omits the description when the room has none', () => {
    render(<RoomCard room={{ ...room, description: undefined }} href="/rooms/room-1" />);

    expect(
      screen.queryByText('Quick, low-effort dinners for busy weeknights.'),
    ).not.toBeInTheDocument();
  });

  it('renders a decorative icon marker hidden from assistive tech', () => {
    render(<RoomCard room={{ ...room, iconName: 'cooking' }} href="/rooms/room-1" />);

    expect(screen.getByText('C').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
