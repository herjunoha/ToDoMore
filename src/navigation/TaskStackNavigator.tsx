/**
 * TaskStackNavigator.tsx
 * Navigation stack for task management
 * Flow: TaskList → TaskDetail → TaskForm (Create/Edit)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen, TaskDetailScreen, TaskFormScreen } from '../screens/tasks';
import { COLORS } from '../constants';

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetail: {
    taskId: string;
  };
  TaskForm: {
    taskId?: string;
    goalId?: string;
  };
};

const Stack = createNativeStackNavigator<TaskStackParamList>();

/**
 * TaskStackNavigator component
 * Manages the task management screens
 */
export const TaskStackNavigator: React.FC = () => {
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
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'Tasks',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: 'Task Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={({ route }) => ({
          title: route.params?.taskId ? 'Edit Task' : 'Create Task',
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};
