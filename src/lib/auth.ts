/**
 * Authentication utility functions
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscriptionStatus: {
    isActive: boolean;
    category: string | null;
    plan: string | null;
    startDate: string | null;
    endDate: string | null;
    autoRenew: boolean;
  };
}

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Save user data and token
 */
export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear auth data and logout
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth';
};

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const { isActive, endDate } = user.subscriptionStatus;
  if (!isActive || !endDate) return false;
  
  return new Date(endDate) > new Date();
};




