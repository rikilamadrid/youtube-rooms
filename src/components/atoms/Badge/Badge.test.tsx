import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its text content', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('defaults to the neutral tone', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New').closest('.sr-badge')).toHaveClass('sr-badge--neutral');
  });

  it.each(['neutral', 'accent', 'success', 'warning'] as const)(
    'applies the %s tone class',
    (tone) => {
      render(<Badge tone={tone}>Status</Badge>);

      expect(screen.getByText('Status').closest('.sr-badge')).toHaveClass(`sr-badge--${tone}`);
    },
  );

  it('hides an optional icon from assistive tech and still exposes the text', () => {
    render(
      <Badge tone="success" icon={<svg data-testid="icon" />}>
        Watched
      </Badge>,
    );

    const icon = screen.getByTestId('icon');
    expect(icon.closest('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText('Watched')).toBeInTheDocument();
  });
});
