import { fetchAPI } from './client';

const DISCORD_USER_ID = '1188523968920035458';
// Yahan UUID update kar diya hai (bcdc wala)
const VERIFIED_BACKEND_UUID = '662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0';

const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cliptanium_user_id') || VERIFIED_BACKEND_UUID;
  }
  return VERIFIED_BACKEND_UUID;
};

export async function getLinkedAccounts() {
  const userId = getUserId();
  try {
    const response = await fetchAPI(`/users/${userId}`);
    
    if (Array.isArray(response)) return response;
    if (response?.accounts) return response.accounts;
    return response ? [response] : [];
  } catch (err) {
    return [];
  }
}

export async function linkAccount(data: {
  platform: string;
  username: string;
  analyticsDriveUrl: string;
}) {
  const userId = getUserId();
  
  return fetchAPI('/users/accounts', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      discord_id: DISCORD_USER_ID,
      ...data,
    }),
  });
}