/**
 * Navigation type definitions for React Navigation
 */

/**
 * Auth Stack parameter list
 */
export type AuthStackParamList = {
  Login: undefined;
  Registration: undefined;
  PinVerification: {
    title?: string;
    subtitle?: string;
  };
};

/**
 * App Stack parameter list
 */
export type AppStackParamList = {
  Dashboard: undefined;
  TaskList: undefined;
  TaskDetail: {
    taskId: string;
  };
  TaskForm: {
    taskId?: string;
    goalId?: string;
  };
  GoalList: undefined;
  GoalDetail: {
    goalId: string;
  };
  GoalForm: {
    goalId?: string;
  };
  Settings: undefined;
  ChangePIN: undefined;
};

/**
 * Root Stack parameter list
 */
export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  Splash: undefined;
};

/**
 * Bottom Tab parameter list
 */
export type BottomTabParamList = {
  DashboardTab: undefined;
  TasksTab: undefined;
  GoalsTab: undefined;
  SettingsTab: undefined;
};

/**
 * Navigation props type
 */
export interface NavigationProps {
  navigation: any;
  route: any;
}

/**
 * Route parameters for common navigation actions
 */
export interface NavigationParams {
  taskId?: string;
  goalId?: string;
  userId?: string;
}

/**
 * Navigation event types
 */
export interface NavigationEvent {
  type: 'blur' | 'focus';
  target?: string;
  canPreventDefault?: boolean;
}
