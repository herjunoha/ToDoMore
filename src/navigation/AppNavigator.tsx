/**
 * AppNavigator.tsx
 * Navigation structure for authenticated users
 * Includes: BottomTabNavigator with all app screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ChangePINScreen } from '../screens/settings';
import { COLORS } from '../constants';

export type AppStackParamList = {
  MainTabs: undefined;
  ChangePIN: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * AppNavigator component
 * Main navigation structure for authenticated users
 */
export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePIN"
        component={ChangePINScreen}
        options={{
          title: 'Change PIN',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
