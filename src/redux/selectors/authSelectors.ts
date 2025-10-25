import { AppRootState } from '../store/configureStore';

/**
 * Auth Selectors
 * Memoized selectors for accessing auth state
 */

/**
 * Select the entire auth state
 */
export const selectAuthState = (state: AppRootState) => state.auth;

/**
 * Select whether user is authenticated
 */
export const selectIsAuthenticated = (state: AppRootState) => state.auth.isAuthenticated;

/**
 * Select the current authenticated user
 */
export const selectCurrentUser = (state: AppRootState) => state.auth.user;

/**
 * Select the current user ID
 */
export const selectCurrentUserId = (state: AppRootState) => state.auth.user?.id || null;

/**
 * Select the current username
 */
export const selectCurrentUsername = (state: AppRootState) => state.auth.user?.username || null;

/**
 * Select the auth loading state
 */
export const selectAuthLoading = (state: AppRootState) => state.auth.loading;

/**
 * Select the auth error message
 */
export const selectAuthError = (state: AppRootState) => state.auth.error;

/**
 * Select whether auth is in a loading state
 */
export const selectIsAuthLoading = (state: AppRootState) => state.auth.loading;

/**
 * Select whether there is an auth error
 */
export const selectHasAuthError = (state: AppRootState) => !!state.auth.error;
