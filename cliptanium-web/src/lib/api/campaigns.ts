// src/lib/api/campaigns.ts
import { fetchAPI } from './client';
import { Campaign } from './types';

// ✅ Fake getUserId() function hamesha ke liye HATA diya gaya hai!

export async function getCampaigns(): Promise<Campaign[]> {
  return fetchAPI<Campaign[]>('/campaigns', {
    method: 'GET',
  });
}

export async function joinCampaign(campaignId: string) {
  try {
    return await fetchAPI<any>(`/campaigns/${campaignId}/join`, {
      method: 'POST',
      // ✅ Dev 3 ke contract ke hisaab se body empty hai. 
      // User identity ab seedha token se jayegi (jo fetchAPI handle karega).
      body: JSON.stringify({}), 
    });
  } catch (error: any) {
    if (error.status === 409 || error.message?.toLowerCase().includes('already')) {
      return { status: 'success', message: 'Already joined', alreadyJoined: true };
    }
    throw error; // Agar 401 Unauthorized aata hai, toh wo yahan se aage jayega
  }
}