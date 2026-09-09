// src/lib/api/accounts.ts
import { fetchAPI } from './client';

// TypeScript ko batane ke liye ki response kaisa dikhega
interface UserMeResponse {
  accounts?: any[];
  [key: string]: any;
}

export async function getLinkedAccounts() {
  try {
    // Yahan humne <UserMeResponse> pass kar diya
    const response = await fetchAPI<UserMeResponse>('/users/me');
    
    if (Array.isArray(response)) return response;
    // Ab TypeScript yahan error nahi dega
    if (response?.accounts) return response.accounts;
    
    return response ? [response] : [];
  } catch (err) {
    console.error("Failed to fetch linked accounts:", err);
    return [];
  }
}

export async function linkAccount(data: {
  platform: string;
  username: string;
  analyticsDriveUrl: string;
}) {
  return fetchAPI('/users/accounts', {
    method: 'POST',
    body: JSON.stringify({
      platform: data.platform.toLowerCase().trim().replace(/\s+/g, '_'),
      username: data.username,
      analytics_drive_url: data.analyticsDriveUrl,
    }),
  });
}