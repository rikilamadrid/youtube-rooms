import { describe, expect, it } from 'vitest';
import { formatPublishedDate } from './formatPublishedDate';

const now = new Date('2026-07-09T12:00:00.000Z');

describe('formatPublishedDate', () => {
  it('returns "Just now" for timestamps under a minute old', () => {
    expect(formatPublishedDate('2026-07-09T11:59:30.000Z', now)).toBe('Just now');
  });

  it('formats minutes ago', () => {
    expect(formatPublishedDate('2026-07-09T11:45:00.000Z', now)).toBe('15m ago');
  });

  it('formats hours ago', () => {
    expect(formatPublishedDate('2026-07-09T09:00:00.000Z', now)).toBe('3h ago');
  });

  it('formats days ago', () => {
    expect(formatPublishedDate('2026-07-06T12:00:00.000Z', now)).toBe('3d ago');
  });

  it('falls back to an absolute date once older than a week', () => {
    expect(formatPublishedDate('2026-06-01T12:00:00.000Z', now)).toBe('Jun 1, 2026');
  });

  it('returns an empty string for an unparseable timestamp', () => {
    expect(formatPublishedDate('not-a-date', now)).toBe('');
  });
});
