import type { WatchQueue } from '../types/queue';

/**
 * roomId and videoIds are cross-referenced by id against mockRooms.ts and
 * mockVideos.ts. Keep ids stable. Not every room has a queue.
 */
export const mockQueues: WatchQueue[] = [
  {
    id: 'queue-coding',
    roomId: 'room-coding',
    videoIds: ['video-fireship-react-19', 'video-primeagen-vim-motions', 'video-primeagen-live-refactor'],
    activeVideoId: 'video-primeagen-vim-motions',
  },
  {
    id: 'queue-cooking',
    roomId: 'room-cooking',
    videoIds: ['video-bonappetit-sourdough', 'video-weissman-fast-food'],
    // Edge case: queue with no active video.
  },
  {
    id: 'queue-sketching',
    roomId: 'room-sketching',
    videoIds: ['video-proko-hands', 'video-proko-gesture', 'video-jazza-character-design'],
    activeVideoId: 'video-jazza-character-design',
  },
  {
    id: 'queue-gaming',
    roomId: 'room-gaming',
    videoIds: ['video-northernlion-isaac-run', 'video-gamegrumps-mario'],
    activeVideoId: 'video-northernlion-isaac-run',
  },
];
