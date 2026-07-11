import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Tabs, type TabItem } from './Tabs';

const tabs: TabItem[] = [
  { id: 'channels', label: 'Channels', panelId: 'panel-channels' },
  { id: 'videos', label: 'Videos', panelId: 'panel-videos' },
  { id: 'queue', label: 'Queue', panelId: 'panel-queue' },
];

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Room sections',
    tabs,
    onTabChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Typical: Story = {
  args: {
    activeTabId: 'channels',
  },
};

export const QueueActive: Story = {
  args: {
    activeTabId: 'queue',
  },
};

export const Interactive: Story = {
  render: (args) => {
    function InteractiveTabs() {
      const [activeTabId, setActiveTabId] = useState('channels');
      return (
        <Tabs
          {...args}
          activeTabId={activeTabId}
          onTabChange={(id) => {
            args.onTabChange?.(id);
            setActiveTabId(id);
          }}
        />
      );
    }
    return <InteractiveTabs />;
  },
  play: async ({ canvas, userEvent }) => {
    const channelsTab = canvas.getByRole('tab', { name: 'Channels' });
    const videosTab = canvas.getByRole('tab', { name: 'Videos' });
    const queueTab = canvas.getByRole('tab', { name: 'Queue' });

    await expect(channelsTab).toHaveAttribute('aria-selected', 'true');
    await expect(videosTab).toHaveAttribute('tabindex', '-1');

    await userEvent.click(videosTab);
    await expect(videosTab).toHaveAttribute('aria-selected', 'true');

    videosTab.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(queueTab).toHaveAttribute('aria-selected', 'true');
    await expect(queueTab).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(channelsTab).toHaveAttribute('aria-selected', 'true');
    await expect(channelsTab).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(queueTab).toHaveAttribute('aria-selected', 'true');
  },
};
