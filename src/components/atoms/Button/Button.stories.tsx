import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Button } from './Button';

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Create room',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Create room' });

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--sr-space-3)' }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sr-space-3)' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Create room' });

    await expect(button).toBeDisabled();

    await userEvent.click(button);

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: { loading: true },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Create room' });

    await expect(button).toHaveAttribute('aria-busy', 'true');

    await userEvent.click(button);

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const WithLeadingIcon: Story = {
  args: { iconLeft: <PlusIcon /> },
};

export const WithTrailingIcon: Story = {
  args: { iconRight: <ArrowRightIcon /> },
};

export const IconOnly: Story = {
  args: {
    children: undefined,
    iconLeft: <PlusIcon />,
    'aria-label': 'Add to queue',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Add to queue' })).toBeInTheDocument();
  },
};

export const AsLink: Story = {
  args: {
    as: 'a',
    href: '#',
    children: 'Go to rooms',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Go to rooms' });

    await expect(link).toHaveAttribute('href', '#');
  },
};
