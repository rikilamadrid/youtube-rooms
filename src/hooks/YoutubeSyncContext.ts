import { createContext, useContext } from 'react';
import type { UseYoutubeSyncResult } from './useYoutubeSync';

export const YoutubeSyncContext = createContext<UseYoutubeSyncResult | null>(null);

/** Reads the shared `useYoutubeSync` state. Must be rendered under `YoutubeSyncProvider`. */
export function useYoutubeSyncContext(): UseYoutubeSyncResult {
  const context = useContext(YoutubeSyncContext);
  if (!context) {
    throw new Error('useYoutubeSyncContext must be used within a YoutubeSyncProvider');
  }
  return context;
}
