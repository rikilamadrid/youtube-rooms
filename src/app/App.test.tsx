import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the app shell and dashboard on the default route', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: 'SubRooms' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Rooms' }),
    ).toBeInTheDocument();
  });
});
