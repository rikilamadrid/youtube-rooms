import { beforeEach, describe, expect, it } from 'vitest';
import type { Room } from '../types/room';
import { loadRooms, saveRooms } from './roomStorage';

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'room-1',
    name: 'Coding',
    channelIds: ['channel-1'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('loadRooms', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadRooms()).toEqual([]);
  });

  it('returns previously saved rooms', () => {
    const rooms = [makeRoom(), makeRoom({ id: 'room-2', name: 'Cooking' })];
    saveRooms(rooms);
    expect(loadRooms()).toEqual(rooms);
  });

  it('returns an empty array for malformed JSON', () => {
    localStorage.setItem('subrooms:rooms:v1', 'not json');
    expect(loadRooms()).toEqual([]);
  });

  it('returns an empty array when the stored value is not an array', () => {
    localStorage.setItem('subrooms:rooms:v1', JSON.stringify({ not: 'an array' }));
    expect(loadRooms()).toEqual([]);
  });

  it('filters out malformed entries while keeping valid ones', () => {
    const validRoom = makeRoom();
    localStorage.setItem('subrooms:rooms:v1', JSON.stringify([validRoom, { id: 'missing-fields' }]));
    expect(loadRooms()).toEqual([validRoom]);
  });
});

describe('saveRooms', () => {
  it('overwrites previously stored rooms', () => {
    saveRooms([makeRoom()]);
    saveRooms([makeRoom({ id: 'room-2', name: 'Cooking' })]);
    expect(loadRooms()).toEqual([makeRoom({ id: 'room-2', name: 'Cooking' })]);
  });
});
