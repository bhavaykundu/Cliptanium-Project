// src/lib/api/types.ts

export interface ApiErrorResponse {
  message: string;
  detail?: any;
}

export interface User {
  id: string; // Backend UUID
  discord_id: string;
  username: string;
  is_active: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'closed';
  rpm?: number;
  budget?: number;
  platforms: string[];
}

export interface Submission {
  id: string;
  campaign_id: string;
  user_id: string;
  platform: string;
  url: string;
  status: 'pending' | 'claimed' | 'approved' | 'rejected' | 'needs_verification';
  rejection_reason?: string | null;
  views: number;
  earnings: number;
  created_at: string;
}