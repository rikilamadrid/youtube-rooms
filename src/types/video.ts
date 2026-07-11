export interface VideoSummary {
  id: string;
  youtubeVideoId: string;
  channelId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  duration?: string;
  watched?: boolean;
  /** YouTube's video category id (e.g. "20" for Gaming) — resolve to a name via `VideoCategory`. */
  categoryId?: string;
}
