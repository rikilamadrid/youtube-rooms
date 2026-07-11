import type { Room } from '../types/room';

const STORAGE_KEY = 'subrooms:rooms:v1';

function isRoom(value: unknown): value is Room {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.channelIds) &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
}

/**
 * Reads locally-persisted rooms from `localStorage`. Returns an empty list
 * if nothing is stored yet, storage is unavailable, or the stored value is
 * malformed — this is the only source of truth for rooms, so it must never
 * throw.
 */
export function loadRooms(): Room[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isRoom) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the full room list to `localStorage`, replacing whatever was
 * stored before. Swallows write errors (e.g. quota exceeded, storage
 * disabled) since room data can always be recreated by the user.
 */
export function saveRooms(rooms: Room[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch {
    // Ignore storage write failures; in-memory state remains the source of
    // truth for the rest of the session.
  }
}
