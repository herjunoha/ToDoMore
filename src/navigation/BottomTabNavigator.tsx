/**
 * BottomTabNavigator.tsx
 * Bottom tab navigation with 4 main tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DashboardScreen } from '../screens/dashboard';
import { TaskStackNavigator } from './TaskStackNavigator';
import { GoalStackNavigator } from './GoalStackNavigator';
import { SettingsScreen } from '../screens/settings';
import { COLORS } from '../constants';

export type BottomTabParamList = {
  DashboardTab: undefined;
  TasksTab: undefined;
  GoalsTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Icon components
const DashboardIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);

const TasksIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="checkbox-marked-circle" size={size} color={color} />
);

const GoalsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="bullseye" size={size} color={color} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="cog" size={size} color={color} />
);

/**
 * BottomTabNavigator component
 * Main navigation structure with 4 tabs
 */
export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: COLORS.LIGHT_GRAY,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      } as BottomTabNavigationOptions}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name="TasksTab"
        component={TaskStackNavigator}
        options={{
          title: 'Tasks',
          tabBarIcon: TasksIcon,
        }}
      />
      <Tab.Screen
        name="GoalsTab"
        component={GoalStackNavigator}
        options={{
          title: 'Goals',
          tabBarIcon: GoalsIcon,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};
