export { default as authReducer } from './authSlice';
export {
  loginUser,
  registerUser,
  checkStoredCredentials,
  changePinAsync,
  clearError,
  logoutUser,
  setUser,
  clearLoading,
} from './authSlice';

export { default as tasksReducer } from './tasksSlice';
export {
  setTasksLoading,
  setTasksError,
  clearTasksError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
  clearTasks,
  deleteTasksByGoal,
  getTasksByGoal,
  getCompletedTasks,
  getPendingTasks,
} from './tasksSlice';

export { default as goalsReducer } from './goalsSlice';
export {
  setGoalsLoading,
  setGoalsError,
  clearGoalsError,
  setGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateGoalStatus,
  updateGoalProgress,
  updateGoalSmartFields,
  clearGoals,
  getActiveGoals,
  getAchievedGoals,
  getGoalsByStatus,
  deleteSubGoals,
} from './goalsSlice';

export { default as streaksReducer } from './streaksSlice';
export {
  setStreaksLoading,
  setStreaksError,
  clearStreaksError,
  setStreak,
  incrementStreak,
  resetStreak,
  setCurrentStreak,
  updateLastCompletedDate,
  setLongestStreak,
  checkAndResetStreak,
  clearStreak,
  updateStreak,
} from './streaksSlice';
