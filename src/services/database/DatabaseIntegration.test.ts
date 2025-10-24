/**
 * Database Integration Tests
 * Tests the complete database layer integration
 */

import { databaseService } from './DatabaseService';
import { userDAO } from './UserDAO';
import { goalDAO } from './GoalDAO';
import { taskDAO } from './TaskDAO';
import { streakDAO } from './StreakDAO';
import { DatabaseUtils } from './DatabaseUtils';
import { GoalStatus, Priority, TaskStatus } from '../../types';

describe('Database Integration', () => {
  beforeAll(async () => {
    await databaseService.initialize();
  });

  afterAll(async () => {
    await databaseService.close();
  });

  describe('Complete User Flow', () => {
    let userId: string;
    let goalId: string;
    let taskId: string;
    let streakId: string;

    it('should register a new user', async () => {
      const user = await userDAO.create({
        username: 'integration_test_user',
        pin_hash: 'secure_hash_12345'
      });
      
      expect(user).toBeDefined();
      expect(user.username).toBe('integration_test_user');
      expect(user.id).toBeDefined();
      
      userId = user.id;
    });

    it('should create a streak for the user', async () => {
      const streak = await streakDAO.createForUser(userId);
      expect(streak).toBeDefined();
      expect(streak.user_id).toBe(userId);
      expect(streak.current_streak).toBe(0);
      
      streakId = streak.id;
    });

    it('should create a goal for the user', async () => {
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Learn TypeScript',
        measurable: 'Complete 10 TypeScript projects',
        achievable: 'Yes, with dedicated practice',
        relevant: 'Career advancement in web development',
        time_bound: '2025-12-31',
        title: 'Master TypeScript',
        description: 'Become proficient in TypeScript for better code quality',
        status: GoalStatus.NOT_STARTED
      });
      
      expect(goal).toBeDefined();
      expect(goal.user_id).toBe(userId);
      expect(goal.title).toBe('Master TypeScript');
      
      goalId = goal.id;
    });

    it('should create a task linked to the goal', async () => {
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Complete TypeScript tutorial',
        description: 'Work through the official TypeScript handbook',
        due_date: '2025-11-30',
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
        goal_id: goalId
      });
      
      expect(task).toBeDefined();
      expect(task.user_id).toBe(userId);
      expect(task.goal_id).toBe(goalId);
      
      taskId = task.id;
    });

    it('should update task status to completed', async () => {
      const result = await taskDAO.updateStatus(taskId, TaskStatus.COMPLETED);
      expect(result).toBe(true);
      
      // Update streak
      const streakResult = await streakDAO.incrementStreak(
        streakId, 
        DatabaseUtils.getCurrentTimestamp()
      );
      expect(streakResult).toBe(true);
    });

    it('should update goal progress based on completed tasks', async () => {
      // Get task statistics for the goal
      const tasksWithGoals = await taskDAO.getTasksWithGoals(userId);
      const goalTasks = tasksWithGoals.filter((task: any) => task.goal_id === goalId);
      const completedTasks = goalTasks.filter((task: any) => task.status === TaskStatus.COMPLETED);
      const progress = goalTasks.length > 0 ? 
        Math.round((completedTasks.length / goalTasks.length) * 100) : 0;
      
      const result = await goalDAO.updateProgress(goalId, progress);
      expect(result).toBe(true);
      
      const updatedGoal = await goalDAO.findById(goalId);
      expect(updatedGoal?.progress).toBe(progress);
    });

    it('should retrieve user with all related data', async () => {
      // Get user
      const user = await userDAO.findById(userId);
      expect(user).toBeDefined();
      
      // Get user's goals
      const goals = await goalDAO.findAllByUserId(userId);
      expect(goals.length).toBe(1);
      
      // Get user's tasks
      const tasks = await taskDAO.findAllByUserId(userId);
      expect(tasks.length).toBe(1);
      
      // Get user's streak
      const streak = await streakDAO.findByUserId(userId);
      expect(streak).toBeDefined();
      expect(streak?.current_streak).toBe(1);
    });

    it('should clean up test data', async () => {
      // Delete in reverse order of foreign key dependencies
      await taskDAO.delete(taskId);
      await goalDAO.delete(goalId);
      await streakDAO.delete(streakId);
      await userDAO.delete(userId);
      
      // Verify deletion
      const user = await userDAO.findById(userId);
      const goal = await goalDAO.findById(goalId);
      const task = await taskDAO.findById(taskId);
      const streak = await streakDAO.findByUserId(userId);
      
      expect(user).toBeNull();
      expect(goal).toBeNull();
      expect(task).toBeNull();
      expect(streak).toBeNull();
    });
  });

  describe('Relationship Handling', () => {
    let userId: string;
    let parentGoalId: string;
    let childGoalId: string;
    let parentTaskId: string;
    let childTaskId: string;

    beforeAll(async () => {
      // Create test user
      const user = await userDAO.create({
        username: 'relationship_test_user',
        pin_hash: 'relationship_hash_12345'
      });
      userId = user.id;
    });

    afterAll(async () => {
      // Clean up
      await userDAO.delete(userId);
    });

    it('should handle parent-child goal relationships', async () => {
      // Create parent goal
      const parentGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Parent goal',
        measurable: 'Measure with child goals',
        achievable: 'Yes',
        relevant: 'Testing relationships',
        time_bound: '2025-12-31',
        title: 'Parent Goal',
        description: 'Main goal with sub-goals',
        status: GoalStatus.IN_PROGRESS
      });
      parentGoalId = parentGoal.id;
      
      // Create child goal
      const childGoal = await goalDAO.create({
        user_id: userId,
        specific: 'Child goal',
        measurable: 'Complete this sub-goal',
        achievable: 'Yes',
        relevant: 'Part of parent goal',
        time_bound: '2025-11-30',
        title: 'Child Goal',
        description: 'Sub-goal of parent',
        status: GoalStatus.NOT_STARTED,
        parent_goal_id: parentGoalId
      });
      childGoalId = childGoal.id;
      
      // Verify relationship
      const subGoals = await goalDAO.findSubGoals(parentGoalId);
      expect(subGoals.length).toBe(1);
      expect(subGoals[0].parent_goal_id).toBe(parentGoalId);
    });

    it('should handle parent-child task relationships', async () => {
      // Create parent task
      const parentTask = await taskDAO.create({
        user_id: userId,
        title: 'Parent Task',
        description: 'Main task with sub-tasks',
        status: TaskStatus.PENDING
      });
      parentTaskId = parentTask.id;
      
      // Create child task
      const childTask = await taskDAO.create({
        user_id: userId,
        title: 'Child Task',
        description: 'Sub-task of parent',
        status: TaskStatus.PENDING,
        parent_task_id: parentTaskId
      });
      childTaskId = childTask.id;
      
      // Verify relationship
      const subTasks = await taskDAO.findSubTasks(parentTaskId);
      expect(subTasks.length).toBe(1);
      expect(subTasks[0].parent_task_id).toBe(parentTaskId);
    });

    it('should clean up relationship test data', async () => {
      await taskDAO.delete(childTaskId);
      await taskDAO.delete(parentTaskId);
      await goalDAO.delete(childGoalId);
      await goalDAO.delete(parentGoalId);
    });
  });

  describe('Database Utilities', () => {
    it('should generate valid UUIDs', () => {
      const id1 = DatabaseUtils.generateId();
      const id2 = DatabaseUtils.generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(DatabaseUtils.isValidUUID(id1)).toBe(true);
      expect(DatabaseUtils.isValidUUID(id2)).toBe(true);
    });

    it('should handle timestamps correctly', () => {
      const timestamp = DatabaseUtils.getCurrentTimestamp();
      const date = DatabaseUtils.isoStringToDate(timestamp);
      const convertedBack = DatabaseUtils.dateToISOString(date);
      
      expect(timestamp).toBeDefined();
      expect(date instanceof Date).toBe(true);
      // Compare up to seconds precision due to potential milliseconds difference
      expect(convertedBack.substring(0, 19)).toBe(timestamp.substring(0, 19));
    });

    it('should get database statistics', async () => {
      const stats = await DatabaseUtils.getDatabaseStats();
      expect(stats).toBeDefined();
      expect(stats.users).toBeDefined();
      expect(stats.goals).toBeDefined();
      expect(stats.tasks).toBeDefined();
      expect(stats.streaks).toBeDefined();
      expect(stats.size).toBeDefined();
    });
  });
});