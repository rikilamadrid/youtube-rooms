export interface SubscriptionChannel {
  id: string;
  youtubeChannelId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  topicTags: string[];
  isMock?: boolean;
}
