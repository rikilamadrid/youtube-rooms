import type { ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './EmptyState.css';

export type EmptyStateHeadingLevel = 'h2' | 'h3' | 'h4';

export type EmptyStateProps = {
  /** Short, encouraging headline (e.g. "No rooms yet"). */
  title: string;
  /** Supporting copy explaining the state or the next step. */
  description?: string;
  /** Optional decorative icon; hidden from assistive tech. */
  icon?: ReactNode;
  /** Label for the optional primary action button. */
  actionLabel?: string;
  /** Called when the primary action button is activated. */
  onAction?: () => void;
  /** Heading element used for `title`; pick the level that fits where this is placed in the page outline. Defaults to `h2`. */
  headingLevel?: EmptyStateHeadingLevel;
};

/**
 * Calm, on-brand placeholder for "nothing here yet" surfaces (empty room
 * lists, empty channel assignments, empty video feeds, empty queues). Fully
 * prop-driven — callers supply their own copy rather than this component
 * assuming a specific surface. `title` renders as a real heading so the
 * empty state isn't silently skipped by assistive tech.
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  headingLevel = 'h2',
}: EmptyStateProps) {
  const Heading = headingLevel;
  const showAction = Boolean(actionLabel && onAction);

  return (
    <div className="sr-empty-state">
      {icon ? (
        <span className="sr-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <Heading className="sr-empty-state__title">{title}</Heading>
      {description ? <p className="sr-empty-state__description">{description}</p> : null}
      {showAction ? (
        <Button className="sr-empty-state__action" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
