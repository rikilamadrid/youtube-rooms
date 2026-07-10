import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';
import './Card.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

type CardBaseProps = {
  /** Inner spacing, built from spacing tokens; defaults to `md`. */
  padding?: CardPadding;
  children?: ReactNode;
};

type CardAsDivProps = CardBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> & {
    /** Renders a static, non-interactive `<div>`. This is the default. */
    as?: 'div';
  };

type CardAsButtonProps = CardBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    /** Renders an interactive `<button>` surface. */
    as: 'button';
  };

type CardAsAnchorProps = CardBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    /** Renders an interactive `<a>` surface. */
    as: 'a';
    /** Required when `as="a"`. */
    href: string;
  };

export type CardProps = CardAsDivProps | CardAsButtonProps | CardAsAnchorProps;

function buildClassNames(padding: CardPadding, interactive: boolean, className?: string) {
  return [
    'sr-card',
    `sr-card--padding-${padding}`,
    interactive && 'sr-card--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * A generic, token-driven raised-surface container. Renders a static
 * `<div>` by default, or a real `<a>` (`as="a"`, requires `href`) or
 * `<button>` (`as="button"`) when used as an interactive surface —
 * enforced at the type level, so a `div` variant can't accept an
 * `onClick`. Composition is generic via `children`; molecules like
 * `RoomCard`/`VideoCard` define their own header/media/footer layout.
 */
export function Card(props: CardProps) {
  if (props.as === 'a') {
    const { as, padding = 'md', children, className, ...anchorRest } = props;
    void as;

    return (
      <a {...anchorRest} className={buildClassNames(padding, true, className)}>
        {children}
      </a>
    );
  }

  if (props.as === 'button') {
    const { as, padding = 'md', children, className, type, ...buttonRest } = props;
    void as;

    return (
      <button
        {...buttonRest}
        type={type ?? 'button'}
        className={buildClassNames(padding, true, className)}
      >
        {children}
      </button>
    );
  }

  const { as, padding = 'md', children, className, ...divRest } = props;
  void as;

  return (
    <div {...divRest} className={buildClassNames(padding, false, className)}>
      {children}
    </div>
  );
}
