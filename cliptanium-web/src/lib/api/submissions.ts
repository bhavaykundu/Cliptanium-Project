import { fetchAPI } from './client';

const DISCORD_REVIEW_CHANNEL_ID = '1542274035897995384';

const getUserId = () => {
  if (typeof window !== 'undefined') {
    // Yahan bcdd ki jagah bcdc kar diya hai
    return localStorage.getItem('cliptanium_user_id') || '662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0';
  }
  return '662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0';
};

export async function getSubmissions(userId?: string, status?: string) {
  const params = new URLSearchParams();
  if (userId) params.append('user_id', userId);
  if (status) params.append('status', status);
  const query = params.toString() ? `?${params.toString()}` : '';
  
  // Yahan se /api/v1 hata diya hai
  return fetchAPI(`/submissions${query}`); 
}

export async function getReviewQueue() {
  // Yahan se bhi /api/v1 hata diya hai
  return fetchAPI('/submissions/review-queue');
}

export async function createSubmission(data: {
  campaignId: string;
  clipUrl: string;
  platform: string;
}) {
  const userId = getUserId();
  
  // Yahan se bhi /api/v1 hata diya hai
  return fetchAPI('/submissions', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      ...data,
    }),
  });
}