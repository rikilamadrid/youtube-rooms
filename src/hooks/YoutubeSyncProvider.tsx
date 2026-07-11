import type { ReactNode } from 'react';
import { YoutubeSyncContext } from './YoutubeSyncContext';
import { useYoutubeSync } from './useYoutubeSync';

/**
 * Hosts a single `useYoutubeSync` instance above the router so connection
 * status and synced channels/videos survive navigating between routes
 * (e.g. `/settings` and `/channels`) instead of resetting on every mount.
 */
export function YoutubeSyncProvider({ children }: { children: ReactNode }) {
  const value = useYoutubeSync();
  return <YoutubeSyncContext.Provider value={value}>{children}</YoutubeSyncContext.Provider>;
}
