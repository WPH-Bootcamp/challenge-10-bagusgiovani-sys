/**
 * App Route Constants
 * 
 * Centralized app routes for consistency and easy refactoring
 */

export const ROUTES = {
  // ============================================
  // PUBLIC ROUTES
  // ============================================
  HOME: '/',
  
  // ============================================
  // AUTH ROUTES
  // ============================================
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },

  // ============================================
  // POST ROUTES
  // ============================================
  POSTS: {
    DETAIL: (id: number | string) => `/posts/${id}`,
    WRITE: '/write',
    EDIT: (id: number | string) => `/write?id=${id}`, // Using query param for edit
  },

  // ============================================
  // PROFILE ROUTES
  // ============================================
  PROFILE: {
    MY_PROFILE: '/profile',
    USER_PROFILE: (username: string) => `/profile/${username}`,
  },

  // ============================================
  // SEARCH
  // ============================================
  SEARCH: (query: string) => `/?search=${encodeURIComponent(query)}`,
} as const;

/**
 * Check if route is public (doesn't require authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes: string[] = [
    ROUTES.HOME,
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
  ];
  
  // Check exact matches
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Check if it's a post detail page (public)
  if (pathname.startsWith('/posts/')) {
    return true;
  }
  
  // Check if it's a user profile page (public)
  if (pathname.startsWith('/profile/') && pathname !== '/profile') {
    return true;
  }
  
  return false;
}

/**
 * Check if route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

/**
 * Get redirect path after login
 */
export function getRedirectAfterLogin(returnUrl?: string): string {
  if (returnUrl && returnUrl !== ROUTES.AUTH.LOGIN && returnUrl !== ROUTES.AUTH.REGISTER) {
    return returnUrl;
  }
  return ROUTES.HOME;
}

/**
 * Get login redirect with return URL
 */
export function getLoginRedirect(currentPath?: string): string {
  if (currentPath && currentPath !== ROUTES.AUTH.LOGIN) {
    return `${ROUTES.AUTH.LOGIN}?returnUrl=${encodeURIComponent(currentPath)}`;
  }
  return ROUTES.AUTH.LOGIN;
}