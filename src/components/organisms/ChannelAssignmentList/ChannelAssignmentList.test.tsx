import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChannelAssignmentList } from './ChannelAssignmentList';
import type { SubscriptionChannel } from '../../../types/channel';

function makeChannel(overrides: Partial<SubscriptionChannel> = {}): SubscriptionChannel {
  return {
    id: 'channel-1',
    youtubeChannelId: 'UC1',
    title: 'Fireship',
    topicTags: [],
    ...overrides,
  };
}

describe('ChannelAssignmentList', () => {
  it('renders an empty state when there are no synced channels', () => {
    render(
      <ChannelAssignmentList
        channels={[]}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'No synced channels yet' })).toBeInTheDocument();
  });

  it('omits the connect action when onConnectAccount is not given', () => {
    render(
      <ChannelAssignmentList
        channels={[]}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('fires onConnectAccount when the empty-state action is activated', async () => {
    const user = userEvent.setup();
    const handleConnect = vi.fn();
    render(
      <ChannelAssignmentList
        channels={[]}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
        onConnectAccount={handleConnect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Go to Settings' }));

    expect(handleConnect).toHaveBeenCalledTimes(1);
  });

  it('renders a checkbox per channel, checked for assigned channels', () => {
    const channels = [makeChannel(), makeChannel({ id: 'channel-2', title: 'Primeagen' })];
    render(
      <ChannelAssignmentList
        channels={channels}
        assignedChannelIds={['channel-1']}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Fireship' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Primeagen' })).not.toBeChecked();
  });

  it('fires onAssign when an unchecked channel is checked', async () => {
    const user = userEvent.setup();
    const handleAssign = vi.fn();
    render(
      <ChannelAssignmentList
        channels={[makeChannel()]}
        assignedChannelIds={[]}
        onAssign={handleAssign}
        onUnassign={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Fireship' }));

    expect(handleAssign).toHaveBeenCalledWith('channel-1');
  });

  it('fires onUnassign when a checked channel is unchecked', async () => {
    const user = userEvent.setup();
    const handleUnassign = vi.fn();
    render(
      <ChannelAssignmentList
        channels={[makeChannel()]}
        assignedChannelIds={['channel-1']}
        onAssign={vi.fn()}
        onUnassign={handleUnassign}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Fireship' }));

    expect(handleUnassign).toHaveBeenCalledWith('channel-1');
  });

  it('groups assigned channels separately from unassigned ones', () => {
    const channels = [makeChannel(), makeChannel({ id: 'channel-2', title: 'Primeagen' })];
    render(
      <ChannelAssignmentList
        channels={channels}
        assignedChannelIds={['channel-1']}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    const assignedGroup = screen.getByRole('group', { name: 'Assigned' });
    const unassignedGroup = screen.getByRole('group', { name: 'Unassigned' });

    expect(within(assignedGroup).getByRole('checkbox', { name: 'Fireship' })).toBeInTheDocument();
    expect(within(unassignedGroup).getByRole('checkbox', { name: 'Primeagen' })).toBeInTheDocument();
  });

  it('shows a single "All channels" group when nothing is assigned', () => {
    const channels = [makeChannel(), makeChannel({ id: 'channel-2', title: 'Primeagen' })];
    render(
      <ChannelAssignmentList
        channels={channels}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    expect(screen.getByRole('group', { name: 'All channels' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Assigned' })).not.toBeInTheDocument();
  });

  it('filters channels by title as the user types', async () => {
    const user = userEvent.setup();
    const channels = [makeChannel(), makeChannel({ id: 'channel-2', title: 'Primeagen' })];
    render(
      <ChannelAssignmentList
        channels={channels}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Filter channels'), 'prime');

    expect(screen.getByRole('checkbox', { name: 'Primeagen' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Fireship' })).not.toBeInTheDocument();
  });

  it('shows a distinct empty state when the filter matches nothing', async () => {
    const user = userEvent.setup();
    render(
      <ChannelAssignmentList
        channels={[makeChannel()]}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Filter channels'), 'zzz');

    expect(screen.getByRole('heading', { name: "No channels match 'zzz'" })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('announces the visible result count for assistive tech', async () => {
    const user = userEvent.setup();
    const channels = [makeChannel(), makeChannel({ id: 'channel-2', title: 'Primeagen' })];
    render(
      <ChannelAssignmentList
        channels={channels}
        assignedChannelIds={[]}
        onAssign={vi.fn()}
        onUnassign={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('2 channels shown');

    await user.type(screen.getByLabelText('Filter channels'), 'prime');

    expect(screen.getByRole('status')).toHaveTextContent('1 channel shown');
  });
});
