export interface Room {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  channelIds: string[];
  createdAt: string;
  updatedAt: string;
}
