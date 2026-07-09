import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('renders children as a static div by default', () => {
    render(<Card>Room contents</Card>);

    const card = screen.getByText('Room contents');
    expect(card.tagName).toBe('DIV');
  });

  it('renders as a link when as="a" is used', () => {
    render(
      <Card as="a" href="/rooms/1">
        Weeknight Cooking
      </Card>,
    );

    const link = screen.getByRole('link', { name: 'Weeknight Cooking' });
    expect(link).toHaveAttribute('href', '/rooms/1');
  });

  it('renders as a button when as="button" is used', () => {
    render(
      <Card as="button" onClick={vi.fn()}>
        Weeknight Cooking
      </Card>,
    );

    const button = screen.getByRole('button', { name: 'Weeknight Cooking' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('fires onClick when an interactive button card is activated by mouse', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Card as="button" onClick={handleClick}>
        Weeknight Cooking
      </Card>,
    );

    await user.click(screen.getByRole('button', { name: 'Weeknight Cooking' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when an interactive button card is activated by keyboard', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Card as="button" onClick={handleClick}>
        Weeknight Cooking
      </Card>,
    );

    await user.tab();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard-focusable when rendered as a link', async () => {
    const user = userEvent.setup();
    render(
      <Card as="a" href="/rooms/1">
        Weeknight Cooking
      </Card>,
    );

    await user.tab();

    expect(screen.getByRole('link', { name: 'Weeknight Cooking' })).toHaveFocus();
  });
});
