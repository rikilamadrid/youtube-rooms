import { describe, expect, it } from 'vitest';
import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('formats minutes and seconds', () => {
    expect(formatDuration('PT12M34S')).toBe('12:34');
  });

  it('formats hours, minutes, and seconds, zero-padding minutes/seconds', () => {
    expect(formatDuration('PT1H2M3S')).toBe('1:02:03');
  });

  it('formats seconds-only durations under a minute', () => {
    expect(formatDuration('PT45S')).toBe('0:45');
  });

  it('formats minutes-only durations', () => {
    expect(formatDuration('PT5M')).toBe('5:00');
  });

  it('returns null for undefined input', () => {
    expect(formatDuration(undefined)).toBeNull();
  });

  it('returns null for a zero-length duration', () => {
    expect(formatDuration('PT0S')).toBeNull();
  });

  it('returns null for an unrecognized format', () => {
    expect(formatDuration('12:34')).toBeNull();
  });
});
