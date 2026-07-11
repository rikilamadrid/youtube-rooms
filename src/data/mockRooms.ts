import type { Room } from '../types/room';

/**
 * Storybook/dev-fixture data only as of feature 19 (room/channel
 * assignment) — no route imports this anymore. Real sessions start with
 * zero rooms via `useRooms()` (localStorage-backed); these mock rooms'
 * channelIds only resolve against `mockChannels.ts`, not real synced
 * channel ids, so they can't be used as runtime seed data.
 *
 * channelIds are cross-referenced by id against mockChannels.ts. Keep ids stable.
 */
export const mockRooms: Room[] = [
  {
    id: 'room-coding',
    name: 'Coding',
    description: 'Tutorials, live coding, and engineering war stories.',
    iconName: 'code',
    channelIds: ['channel-fireship', 'channel-theprimeagen'],
    createdAt: '2026-01-12T09:00:00.000Z',
    updatedAt: '2026-06-30T14:20:00.000Z',
  },
  {
    id: 'room-cooking',
    name: 'Cooking',
    description: 'Recipes worth trying and technique worth stealing.',
    iconName: 'chef-hat',
    channelIds: ['channel-bon-appetit', 'channel-joshua-weissman'],
    createdAt: '2026-02-03T11:30:00.000Z',
    updatedAt: '2026-06-28T08:05:00.000Z',
  },
  {
    id: 'room-sketching',
    name: 'Sketching',
    description:
      'Figure drawing fundamentals, illustration challenges, and everything in between for building better art habits.',
    iconName: 'pencil',
    channelIds: ['channel-proko', 'channel-draw-with-jazza'],
    createdAt: '2026-02-20T16:45:00.000Z',
    updatedAt: '2026-05-15T10:10:00.000Z',
  },
  {
    id: 'room-gaming',
    name: 'Gaming',
    description: 'Let’s plays, roguelike runs, and background noise for long nights.',
    iconName: 'gamepad',
    channelIds: ['channel-northernlion', 'channel-game-grumps'],
    createdAt: '2026-03-01T20:00:00.000Z',
    updatedAt: '2026-07-01T19:40:00.000Z',
  },
  {
    id: 'room-music',
    name: 'Music',
    description: 'Music theory breakdowns and the occasional internet drama.',
    iconName: 'music',
    channelIds: ['channel-rick-beato', 'channel-adam-neely'],
    createdAt: '2026-03-18T13:15:00.000Z',
    updatedAt: '2026-06-10T12:00:00.000Z',
  },
  {
    id: 'room-someday',
    name: 'Someday',
    description: 'A holding pen for a room I haven’t organized yet.',
    // Edge case: room with zero channels.
    channelIds: [],
    createdAt: '2026-07-05T09:00:00.000Z',
    updatedAt: '2026-07-05T09:00:00.000Z',
  },
  {
    id: 'room-jazz-theory',
    name: 'Jazz Theory',
    description: 'A room for one channel that hasn’t posted anything yet.',
    // Edge case: room with a channel assigned, but that channel has no
    // videos in mockVideos.ts (channel-adam-neely).
    channelIds: ['channel-adam-neely'],
    createdAt: '2026-07-06T09:00:00.000Z',
    updatedAt: '2026-07-06T09:00:00.000Z',
  },
];
