import type { Meta, StoryObj } from '@storybook/react-vite';
import { TypeSample } from './Swatch';
import './foundations.css';

const typeTokens = [
  { name: '--sr-font-size-sm', label: 'Small' },
  { name: '--sr-font-size-md', label: 'Medium (base)' },
  { name: '--sr-font-size-lg', label: 'Large' },
  { name: '--sr-font-size-xl', label: 'Extra large' },
];

function TypographyPage() {
  return (
    <div className="sr-foundations-page">
      <h1>Typography</h1>
      <p>
        Font-size tokens defined in <code>tokens.css</code>, rendered from their live computed
        values.
      </p>
      <div>
        {typeTokens.map((token) => (
          <TypeSample key={token.name} name={token.name} label={token.label} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof TypographyPage> = {
  title: 'Foundations/Typography',
  component: TypographyPage,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof TypographyPage>;

export const Typography: Story = {};
