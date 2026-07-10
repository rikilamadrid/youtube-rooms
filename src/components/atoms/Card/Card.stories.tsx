import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Card } from './Card';

const handleCardButtonClick = fn();

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

function RoomSummary() {
  return (
    <>
      <h3 style={{ margin: 0 }}>Weeknight Cooking</h3>
      <p style={{ margin: 'var(--sr-space-2) 0 0' }}>12 channels &middot; 48 videos queued</p>
    </>
  );
}

export const Static: Story = {
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <Card padding={args.padding}>
        <RoomSummary />
      </Card>
    </div>
  ),
};

export const InteractiveAsLink: Story = {
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <Card as="a" href="#" padding={args.padding}>
        <RoomSummary />
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link');

    await expect(link).toHaveAttribute('href', '#');
  },
};

export const InteractiveAsButton: Story = {
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <Card as="button" onClick={handleCardButtonClick} padding={args.padding}>
        <RoomSummary />
      </Card>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    handleCardButtonClick.mockClear();
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(handleCardButtonClick).toHaveBeenCalledTimes(1);

    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(handleCardButtonClick).toHaveBeenCalledTimes(2);
  },
};

export const VariedContentLengths: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--sr-space-4)', flexWrap: 'wrap' }}>
      <div style={{ width: '14rem' }}>
        <Card padding={args.padding}>
          <h3 style={{ margin: 0 }}>Short</h3>
        </Card>
      </div>
      <div style={{ width: '14rem' }}>
        <Card padding={args.padding}>
          <h3 style={{ margin: 0 }}>A Much Longer Room Title That Wraps</h3>
          <p style={{ margin: 'var(--sr-space-2) 0 0' }}>
            This room has a longer description to show how the card handles more content without
            breaking its layout or proportions.
          </p>
        </Card>
      </div>
    </div>
  ),
};
