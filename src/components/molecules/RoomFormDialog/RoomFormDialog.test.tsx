import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoomFormDialog } from './RoomFormDialog';

describe('RoomFormDialog', () => {
  it('renders blank fields and a "Create room" title in create mode', () => {
    render(<RoomFormDialog open mode="create" onSubmit={vi.fn()} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Create room' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create room' })).toBeInTheDocument();
  });

  it('pre-fills fields and shows an "Edit room" title in edit mode', () => {
    render(
      <RoomFormDialog
        open
        mode="edit"
        initialValues={{ name: 'Coding', description: 'Dev stuff' }}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Edit room' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Coding');
    expect(screen.getByLabelText('Description (optional)')).toHaveValue('Dev stuff');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('submits trimmed name and description', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<RoomFormDialog open mode="create" onSubmit={handleSubmit} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Name'), '  Coding  ');
    await user.type(screen.getByLabelText('Description (optional)'), '  Dev stuff  ');
    await user.click(screen.getByRole('button', { name: 'Create room' }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: 'Coding', description: 'Dev stuff' });
  });

  it('submits undefined description when left blank', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<RoomFormDialog open mode="create" onSubmit={handleSubmit} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Name'), 'Coding');
    await user.click(screen.getByRole('button', { name: 'Create room' }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: 'Coding', description: undefined });
  });

  it('does not submit when the name is blank', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<RoomFormDialog open mode="create" onSubmit={handleSubmit} onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Create room' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('fires onClose when Cancel is activated', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<RoomFormDialog open mode="create" onSubmit={vi.fn()} onClose={handleClose} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
