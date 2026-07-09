import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders as a real button with an accessible name', () => {
    render(<Button>Create room</Button>);

    const button = screen.getByRole('button', { name: 'Create room' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('fires onClick when activated by mouse', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when activated by keyboard', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);

    await user.tab();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sets aria-busy and suppresses clicks while loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('keeps the accessible name from the label while loading', () => {
    render(<Button loading>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders as an anchor when as="a" is used, and blocks navigation when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button as="a" href="/rooms" disabled onClick={handleClick}>
        Go to rooms
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Go to rooms' });
    expect(link).toHaveAttribute('aria-disabled', 'true');

    await user.click(link);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports an icon-only button with an accessible name from aria-label', () => {
    render(
      <Button aria-label="Add to queue" iconLeft={<svg data-testid="icon" />} />,
    );

    expect(screen.getByRole('button', { name: 'Add to queue' })).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
