import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

type ButtonBaseProps = {
  /** Visual style; defaults to `primary`. */
  variant?: ButtonVariant;
  /** Sizing scale; defaults to `md`. */
  size?: ButtonSize;
  /** Shows a spinner and marks the button `aria-busy`, suppressing clicks while preserving its accessible name. */
  loading?: boolean;
  /** Disables the button/link and suppresses clicks. */
  disabled?: boolean;
  /** Optional leading icon; hidden while `loading`. */
  iconLeft?: ReactNode;
  /** Optional trailing icon; hidden while `loading`. */
  iconRight?: ReactNode;
  /** Visible label. Omit and pass `aria-label` for an icon-only button. */
  children?: ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    /** Renders a real `<button>`. This is the default. */
    as?: 'button';
  };

type ButtonAsAnchorProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    /** Renders a real `<a>` instead of a `<button>`. */
    as: 'a';
    /** Required when `as="a"`. */
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

function buildClassNames(
  variant: ButtonVariant,
  size: ButtonSize,
  loading: boolean,
  isIconOnly: boolean,
  className?: string,
) {
  return [
    'sr-button',
    `sr-button--${variant}`,
    `sr-button--${size}`,
    loading && 'sr-button--loading',
    isIconOnly && 'sr-button--icon-only',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

function Spinner() {
  return (
    <svg
      className="sr-button__spinner"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="sr-button__spinner-track"
        cx="12"
        cy="12"
        r="10"
        fill="none"
        strokeWidth="3"
      />
      <path
        className="sr-button__spinner-arc"
        d="M12 2a10 10 0 0 1 10 10"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function renderContent(loading: boolean, iconLeft: ReactNode, iconRight: ReactNode, children: ReactNode) {
  return (
    <>
      {loading ? (
        <Spinner />
      ) : iconLeft ? (
        <span className="sr-button__icon" aria-hidden="true">
          {iconLeft}
        </span>
      ) : null}
      {children ? <span className="sr-button__label">{children}</span> : null}
      {!loading && iconRight ? (
        <span className="sr-button__icon" aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
    </>
  );
}

/**
 * A token-driven action trigger, rendering a real `<button>` by default or
 * a real `<a>` via `as="a"`/`href`. Supports `primary`/`secondary`/`ghost`
 * variants, `sm`/`md` sizes, an accessible `loading` state, and icon-only
 * usage (omit `children`, pass `aria-label`).
 */
export function Button(props: ButtonProps) {
  if (props.as === 'a') {
    const {
      as,
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      children,
      className,
      disabled,
      onClick,
      tabIndex,
      ...anchorRest
    } = props;
    void as;

    const isDisabled = Boolean(disabled) || loading;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <a
        {...anchorRest}
        className={buildClassNames(variant, size, loading, !children, className)}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : tabIndex}
        onClick={handleClick}
      >
        {renderContent(loading, iconLeft, iconRight, children)}
      </a>
    );
  }

  const {
    as,
    variant = 'primary',
    size = 'md',
    loading = false,
    iconLeft,
    iconRight,
    children,
    className,
    disabled,
    type,
    ...buttonRest
  } = props;
  void as;

  return (
    <button
      {...buttonRest}
      type={type ?? 'button'}
      className={buildClassNames(variant, size, loading, !children, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {renderContent(loading, iconLeft, iconRight, children)}
    </button>
  );
}
