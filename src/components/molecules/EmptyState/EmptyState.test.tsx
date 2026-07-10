import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(<EmptyState title="No rooms yet" description="Create a room to get started." />);

    expect(screen.getByRole('heading', { name: 'No rooms yet' })).toBeInTheDocument();
    expect(screen.getByText('Create a room to get started.')).toBeInTheDocument();
  });

  it('renders without an action, description, or icon', () => {
    render(<EmptyState title="Nothing here yet" />);

    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('fires onAction when the action button is activated', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    render(
      <EmptyState title="No rooms yet" actionLabel="Create your first room" onAction={handleAction} />,
    );

    await user.click(screen.getByRole('button', { name: 'Create your first room' }));

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('omits the action button when only one of actionLabel/onAction is given', () => {
    render(<EmptyState title="No rooms yet" actionLabel="Create your first room" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the title at the requested heading level', () => {
    render(<EmptyState title="No videos yet" headingLevel="h3" />);

    expect(screen.getByRole('heading', { level: 3, name: 'No videos yet' })).toBeInTheDocument();
  });

  it('hides the icon from assistive tech', () => {
    render(<EmptyState title="No rooms yet" icon={<svg data-testid="icon" />} />);

    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
