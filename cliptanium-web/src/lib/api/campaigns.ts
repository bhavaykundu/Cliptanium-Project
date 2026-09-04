import { fetchAPI } from './client';

// Hardcoded test user and campaign constants if needed
const TEST_CAMPAIGN_ID = "662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0"; // Update if your project uses dynamic ID

function getUserId() {
  return "662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0";
}

// 1. Get Campaigns function jo missing thi
export async function getCampaigns() {
  try {
    const response = await fetchAPI('/campaigns', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch campaigns", error);
    return [];
  }
}

// 2. Join Campaign function (409 conflict bypass ke sath)
export async function joinCampaign(campaignId: string = TEST_CAMPAIGN_ID) {
  const userId = getUserId();
  
  try {
    const response = await fetchAPI(`/campaigns/${campaignId}/join`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
      }),
    });
    return response;
  } catch (error: any) {
    // Agar user pehle se joined hai (409), toh error throw nahi karenge
    if (error.message?.includes('409') || error.message?.toLowerCase().includes('already')) {
      return { status: 'success', message: 'Already joined', alreadyJoined: true };
    }
    
    throw error;
  }
}