import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import tasksReducer from '../slices/tasksSlice';
import goalsReducer from '../slices/goalsSlice';
import streaksReducer from '../slices/streaksSlice';
import { RootState } from '../../types';

/**
 * Configure and create the Redux store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    goals: goalsReducer,
    streaks: streaksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types that may contain non-serializable values
        ignoredActions: ['auth/checkStored/pending'],
      },
    }),
});

// Export the store type for use in selectors and components
export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;
