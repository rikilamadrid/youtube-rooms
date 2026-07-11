import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRooms } from './useRooms';

beforeEach(() => {
  localStorage.clear();
});

describe('useRooms', () => {
  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useRooms());
    expect(result.current.rooms).toEqual([]);
  });

  it('creates a room with no channels assigned', () => {
    const { result } = renderHook(() => useRooms());

    let created;
    act(() => {
      created = result.current.createRoom({ name: 'Coding', description: 'Dev stuff' });
    });

    expect(result.current.rooms).toHaveLength(1);
    expect(result.current.rooms[0]).toMatchObject({
      name: 'Coding',
      description: 'Dev stuff',
      channelIds: [],
    });
    expect(result.current.rooms[0]).toEqual(created);
  });

  it('persists created rooms across hook instances', () => {
    const first = renderHook(() => useRooms());
    act(() => {
      first.result.current.createRoom({ name: 'Coding' });
    });

    const second = renderHook(() => useRooms());
    expect(second.result.current.rooms).toHaveLength(1);
    expect(second.result.current.rooms[0].name).toBe('Coding');
  });

  it('updates a room name and description', () => {
    const { result } = renderHook(() => useRooms());
    let roomId = '';
    act(() => {
      roomId = result.current.createRoom({ name: 'Coding' }).id;
    });

    act(() => {
      result.current.updateRoom(roomId, { name: 'Software', description: 'Renamed' });
    });

    expect(result.current.rooms[0]).toMatchObject({ name: 'Software', description: 'Renamed' });
  });

  it('deletes a room', () => {
    const { result } = renderHook(() => useRooms());
    let roomId = '';
    act(() => {
      roomId = result.current.createRoom({ name: 'Coding' }).id;
    });

    act(() => {
      result.current.deleteRoom(roomId);
    });

    expect(result.current.rooms).toEqual([]);
  });

  it('assigns a channel without duplicating it', () => {
    const { result } = renderHook(() => useRooms());
    let roomId = '';
    act(() => {
      roomId = result.current.createRoom({ name: 'Coding' }).id;
    });

    act(() => {
      result.current.assignChannel(roomId, 'channel-1');
    });
    act(() => {
      result.current.assignChannel(roomId, 'channel-1');
    });

    expect(result.current.rooms[0].channelIds).toEqual(['channel-1']);
  });

  it('unassigns a channel', () => {
    const { result } = renderHook(() => useRooms());
    let roomId = '';
    act(() => {
      roomId = result.current.createRoom({ name: 'Coding' }).id;
    });
    act(() => {
      result.current.assignChannel(roomId, 'channel-1');
    });

    act(() => {
      result.current.unassignChannel(roomId, 'channel-1');
    });

    expect(result.current.rooms[0].channelIds).toEqual([]);
  });
});
