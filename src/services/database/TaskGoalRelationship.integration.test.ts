/**
 * Task-Goal Relationship Integration Tests
 * Tests the relationship operations between tasks and goals
 */

import { databaseService } from './DatabaseService';
import { userDAO } from './UserDAO';
import { taskDAO } from './TaskDAO';
import { goalDAO } from './GoalDAO';
import { streakDAO } from './StreakDAO';
import { TaskStatus, GoalStatus, Priority } from '../../types';

describe('Task-Goal Relationship Integration Tests', () => {
  let userId: string;

  beforeAll(async () => {
    // Initialize database
    await databaseService.initialize();

    // Create test user
    const user = await userDAO.create({
      username: 'task_goal_test_user',
      pin_hash: 'test_hash_12345',
    });
    userId = user.id;

    // Create streak for user
    await streakDAO.createForUser(userId);
  });

  afterAll(async () => {
    // Clean up
    await databaseService.close();
  });

  describe('Basic Task-Goal Linking', () => {
    it('should create and link a task to a goal', async () => {
      // Create goal
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Learn TypeScript',
        measurable: 'Complete 5 projects',
        achievable: 'Yes, with practice',
        relevant: 'Career advancement',
        time_bound: '2025-12-31',
        title: 'Master TypeScript',
        description: 'Become proficient in TypeScript',
        status: GoalStatus.NOT_STARTED,
      });

      // Create task linked to goal
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Complete TypeScript tutorial',
        description: 'Work through the handbook',
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      expect(task.goal_id).toBe(goal.id);

      // Fetch tasks by goal to verify relationship
      const tasksForGoal = await taskDAO.findByGoalId(goal.id);
      expect(tasksForGoal.length).toBe(1);
      expect(tasksForGoal[0].id).toBe(task.id);

      // Cleanup
      await taskDAO.delete(task.id);
      await goalDAO.delete(goal.id);
    });

    it('should unlink task from goal', async () => {
      // Create goal and task
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Test unlinking',
        measurable: 'Verify operation',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Test Goal',
        description: 'For testing',
        status: GoalStatus.NOT_STARTED,
      });

      const task = await taskDAO.create({
        user_id: userId,
        title: 'Linked task',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      // Unlink task
      await taskDAO.update(task.id, { goal_id: undefined } as any);

      // Verify unlink
      const updatedTask = await taskDAO.findById(task.id);
      expect(updatedTask?.goal_id).toBeNull();

      // Verify task no longer in goal's tasks
      const tasksForGoal = await taskDAO.findByGoalId(goal.id);
      expect(tasksForGoal.length).toBe(0);

      // Cleanup
      await taskDAO.delete(task.id);
      await goalDAO.delete(goal.id);
    });
  });

  describe('Goal Progress Calculation', () => {
    it('should calculate goal progress correctly with completed tasks', async () => {
      // Create goal
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Complete tasks',
        measurable: 'All tasks done',
        achievable: 'Yes',
        relevant: 'Testing progress',
        time_bound: '2025-12-31',
        title: 'Progress Test Goal',
        description: 'For progress calculation',
        status: GoalStatus.NOT_STARTED,
        progress: 0,
      });

      // Create 3 tasks
      const task1 = await taskDAO.create({
        user_id: userId,
        title: 'Task 1',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      const task2 = await taskDAO.create({
        user_id: userId,
        title: 'Task 2',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      const task3 = await taskDAO.create({
        user_id: userId,
        title: 'Task 3',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      // Test progress at 0%
      let completedCount = 0;
      let totalCount = 3;
      let progress = Math.round((completedCount / totalCount) * 100);
      await goalDAO.updateProgress(goal.id, progress);

      let updatedGoal = await goalDAO.findById(goal.id);
      expect(updatedGoal?.progress).toBe(0);

      // Complete first task
      await taskDAO.updateStatus(task1.id, TaskStatus.COMPLETED);
      completedCount = 1;
      progress = Math.round((completedCount / totalCount) * 100);
      await goalDAO.updateProgress(goal.id, progress);

      updatedGoal = await goalDAO.findById(goal.id);
      expect(updatedGoal?.progress).toBe(33);

      // Complete second task
      await taskDAO.updateStatus(task2.id, TaskStatus.COMPLETED);
      completedCount = 2;
      progress = Math.round((completedCount / totalCount) * 100);
      await goalDAO.updateProgress(goal.id, progress);

      updatedGoal = await goalDAO.findById(goal.id);
      expect(updatedGoal?.progress).toBe(67);

      // Complete all tasks
      await taskDAO.updateStatus(task3.id, TaskStatus.COMPLETED);
      completedCount = 3;
      progress = Math.round((completedCount / totalCount) * 100);
      await goalDAO.updateProgress(goal.id, progress);

      updatedGoal = await goalDAO.findById(goal.id);
      expect(updatedGoal?.progress).toBe(100);

      // Cleanup
      await taskDAO.delete(task1.id);
      await taskDAO.delete(task2.id);
      await taskDAO.delete(task3.id);
      await goalDAO.delete(goal.id);
    });

    it('should reset progress when all tasks are deleted', async () => {
      // Create goal with tasks
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Reset test',
        measurable: 'All tasks',
        achievable: 'Yes',
        relevant: 'Testing reset',
        time_bound: '2025-12-31',
        title: 'Reset Test Goal',
        description: 'For reset testing',
        status: GoalStatus.NOT_STARTED,
        progress: 50,
      });

      const task = await taskDAO.create({
        user_id: userId,
        title: 'Only task',
        status: TaskStatus.COMPLETED,
        goal_id: goal.id,
      });

      // Delete the task
      await taskDAO.delete(task.id);

      // Get remaining tasks for goal
      const remainingTasks = await taskDAO.findByGoalId(goal.id);
      const newProgress = remainingTasks.length > 0 ? 50 : 0;
      await goalDAO.updateProgress(goal.id, newProgress);

      // Verify progress reset to 0
      const updatedGoal = await goalDAO.findById(goal.id);
      expect(updatedGoal?.progress).toBe(0);

      // Cleanup
      await goalDAO.delete(goal.id);
    });

    it('should handle multiple tasks with mixed statuses', async () => {
      // Create goal
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Mixed status test',
        measurable: 'Various tasks',
        achievable: 'Yes',
        relevant: 'Testing mixed states',
        time_bound: '2025-12-31',
        title: 'Mixed Status Goal',
        description: 'For mixed status testing',
        status: GoalStatus.IN_PROGRESS,
        progress: 0,
      });

      // Create tasks with different statuses
      const completedTask = await taskDAO.create({
        user_id: userId,
        title: 'Completed Task',
        status: TaskStatus.COMPLETED,
        goal_id: goal.id,
      });

      const inProgressTask = await taskDAO.create({
        user_id: userId,
        title: 'In Progress Task',
        status: TaskStatus.IN_PROGRESS,
        goal_id: goal.id,
      });

      const pendingTask = await taskDAO.create({
        user_id: userId,
        title: 'Pending Task',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      // Calculate progress (only completed tasks count)
      const allTasks = await taskDAO.findByGoalId(goal.id);
      const completed = allTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
      const progress = Math.round((completed / allTasks.length) * 100);

      await goalDAO.updateProgress(goal.id, progress);

      const updatedGoal = await goalDAO.findById(goal.id);
      expect(updatedGoal?.progress).toBe(33); // 1 of 3

      // Cleanup
      await taskDAO.delete(completedTask.id);
      await taskDAO.delete(inProgressTask.id);
      await taskDAO.delete(pendingTask.id);
      await goalDAO.delete(goal.id);
    });
  });

  describe('Multiple Goals with Shared Task', () => {
    it('should link task to only one goal at a time', async () => {
      // Create two goals
      const goal1 = await goalDAO.create({
        user_id: userId,
        specific: 'Goal 1',
        measurable: 'Measure 1',
        achievable: 'Yes',
        relevant: 'Test',
        time_bound: '2025-12-31',
        title: 'First Goal',
        description: 'Goal 1',
        status: GoalStatus.NOT_STARTED,
      });

      const goal2 = await goalDAO.create({
        user_id: userId,
        specific: 'Goal 2',
        measurable: 'Measure 2',
        achievable: 'Yes',
        relevant: 'Test',
        time_bound: '2025-12-31',
        title: 'Second Goal',
        description: 'Goal 2',
        status: GoalStatus.NOT_STARTED,
      });

      // Create task linked to goal1
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Task for goals',
        status: TaskStatus.PENDING,
        goal_id: goal1.id,
      });

      // Verify task is linked to goal1
      let tasksForGoal1 = await taskDAO.findByGoalId(goal1.id);
      expect(tasksForGoal1.length).toBe(1);
      expect(tasksForGoal1[0].goal_id).toBe(goal1.id);

      // Relink task to goal2
      await taskDAO.update(task.id, { goal_id: goal2.id } as any);

      // Verify task moved to goal2
      tasksForGoal1 = await taskDAO.findByGoalId(goal1.id);
      const tasksForGoal2 = await taskDAO.findByGoalId(goal2.id);

      expect(tasksForGoal1.length).toBe(0);
      expect(tasksForGoal2.length).toBe(1);
      expect(tasksForGoal2[0].goal_id).toBe(goal2.id);

      // Cleanup
      await taskDAO.delete(task.id);
      await goalDAO.delete(goal1.id);
      await goalDAO.delete(goal2.id);
    });
  });

  describe('Goal-Task Cascade Operations', () => {
    it('should delete goal without affecting linked tasks', async () => {
      // Create goal
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Cascade test',
        measurable: 'Tasks persist',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Cascade Goal',
        description: 'For cascade testing',
        status: GoalStatus.NOT_STARTED,
      });

      // Create linked task
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Cascade task',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      // Delete goal
      const deleted = await goalDAO.delete(goal.id);
      expect(deleted).toBe(true);

      // Task should still exist but with goal_id cleared
      const persistedTask = await taskDAO.findById(task.id);
      expect(persistedTask).toBeDefined();
      expect(persistedTask?.goal_id).toBeNull();

      // Cleanup
      await taskDAO.delete(task.id);
    });

    it('should handle orphaned tasks correctly', async () => {
      // Create goal
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Orphan test',
        measurable: 'Task becomes orphan',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Orphan Goal',
        description: 'For orphan testing',
        status: GoalStatus.NOT_STARTED,
      });

      // Create task
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Orphan task',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      // Delete goal
      await goalDAO.delete(goal.id);

      // Orphaned task should be accessible
      const orphanedTask = await taskDAO.findById(task.id);
      expect(orphanedTask).toBeDefined();
      expect(orphanedTask?.user_id).toBe(userId);

      // User can still see orphaned tasks
      const userTasks = await taskDAO.findAllByUserId(userId);
      const foundOrphan = userTasks.find((t) => t.id === task.id);
      expect(foundOrphan).toBeDefined();

      // Cleanup
      await taskDAO.delete(task.id);
    });
  });

  describe('Task Status Changes and Goal Impact', () => {
    it('should handle status changes in linked tasks', async () => {
      // Create goal
      const goal = await goalDAO.create({
        user_id: userId,
        specific: 'Status change test',
        measurable: 'Track status',
        achievable: 'Yes',
        relevant: 'Testing',
        time_bound: '2025-12-31',
        title: 'Status Goal',
        description: 'For status testing',
        status: GoalStatus.NOT_STARTED,
        progress: 0,
      });

      // Create task
      const task = await taskDAO.create({
        user_id: userId,
        title: 'Status task',
        status: TaskStatus.PENDING,
        goal_id: goal.id,
      });

      // Change task to in progress
      await taskDAO.updateStatus(task.id, TaskStatus.IN_PROGRESS);
      let updatedTask = await taskDAO.findById(task.id);
      expect(updatedTask?.status).toBe(TaskStatus.IN_PROGRESS);

      // Goal progress should still be 0 (not completed yet)
      const goal1 = await goalDAO.findById(goal.id);
      expect(goal1?.progress).toBe(0);

      // Complete task
      await taskDAO.updateStatus(task.id, TaskStatus.COMPLETED);
      updatedTask = await taskDAO.findById(task.id);
      expect(updatedTask?.status).toBe(TaskStatus.COMPLETED);

      // Update goal progress
      await goalDAO.updateProgress(goal.id, 100);
      const goal2 = await goalDAO.findById(goal.id);
      expect(goal2?.progress).toBe(100);

      // Cleanup
      await taskDAO.delete(task.id);
      await goalDAO.delete(goal.id);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple users with independent task-goal relationships', async () => {
      // Create second user
      const user2 = await userDAO.create({
        username: 'user2_' + Date.now(),
        pin_hash: 'hash2',
      });

      // Create goals for both users
      const goal1 = await goalDAO.create({
        user_id: userId,
        specific: 'User 1 goal',
        measurable: 'Measure',
        achievable: 'Yes',
        relevant: 'Test',
        time_bound: '2025-12-31',
        title: 'User 1 Goal',
        description: 'For user 1',
        status: GoalStatus.NOT_STARTED,
      });

      const goal2 = await goalDAO.create({
        user_id: user2.id,
        specific: 'User 2 goal',
        measurable: 'Measure',
        achievable: 'Yes',
        relevant: 'Test',
        time_bound: '2025-12-31',
        title: 'User 2 Goal',
        description: 'For user 2',
        status: GoalStatus.NOT_STARTED,
      });

      // Create tasks for both
      const task1 = await taskDAO.create({
        user_id: userId,
        title: 'User 1 task',
        status: TaskStatus.PENDING,
        goal_id: goal1.id,
      });

      const task2 = await taskDAO.create({
        user_id: user2.id,
        title: 'User 2 task',
        status: TaskStatus.PENDING,
        goal_id: goal2.id,
      });

      // Verify isolation
      const user1Goals = await goalDAO.findAllByUserId(userId);
      const user2Goals = await goalDAO.findAllByUserId(user2.id);

      const user1GoalIds = user1Goals.map((g) => g.id);
      const user2GoalIds = user2Goals.map((g) => g.id);

      expect(user1GoalIds).toContain(goal1.id);
      expect(user1GoalIds).not.toContain(goal2.id);
      expect(user2GoalIds).toContain(goal2.id);
      expect(user2GoalIds).not.toContain(goal1.id);

      // Cleanup
      await taskDAO.delete(task1.id);
      await taskDAO.delete(task2.id);
      await goalDAO.delete(goal1.id);
      await goalDAO.delete(goal2.id);
      await userDAO.delete(user2.id);
    });
  });
});
