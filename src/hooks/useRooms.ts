import { useCallback, useEffect, useState } from 'react';
import { loadRooms, saveRooms } from '../utils/roomStorage';
import type { Room } from '../types/room';

export interface RoomInput {
  name: string;
  description?: string;
}

export interface UseRoomsResult {
  rooms: Room[];
  /** Creates a room with no channels assigned and returns it. */
  createRoom: (input: RoomInput) => Room;
  /** Updates a room's name/description in place. */
  updateRoom: (roomId: string, input: RoomInput) => void;
  /** Removes a room entirely. */
  deleteRoom: (roomId: string) => void;
  /** Adds `channelId` to a room's `channelIds`, de-duplicated. */
  assignChannel: (roomId: string, channelId: string) => void;
  /** Removes `channelId` from a room's `channelIds`. */
  unassignChannel: (roomId: string, channelId: string) => void;
}

function generateRoomId(): string {
  return `room-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Owns the locally-persisted room list: create/update/delete rooms and
 * assign/unassign channels to them. Reads from `localStorage` once on
 * mount and writes back on every mutation, so any mounted instance stays
 * in sync with what's on disk without a shared context — rooms are cheap
 * to read/write synchronously, unlike the YouTube sync's network calls.
 */
export function useRooms(): UseRoomsResult {
  const [rooms, setRooms] = useState<Room[]>(() => loadRooms());

  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]);

  const createRoom = useCallback((input: RoomInput): Room => {
    const now = new Date().toISOString();
    const room: Room = {
      id: generateRoomId(),
      name: input.name,
      description: input.description,
      channelIds: [],
      createdAt: now,
      updatedAt: now,
    };
    setRooms((current) => [...current, room]);
    return room;
  }, []);

  const updateRoom = useCallback((roomId: string, input: RoomInput) => {
    setRooms((current) =>
      current.map((room) =>
        room.id === roomId
          ? { ...room, name: input.name, description: input.description, updatedAt: new Date().toISOString() }
          : room,
      ),
    );
  }, []);

  const deleteRoom = useCallback((roomId: string) => {
    setRooms((current) => current.filter((room) => room.id !== roomId));
  }, []);

  const assignChannel = useCallback((roomId: string, channelId: string) => {
    setRooms((current) =>
      current.map((room) =>
        room.id === roomId && !room.channelIds.includes(channelId)
          ? { ...room, channelIds: [...room.channelIds, channelId], updatedAt: new Date().toISOString() }
          : room,
      ),
    );
  }, []);

  const unassignChannel = useCallback((roomId: string, channelId: string) => {
    setRooms((current) =>
      current.map((room) =>
        room.id === roomId
          ? {
              ...room,
              channelIds: room.channelIds.filter((id) => id !== channelId),
              updatedAt: new Date().toISOString(),
            }
          : room,
      ),
    );
  }, []);

  return { rooms, createRoom, updateRoom, deleteRoom, assignChannel, unassignChannel };
}
