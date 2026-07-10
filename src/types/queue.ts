export interface WatchQueue {
  id: string;
  roomId: string;
  videoIds: string[];
  activeVideoId?: string;
}
