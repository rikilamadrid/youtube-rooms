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
}
