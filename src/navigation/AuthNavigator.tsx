/**
 * AuthNavigator.tsx
 * Navigation stack for unauthenticated users
 * Includes: Login, Registration, PIN Verification screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { LoginScreen, RegistrationScreen, PinVerificationScreen } from '../screens/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * AuthNavigator component
 * Manages the authentication flow screens
 */
export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen as any}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen as any}
      />
      <Stack.Screen
        name="PinVerification"
        component={PinVerificationScreen as any}
      />
    </Stack.Navigator>
  );
};
