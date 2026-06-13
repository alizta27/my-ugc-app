export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export type Platform = 'facebook' | 'instagram';

export interface ConnectedPage {
  id: string;
  platform: Platform;
  name: string;
  username: string;
  avatar: string;
  isConnected: boolean;
  connectedAt?: string;
  followers: number;
  accessToken?: string;
}

export type PostStatus = 'processing' | 'success' | 'failed';
export type MediaType = 'image' | 'video';

export interface UploadLog {
  id: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType: MediaType;
  status: PostStatus;
  platforms: Platform[];
  createdAt: string;
  likes: number;
  comments: number;
  reach: number;
  errorMessage?: string;
}

export interface AnalyticsSummary {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalReach: number;
  engagementRate: number;
}

export interface ChartDataPoint {
  label: string;
  facebook: number;
  instagram: number;
}
