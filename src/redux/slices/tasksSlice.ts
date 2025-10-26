import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TasksState, Task, TaskStatus, Priority } from '../../types';
import * as taskThunks from '../thunks/taskThunks';

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTasksError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearTasksError: (state) => {
      state.error = null;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        task.updated_at = new Date().toISOString();
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{ taskId: string; priority: Priority }>) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.priority = action.payload.priority;
        task.updated_at = new Date().toISOString();
      }
    },
    clearTasks: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    deleteTasksByGoal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((task) => task.goal_id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(taskThunks.fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taskThunks.fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(taskThunks.fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(taskThunks.createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taskThunks.createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(taskThunks.createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(taskThunks.updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taskThunks.updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(taskThunks.updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(taskThunks.deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(taskThunks.deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(taskThunks.fetchTasksByGoalId.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(taskThunks.fetchOverdueTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(taskThunks.fetchCompletedTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(taskThunks.fetchPendingTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(taskThunks.updateTaskStatusWithGoalProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taskThunks.updateTaskStatusWithGoalProgress.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(taskThunks.updateTaskStatusWithGoalProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(taskThunks.deleteTaskWithGoalProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taskThunks.deleteTaskWithGoalProgress.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.loading = false;
      })
      .addCase(taskThunks.deleteTaskWithGoalProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTasksLoading,
  setTasksError,
  clearTasksError,
  setTasks,
  addTask,
  deleteTask,
  clearTasks,
  deleteTasksByGoal,
} = tasksSlice.actions;

export default tasksSlice.reducer;
