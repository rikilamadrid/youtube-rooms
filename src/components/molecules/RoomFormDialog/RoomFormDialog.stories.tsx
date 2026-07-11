import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { RoomFormDialog } from './RoomFormDialog';

const meta: Meta<typeof RoomFormDialog> = {
  title: 'Molecules/RoomFormDialog',
  component: RoomFormDialog,
  tags: ['autodocs'],
  // Renders as a native <dialog> via showModal(), which sits in the
  // browser's top layer above everything else on the page. Inlined into
  // the Docs page, it covers the docs text entirely — render each story in
  // its own iframe instead so the modal only covers its own frame.
  parameters: { layout: 'padded', docs: { story: { inline: false, iframeHeight: 420 } } },
};

export default meta;

type Story = StoryObj<typeof RoomFormDialog>;

export const Create: Story = {
  args: {
    open: true,
    mode: 'create',
    onSubmit: fn(),
    onClose: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Create room' })).toBeInTheDocument();
    await expect(canvas.getByLabelText('Name')).toHaveValue('');
  },
};

export const Edit: Story = {
  args: {
    open: true,
    mode: 'edit',
    initialValues: { name: 'Coding', description: 'Tutorials, live coding, and engineering war stories.' },
    onSubmit: fn(),
    onClose: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Edit room' })).toBeInTheDocument();
    await expect(canvas.getByLabelText('Name')).toHaveValue('Coding');
  },
};
