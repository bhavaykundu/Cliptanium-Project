import { fetchAPI } from './client';

const DISCORD_EARNINGS_GALLERY_ID = '1542294918813319229';

const getUserId = () => {
  if (typeof window !== 'undefined') {
    // Yahan bcdd ki jagah bcdc kar diya hai
    return localStorage.getItem('cliptanium_user_id') || '662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0';
  }
  return '662b74fd-a6f8-4a0c-bcdc-d0758e2a40f0';
};

export async function getWalletBalance() {
  const userId = getUserId();
  return fetchAPI(`/earnings/users/${userId}`);
}

export async function getPayoutMethods() {
  const userId = getUserId();
  return fetchAPI(`/payments/methods?user_id=${userId}`);
}

export async function addPaymentMethod(data: { type: string; details: string }) {
  const userId = getUserId();
  return fetchAPI('/payments/methods', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      ...data,
    }),
  });
}