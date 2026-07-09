import type { Meta, StoryObj } from '@storybook/react-vite';
import { SpaceSample } from './Swatch';
import './foundations.css';

const spaceTokens = [
  { name: '--sr-space-1', label: 'Space 1' },
  { name: '--sr-space-2', label: 'Space 2' },
  { name: '--sr-space-3', label: 'Space 3' },
  { name: '--sr-space-4', label: 'Space 4' },
  { name: '--sr-space-6', label: 'Space 6' },
  { name: '--sr-space-8', label: 'Space 8' },
];

function SpacingPage() {
  return (
    <div className="sr-foundations-page">
      <h1>Spacing</h1>
      <p>
        Spacing tokens defined in <code>tokens.css</code>, rendered from their live computed
        values.
      </p>
      <div>
        {spaceTokens.map((token) => (
          <SpaceSample key={token.name} name={token.name} label={token.label} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof SpacingPage> = {
  title: 'Foundations/Spacing',
  component: SpacingPage,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof SpacingPage>;

export const Spacing: Story = {};
