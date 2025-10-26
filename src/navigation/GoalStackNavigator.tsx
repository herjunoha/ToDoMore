/**
 * GoalStackNavigator.tsx
 * Navigation stack for goal management
 * Flow: GoalList → GoalDetail → GoalForm (Create/Edit)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoalListScreen, GoalDetailScreen, GoalFormScreen } from '../screens/goals';
import { COLORS } from '../constants';

export type GoalStackParamList = {
  GoalList: undefined;
  GoalDetail: {
    goalId: string;
  };
  GoalForm: {
    goalId?: string;
    parentGoalId?: string;
  };
};

const Stack = createNativeStackNavigator<GoalStackParamList>();

/**
 * GoalStackNavigator component
 * Manages the goal management screens
 */
export const GoalStackNavigator: React.FC = () => {
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
        name="GoalList"
        component={GoalListScreen}
        options={{
          title: 'Goals',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{
          title: 'Goal Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="GoalForm"
        component={GoalFormScreen}
        options={({ route }) => ({
          title: route.params?.goalId ? 'Edit Goal' : 'Create Goal',
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};
