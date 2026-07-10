const ISO_8601_DURATION_PATTERN = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Formats a YouTube-style ISO 8601 duration ("PT1H2M3S") as clock time
 * ("1:02:03"), matching the mm:ss / h:mm:ss convention viewers expect.
 * Returns null for missing or unrecognized input so callers can omit the
 * duration entirely instead of showing a broken string.
 */
export function formatDuration(duration: string | undefined): string | null {
  if (!duration) {
    return null;
  }

  const match = ISO_8601_DURATION_PATTERN.exec(duration);
  if (!match) {
    return null;
  }

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours === 0 && minutes === 0 && seconds === 0) {
    return null;
  }

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${minutes}:${pad(seconds)}`;
}
