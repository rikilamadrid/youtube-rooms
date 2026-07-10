import type { ReactNode } from 'react';
import './Badge.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning';

export type BadgeProps = {
  /** Visual tone conveying status/emphasis; defaults to `neutral`. */
  tone?: BadgeTone;
  /** Optional leading icon; hidden from assistive tech so `children` stays the accessible name. */
  icon?: ReactNode;
  /** The badge label. Truncates with an ellipsis on a single line if it overflows. */
  children: ReactNode;
};

/**
 * A non-interactive label for short status or metadata text (e.g. a
 * channel count or a "Watched" indicator). Never receives focus or click
 * handlers — for interactive affordances use `Button`.
 */
export function Badge({ tone = 'neutral', icon, children }: BadgeProps) {
  return (
    <span className={`sr-badge sr-badge--${tone}`}>
      {icon ? (
        <span className="sr-badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="sr-badge__label">{children}</span>
    </span>
  );
}
