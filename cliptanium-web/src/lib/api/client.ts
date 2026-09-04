const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bodies-timber-floor-secondary.trycloudflare.com/api/v1';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Ensure no double slashes and proper URL construction
  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If base already contains /api/v1 and endpoint doesn't duplicate it
  const url = `${cleanBase}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(`API Error: ${res.status} - ${errorBody || res.statusText}`);
    }

    // Handle empty responses gracefully
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (error: any) {
    console.error(`Fetch error for URL (${url}):`, error.message);
    throw error;
  }
}