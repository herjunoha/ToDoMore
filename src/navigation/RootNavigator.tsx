/**
 * RootNavigator.tsx
 * Root navigation component
 * Manages switching between auth and app navigators based on authentication state
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store/configureStore';
import { selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { checkStoredCredentials } from '../redux/slices/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { COLORS } from '../constants';

/**
 * RootNavigator component
 * Determines which navigator to show based on authentication state
 */
export const RootNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    // Check for stored credentials on app launch
    const checkAuth = async () => {
      try {
        await dispatch(checkStoredCredentials());
      } catch (error) {
        console.error('Error checking stored credentials:', error);
      } finally {
        setIsBootstrapping(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Show loading screen while bootstrapping
  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  // Show AuthNavigator if not authenticated, AppNavigator if authenticated
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};
