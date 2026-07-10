import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mockRooms } from '../../data/mockRooms';
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

describe('DashboardPage', () => {
  it('renders a room card for every mock room', () => {
    renderDashboard();

    expect(screen.getAllByRole('listitem')).toHaveLength(mockRooms.length);
    expect(
      screen.getByRole('button', { name: `Open ${mockRooms[0].name} room` }),
    ).toBeInTheDocument();
  });

  it('navigates to the room detail route when a room is activated', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.click(screen.getByRole('button', { name: `Open ${mockRooms[0].name} room` }));

    expect(screen.getByText('Room detail placeholder')).toBeInTheDocument();
  });
});
