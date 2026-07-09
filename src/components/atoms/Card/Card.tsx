import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';
import './Card.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

type CardBaseProps = {
  padding?: CardPadding;
  children?: ReactNode;
};

type CardAsDivProps = CardBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> & {
    as?: 'div';
  };

type CardAsButtonProps = CardBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    as: 'button';
  };

type CardAsAnchorProps = CardBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    as: 'a';
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
