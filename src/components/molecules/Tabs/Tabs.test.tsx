import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, type TabItem } from './Tabs';

const tabs: TabItem[] = [
  { id: 'channels', label: 'Channels', panelId: 'panel-channels' },
  { id: 'videos', label: 'Videos', panelId: 'panel-videos' },
  { id: 'queue', label: 'Queue', panelId: 'panel-queue' },
];

describe('Tabs', () => {
  it('renders a tablist with an accessible name and one tab per item', () => {
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="channels" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tablist', { name: 'Room sections' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('marks the active tab as selected and links it to its panel', () => {
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="videos" onTabChange={vi.fn()} />);

    const videosTab = screen.getByRole('tab', { name: 'Videos' });
    expect(videosTab).toHaveAttribute('aria-selected', 'true');
    expect(videosTab).toHaveAttribute('aria-controls', 'panel-videos');
    expect(screen.getByRole('tab', { name: 'Channels' })).toHaveAttribute('aria-selected', 'false');
  });

  it('only keeps the active tab in the page tab order', () => {
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="channels" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'Channels' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Videos' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: 'Queue' })).toHaveAttribute('tabindex', '-1');
  });

  it('calls onTabChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="channels" onTabChange={handleChange} />);

    await user.click(screen.getByRole('tab', { name: 'Queue' }));

    expect(handleChange).toHaveBeenCalledWith('queue');
  });

  it('moves focus and activates the next tab on ArrowRight, wrapping at the end', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="queue" onTabChange={handleChange} />);

    screen.getByRole('tab', { name: 'Queue' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(handleChange).toHaveBeenCalledWith('channels');
  });

  it('moves focus and activates the previous tab on ArrowLeft, wrapping at the start', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="channels" onTabChange={handleChange} />);

    screen.getByRole('tab', { name: 'Channels' }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(handleChange).toHaveBeenCalledWith('queue');
  });

  it('jumps to the first and last tab on Home and End', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs label="Room sections" tabs={tabs} activeTabId="videos" onTabChange={handleChange} />);

    screen.getByRole('tab', { name: 'Videos' }).focus();
    await user.keyboard('{End}');
    expect(handleChange).toHaveBeenLastCalledWith('queue');

    await user.keyboard('{Home}');
    expect(handleChange).toHaveBeenLastCalledWith('channels');
  });
});
