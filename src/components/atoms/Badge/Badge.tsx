import type { ReactNode } from 'react';
import './Badge.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning';

export type BadgeProps = {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
};

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
