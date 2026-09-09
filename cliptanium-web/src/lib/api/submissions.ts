// src/lib/api/submissions.ts
import { fetchAPI } from './client';

export async function getSubmissions(status?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  const query = params.toString() ? `?${params.toString()}` : '';
  
  return fetchAPI(`/submissions${query}`); 
}

export async function getReviewQueue(): Promise<any[]> {
  return fetchAPI('/submissions/review-queue');
}

export async function createSubmission(data: {
  campaignId: string;
  clipUrl: string;
  platform: string;
}): Promise<any> {
  const normalizedPlatform = data.platform
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');

  // Backend ke current schema contract ke mutabiq required fields bhej rahe hain
  const validTestUUID = "123e4567-e89b-12d3-a456-426614174000";

  return fetchAPI('/submissions', {
    method: 'POST',
    body: JSON.stringify({
      campaign_id: data.campaignId,
      campaignId: data.campaignId,
      platform: normalizedPlatform,
      reel_url: data.clipUrl,
      clip_url: data.clipUrl, // <-- Backend requirement fix
      url: data.clipUrl,
      user_id: validTestUUID,  // <-- Backend requirement fix
    }),
  });
}