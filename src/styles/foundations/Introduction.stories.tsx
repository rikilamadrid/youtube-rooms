import type { Meta, StoryObj } from '@storybook/react-vite';
import './foundations.css';

function IntroductionPage() {
  return (
    <div className="sr-foundations-page sr-foundations-intro">
      <h1>SubRooms Design System</h1>
      <p>
        SubRooms organizes YouTube subscriptions into custom viewing rooms and focused watch
        queues. This Storybook is the project&apos;s design system catalog — the place to see the
        visual language before any product screens exist.
      </p>
      <h2>How this catalog is organized</h2>
      <ul>
        <li>
          <strong>Foundations</strong> — design tokens (color, typography, spacing) that
          everything else is built from.
        </li>
        <li>
          <strong>Atoms</strong> — the smallest reusable UI pieces, such as buttons and inputs.
        </li>
        <li>
          <strong>Molecules</strong> — small groups of atoms working together, such as form fields
          or list items.
        </li>
        <li>
          <strong>Organisms</strong> — larger, composed sections, such as navigation or room cards.
        </li>
        <li>
          <strong>Templates</strong> — page-level layout scaffolding without real content.
        </li>
      </ul>
      <p>
        Product components arrive in a later feature. Today this catalog exists to make the token
        foundation from <code>tokens.css</code> visible and reviewable.
      </p>
    </div>
  );
}

const meta: Meta<typeof IntroductionPage> = {
  title: 'Introduction',
  component: IntroductionPage,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof IntroductionPage>;

export const Welcome: Story = {};
