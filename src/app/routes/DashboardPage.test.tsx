import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/rooms/:roomId" element={<div>Room detail placeholder</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('DashboardPage', () => {
  it('renders the empty state when there are no rooms yet', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: 'No rooms yet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create your first room' })).toBeInTheDocument();
  });

  it('creates a room via the empty state and navigates to it', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.click(screen.getByRole('button', { name: 'Create your first room' }));
    await user.type(screen.getByLabelText('Name'), 'Coding');
    await user.click(screen.getByRole('button', { name: 'Create room' }));

    expect(screen.getByText('Room detail placeholder')).toBeInTheDocument();
  });

  it('persists a created room across a fresh mount, and navigates on activation', async () => {
    const user = userEvent.setup();
    const first = renderDashboard();

    await user.click(screen.getByRole('button', { name: 'Create your first room' }));
    await user.type(screen.getByLabelText('Name'), 'Coding');
    await user.click(screen.getByRole('button', { name: 'Create room' }));
    first.unmount();

    // Fresh mount, same localStorage: proves the room persisted rather than only living in memory.
    renderDashboard();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Open Coding room' }));

    expect(screen.getByText('Room detail placeholder')).toBeInTheDocument();
  });

  it('shows a header "New room" action once a room exists', async () => {
    const user = userEvent.setup();
    const first = renderDashboard();

    await user.click(screen.getByRole('button', { name: 'Create your first room' }));
    await user.type(screen.getByLabelText('Name'), 'Coding');
    await user.click(screen.getByRole('button', { name: 'Create room' }));
    first.unmount();

    renderDashboard();
    expect(screen.getByRole('button', { name: 'New room' })).toBeInTheDocument();
  });
});
