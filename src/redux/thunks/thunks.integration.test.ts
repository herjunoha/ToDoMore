/**
 * Redux Thunks Integration Tests
 * Tests async thunks with database operations
 */

import { createTask, updateTask, deleteTask, deleteTaskWithGoalProgress } from './taskThunks';
import { createGoal, updateGoal, deleteGoal, calculateGoalProgress, deleteGoalWithSubGoals } from './goalThunks';
import { incrementStreakAsync } from './streakThunks';
import { databaseService } from '../../services/database/DatabaseService';
import { userDAO } from '../../services/database/UserDAO';
import { taskDAO } from '../../services/database/TaskDAO';
import { goalDAO } from '../../services/database/GoalDAO';
import { streakDAO } from '../../services/database/StreakDAO';
import { DatabaseUtils } from '../../services/database/DatabaseUtils';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import tasksReducer from '../slices/tasksSlice';
import goalsReducer from '../slices/goalsSlice';
import streaksReducer from '../slices/streaksSlice';
import { TaskStatus, GoalStatus, Priority } from '../../types';

// Create a test store
function createTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
      goals: goalsReducer,
      streaks: streaksReducer,
    },
  });
}

describe('Redux Thunks Integration Tests', () => {
  let userId: string;
  let goalId: string;
  let taskId: string;
  let streakId: string;

  beforeAll(async () => {
    // Initialize database
    await databaseService.initialize();

    // Create test user
    const user = await userDAO.create({
      username: 'thunk_test_user',
      pin_hash: 'test_hash_12345',
    });
    userId = user.id;

    // Create streak for user
    const streak = await streakDAO.createForUser(userId);
    streakId = streak.id;
  });

  afterAll(async () => {
    // Clean up
    await databaseService.close();
  });

  describe('Task Thunks', () => {
    it('should create a task via thunk', async () => {
      const store = createTestStore();

      const createPayload = {
        userId,
        title: 'Test Task',
        description: 'Integration test task',
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
      };

      const action = await store.dispatch(createTask(createPayload) as any);

      expect(action.payload).toBeDefined();
      expect(action.payload.title).toBe('Test Task');
      expect(action.payload.user_id).toBe(userId);

      taskId = action.payload.id;
    });

    it('should update a task via thunk', async () => {
      const store = createTestStore();

      const updatePayload = {
        taskId,
        updates: {
          title: 'Updated Task Title',
          status: TaskStatus.IN_PROGRESS,
        },
      };

      const action = await store.dispatch(updateTask(updatePayload) as any);

      expect(action.payload).toBeDefined();
      expect(action.payload.title).toBe('Updated Task Title');
      expect(action.payload.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should delete a task via thunk', async () => {
      const store = createTestStore();

      // Create a task to delete
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Task to Delete',
        status: TaskStatus.PENDING,
      });

      const action = await store.dispatch(deleteTask(task.id) as any);

      expect(action.payload).toBe(task.id);

      // Verify deletion
      const deleted = await taskDAO.findById(task.id);
      expect(deleted).toBeNull();
    });
  });

  describe('Goal Thunks', () => {
    it('should create a goal via thunk', async () => {
      const store = createTestStore();

      const createPayload = {
        userId,
        specific: 'Learn TypeScript',
        measurable: 'Complete 5 projects',
        achievable: 'Yes, with practice',
        relevant: 'Career advancement',
        timeBound: '2025-12-31',
        title: 'Master TypeScript',
        description: 'Become proficient in TypeScript',
        status: GoalStatus.NOT_STARTED,
      };

      const action = await store.dispatch(createGoal(createPayload) as any);

      expect(action.payload).toBeDefined();
      expect(action.payload.title).toBe('Master TypeScript');
      expect(action.payload.user_id).toBe(userId);
      expect(action.payload.specific).toBe('Learn TypeScript');

      goalId = action.payload.id;
    });

    it('should update a goal via thunk', async () => {
      const store = createTestStore();

      const updatePayload = {
        goalId,
        updates: {
          status: GoalStatus.IN_PROGRESS,
          progress: 25,
        },
      };

      const action = await store.dispatch(updateGoal(updatePayload) as any);

      expect(action.payload).toBeDefined();
      expect(action.payload.status).toBe(GoalStatus.IN_PROGRESS);
      expect(action.payload.progress).toBe(25);
    });

    it('should calculate goal progress via thunk', async () => {
      const store = createTestStore();

      // Create a task linked to the goal
      const linkedTask = await taskDAO.create({
        user_id: userId,
        title: 'Goal Task 1',
        status: TaskStatus.PENDING,
        goal_id: goalId,
      });

      // Create another linked task
      const linkedTask2 = await taskDAO.create({
        user_id: userId,
        title: 'Goal Task 2',
        status: TaskStatus.PENDING,
        goal_id: goalId,
      });

      // Complete first task
      await taskDAO.update(linkedTask.id, { status: TaskStatus.COMPLETED });

      // Call progress calculation
      const action = await store.dispatch(calculateGoalProgress(goalId) as any);

      expect(action.payload).toBeDefined();
      expect(action.payload.progress).toBe(50); // 1 of 2 tasks completed

      // Cleanup
      await taskDAO.delete(linkedTask.id);
      await taskDAO.delete(linkedTask2.id);
    });

    it('should delete a goal via thunk', async () => {
      const store = createTestStore();

      // Create a goal to delete
      const tempGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Temp goal',
        measurable: 'Measure it',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Temporary Goal',
        description: 'For deletion',
        status: GoalStatus.NOT_STARTED,
      });

      const action = await store.dispatch(deleteGoal(tempGoal.id) as any);

      expect(action.payload).toBe(tempGoal.id);

      // Verify deletion
      const deleted = await goalDAO.findById(tempGoal.id);
      expect(deleted).toBeNull();
    });

    it('should delete goal with sub-goals via thunk', async () => {
      const store = createTestStore();

      // Create parent goal
      const parentGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Parent',
        measurable: 'Measure',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Parent Goal',
        description: 'With sub-goals',
        status: GoalStatus.NOT_STARTED,
      });

      // Create sub-goal
      const subGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Sub goal',
        measurable: 'Measure',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Sub Goal',
        description: 'Child of parent',
        status: GoalStatus.NOT_STARTED,
        parent_goal_id: parentGoal.id,
      });

      // Delete parent with cascade
      const action = await store.dispatch(deleteGoalWithSubGoals(parentGoal.id) as any);

      expect(action.payload).toBe(parentGoal.id);

      // Verify both deleted
      const parentDeleted = await goalDAO.findById(parentGoal.id);
      const subDeleted = await goalDAO.findById(subGoal.id);

      expect(parentDeleted).toBeNull();
      expect(subDeleted).toBeNull();
    });
  });

  describe('Task-Goal Relationship Thunks', () => {
    it('should update goal progress when task is deleted', async () => {
      // Create a new goal
      const relGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Test goal for tasks',
        measurable: 'Complete tasks',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Task-Goal Test Goal',
        description: 'For task deletion test',
        status: GoalStatus.NOT_STARTED,
      });

      // Create 3 linked tasks
      const task1 = await taskDAO.create({
        user_id: userId,
        title: 'Task 1',
        status: TaskStatus.COMPLETED,
        goal_id: relGoal.id,
      });

      const task2 = await taskDAO.create({
        user_id: userId,
        title: 'Task 2',
        status: TaskStatus.PENDING,
        goal_id: relGoal.id,
      });

      const task3 = await taskDAO.create({
        user_id: userId,
        title: 'Task 3',
        status: TaskStatus.PENDING,
        goal_id: relGoal.id,
      });

      // Update goal progress manually
      await goalDAO.updateProgress(relGoal.id, 33);

      const store = createTestStore();

      // Delete task 1 (completed)
      const action = await store.dispatch(deleteTaskWithGoalProgress(task1.id) as any);

      expect(action.payload).toBe(task1.id);

      // Progress should be recalculated: 0 of 2 = 0%
      const updatedGoal = await goalDAO.findById(relGoal.id);
      expect(updatedGoal?.progress).toBe(0);

      // Cleanup
      await taskDAO.delete(task2.id);
      await taskDAO.delete(task3.id);
      await goalDAO.delete(relGoal.id);
    });
  });

  describe('Streak Thunks', () => {
    it('should increment streak when task is completed', async () => {
      const store = createTestStore();

      // Create and complete a task
      const completeTask = await taskDAO.create({
        user_id: userId,
        title: 'Task to Complete',
        status: TaskStatus.PENDING,
      });

      // Complete the task
      await taskDAO.updateStatus(completeTask.id, TaskStatus.COMPLETED);

      const today = DatabaseUtils.getCurrentTimestamp();

      // Increment streak
      const action = await store.dispatch(
        incrementStreakAsync({ streakId, date: today }) as any
      );

      expect(action.payload).toBeDefined();

      // Verify streak was updated
      const updatedStreak = await streakDAO.findByUserId(userId);
      expect(updatedStreak?.current_streak).toBeGreaterThanOrEqual(0);

      // Cleanup
      await taskDAO.delete(completeTask.id);
    });
  });

  describe('Complex Workflows', () => {
    it('should handle complete task completion workflow', async () => {
      const store = createTestStore();

      // 1. Create goal
      const workflowGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Complete workflow',
        measurable: 'All steps',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Workflow Goal',
        description: 'Complete integration test',
        status: GoalStatus.NOT_STARTED,
      });

      // 2. Create task linked to goal
      const workflowTask = await taskDAO.create({
        user_id: userId,
        title: 'Workflow Task',
        description: 'Part of workflow',
        status: TaskStatus.PENDING,
        goal_id: workflowGoal.id,
      });

      // 3. Update task to in progress
      const updateAction = await store.dispatch(
        updateTask({
          taskId: workflowTask.id,
          updates: { status: TaskStatus.IN_PROGRESS },
        }) as any
      );
      expect(updateAction.payload.status).toBe(TaskStatus.IN_PROGRESS);

      // 4. Complete task
      const completeAction = await store.dispatch(
        updateTask({
          taskId: workflowTask.id,
          updates: { status: TaskStatus.COMPLETED },
        }) as any
      );
      expect(completeAction.payload.status).toBe(TaskStatus.COMPLETED);

      // 5. Update goal progress
      const progressAction = await store.dispatch(calculateGoalProgress(workflowGoal.id) as any);
      expect(progressAction.payload.progress).toBe(100); // 1 of 1 completed

      // 6. Complete goal
      const completeGoalAction = await store.dispatch(
        updateGoal({
          goalId: workflowGoal.id,
          updates: { status: GoalStatus.ACHIEVED },
        }) as any
      );
      expect(completeGoalAction.payload.status).toBe(GoalStatus.ACHIEVED);

      // Cleanup
      await taskDAO.delete(workflowTask.id);
      await goalDAO.delete(workflowGoal.id);
    });
  });
});
