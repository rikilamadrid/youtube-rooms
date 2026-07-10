import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, fn } from 'storybook/test';
import { EmptyState } from './EmptyState';

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12h4l1.5 3h5L16 12h4M4 12l1.5-6.5A2 2 0 0 1 7.44 4h9.12a2 2 0 0 1 1.94 1.5L20 12M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"
      />
    </svg>
  );
}

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

function Frame({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: '28rem', margin: '0 auto' }}>{children}</div>;
}

export const NoRoomsYet: Story = {
  render: () => (
    <Frame>
      <EmptyState
        icon={<InboxIcon />}
        title="No rooms yet"
        description="Create a room to start organizing your subscriptions around a topic or mood."
        actionLabel="Create your first room"
        onAction={fn()}
      />
    </Frame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No rooms yet' })).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Create your first room' }),
    ).toBeInTheDocument();
  },
};

export const NoChannelsInRoom: Story = {
  render: () => (
    <Frame>
      <EmptyState
        icon={<InboxIcon />}
        title="No channels assigned"
        description="Add channels to this room to start seeing their videos here."
        actionLabel="Add channels"
        onAction={fn()}
      />
    </Frame>
  ),
};

export const NoVideosInFeed: Story = {
  render: () => (
    <Frame>
      <EmptyState
        title="No videos yet"
        description="Channels in this room haven't posted anything new. Check back later."
      />
    </Frame>
  ),
};

export const EmptyQueue: Story = {
  render: () => (
    <Frame>
      <EmptyState
        icon={<InboxIcon />}
        title="Your queue is empty"
        description="Add videos from a room feed to build up your next watch session."
        actionLabel="Browse rooms"
        onAction={fn()}
      />
    </Frame>
  ),
};

export const NoActionVariant: Story = {
  render: () => (
    <Frame>
      <EmptyState title="Nothing here yet" />
    </Frame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const InPageContext: Story = {
  render: () => (
    <Frame>
      <h1>Weeknight Cooking</h1>
      <section>
        <h2>Videos</h2>
        <EmptyState
          headingLevel="h3"
          title="No videos yet"
          description="Channels in this room haven't posted anything new. Check back later."
        />
      </section>
    </Frame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Weeknight Cooking',
    );
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Videos');
    await expect(canvas.getByRole('heading', { level: 3 })).toHaveTextContent('No videos yet');
  },
};
