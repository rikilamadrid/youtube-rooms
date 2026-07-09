import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

function DotIcon() {
  return (
    <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: {
    children: 'Design systems',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warning'] },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--sr-space-2)' }}>
      <Badge {...args} tone="neutral">
        Neutral
      </Badge>
      <Badge {...args} tone="accent">
        Accent
      </Badge>
      <Badge {...args} tone="success">
        Success
      </Badge>
      <Badge {...args} tone="warning">
        Warning
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    tone: 'success',
    icon: <DotIcon />,
    children: 'Watched',
  },
};

export const WithoutIcon: Story = {
  args: {
    tone: 'accent',
    children: 'New',
  },
};

export const LongTextTruncation: Story = {
  args: {
    tone: 'neutral',
    children: 'A very long channel topic tag that should truncate cleanly',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '160px' }}>
        <Story />
      </div>
    ),
  ],
};
