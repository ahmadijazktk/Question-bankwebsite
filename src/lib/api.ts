/**
 * API utility functions for making requests to the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

/**
 * Make an API request with automatic token handling
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit & { body?: any } = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('token');
  const { body, ...fetchOptions } = options;
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(fetchOptions.headers as Record<string, string>),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  
  if (!response.ok) {
    // Handle 401 unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

/**
 * GET request helper
 */
export const apiGet = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'GET' });
};

/**
 * POST request helper
 */
export const apiPost = <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'POST', body });
};

/**
 * PUT request helper
 */
export const apiPut = <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'PUT', body });
};

/**
 * DELETE request helper
 */
export const apiDelete = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};

