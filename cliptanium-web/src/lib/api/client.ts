// src/lib/api/client.ts
import { ApiErrorResponse } from './types';

// Slashes ko safely handle karne ke liye replace lagaya hai
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  console.error("CRITICAL ERROR: NEXT_PUBLIC_API_BASE_URL is missing in environment variables.");
}

// Centralized Custom Error Class (Kept from your original code)
export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse | null;
  
  constructor(status: number, message: string, data?: ApiErrorResponse) {
    super(message);
    this.status = status;
    this.data = data || null;
    this.name = 'ApiError';
  }
}

// NextAuth ke token ko accept karne ke liye Custom Interface
interface FetchOptions extends RequestInit {
  token?: string; 
}

// Typed Fetch Wrapper (Kept Generic <T> from your original code)
export async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  // 1. Construct URL securely (Endpoint ke start mein slash check)
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  // 2. Set default headers
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // --- DEV 3 REQUIREMENT: Ngrok Bypass Header ---
  headers.set('ngrok-skip-browser-warning', 'true');
  // ----------------------------------------------

  // 3. Token Logic: Use passed token (from NextAuth later) OR fallback to Dev 3 temporary token
  const token = options.token || process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    // 4. Execute Request
    const response = await fetch(url, config);
    
    // Handle 204 No Content gracefully
    if (response.status === 204) {
      return {} as T;
    }

    // 5. Parse Response
    const data = await response.json().catch(() => null);

    // 6. Handle HTTP Errors strictly
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.detail || data?.message || `Backend returned ${response.status}: ${response.statusText}`,
        data
      );
    }

    // 7. Return typed data
    return data as T;
    
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Pass through our custom API errors
    }
    // Catch fetch/network failures (e.g., tunnel down, CORS issues)
    console.error(`[Network Error] Failed to fetch ${endpoint}:`, error);
    throw new Error("Network error: Unable to connect to the backend API.");
  }
}