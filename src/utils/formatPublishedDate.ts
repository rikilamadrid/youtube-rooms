const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const absoluteFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Formats an ISO 8601 timestamp as a short, human-readable relative date
 * (e.g. "3h ago", "5d ago") and falls back to an absolute date once the
 * gap exceeds a week, so old videos don't read as an implausible "52w ago".
 */
export function formatPublishedDate(publishedAt: string, now: Date = new Date()): string {
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();

  if (Number.isNaN(diffMs)) {
    return '';
  }

  if (diffMs < MINUTE) {
    return 'Just now';
  }
  if (diffMs < HOUR) {
    const minutes = Math.floor(diffMs / MINUTE);
    return `${minutes}m ago`;
  }
  if (diffMs < DAY) {
    const hours = Math.floor(diffMs / HOUR);
    return `${hours}h ago`;
  }
  if (diffMs < WEEK) {
    const days = Math.floor(diffMs / DAY);
    return `${days}d ago`;
  }

  return absoluteFormatter.format(published);
}
