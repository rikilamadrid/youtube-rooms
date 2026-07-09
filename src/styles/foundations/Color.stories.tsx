import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatch } from './Swatch';
import './foundations.css';

const colorTokens = [
  { name: '--sr-color-bg', label: 'Background' },
  { name: '--sr-color-surface', label: 'Surface' },
  { name: '--sr-color-surface-raised', label: 'Surface raised' },
  { name: '--sr-color-text', label: 'Text' },
  { name: '--sr-color-text-muted', label: 'Text muted' },
  { name: '--sr-color-border', label: 'Border' },
  { name: '--sr-color-accent', label: 'Accent' },
  { name: '--sr-color-accent-strong', label: 'Accent strong' },
  { name: '--sr-color-success', label: 'Success' },
  { name: '--sr-color-success-strong', label: 'Success strong' },
  { name: '--sr-color-warning', label: 'Warning' },
  { name: '--sr-color-warning-strong', label: 'Warning strong' },
];

function ColorPage() {
  return (
    <div className="sr-foundations-page">
      <h1>Color</h1>
      <p>
        Color tokens defined in <code>tokens.css</code>, rendered from their live computed values.
      </p>
      <div className="sr-foundations-grid">
        {colorTokens.map((token) => (
          <ColorSwatch key={token.name} name={token.name} label={token.label} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof ColorPage> = {
  title: 'Foundations/Color',
  component: ColorPage,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof ColorPage>;

export const Colors: Story = {};
