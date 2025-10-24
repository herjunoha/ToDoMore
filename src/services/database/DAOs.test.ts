/**
 * Data Access Object Tests
 * Tests for all DAO implementations
 */

import { databaseService } from './DatabaseService';
import { userDAO } from './UserDAO';
import { goalDAO } from './GoalDAO';
import { taskDAO } from './TaskDAO';
import { streakDAO } from './StreakDAO';
import { DatabaseUtils } from './DatabaseUtils';

// Test data
const testUserId = DatabaseUtils.generateId();
const testGoalId = DatabaseUtils.generateId();
const testTaskId = DatabaseUtils.generateId();
const testStreakId = DatabaseUtils.generateId();

const mockUser = {
  id: testUserId,
  username: 'dao_test_user',
  pin_hash: 'test_pin_hash_12345',
  created_at: DatabaseUtils.getCurrentTimestamp(),
  updated_at: DatabaseUtils.getCurrentTimestamp(),
};

const mockGoal = {
  id: testGoalId,
  user_id: testUserId,
  specific: 'Test a specific goal',
  measurable: 'Measure completion with tests',
  achievable: 'Yes, with proper setup',
  relevant: 'To ensure DAOs work correctly',
  time_bound: '2025-12-31',
  title: 'Test DAO Implementation',
  description: 'Comprehensive testing of all DAO methods',
  status: 'in_progress',
  progress: 0,
  created_at: DatabaseUtils.getCurrentTimestamp(),
  updated_at: DatabaseUtils.getCurrentTimestamp(),
};

const mockTask = {
  id: testTaskId,
  user_id: testUserId,
  title: 'Test DAO methods',
  description: 'Run all test cases for DAO functionality',
  due_date: '2025-11-30',
  priority: 'high',
  status: 'pending',
  created_at: DatabaseUtils.getCurrentTimestamp(),
  updated_at: DatabaseUtils.getCurrentTimestamp(),
};

const mockStreak = {
  id: testStreakId,
  user_id: testUserId,
  current_streak: 5,
  longest_streak: 10,
  last_completed_date: DatabaseUtils.getCurrentTimestamp(),
  created_at: DatabaseUtils.getCurrentTimestamp(),
  updated_at: DatabaseUtils.getCurrentTimestamp(),
};

describe('Data Access Objects', () => {
  beforeAll(async () => {
    // Initialize database
    await databaseService.initialize();
    
    // Insert test data directly for foreign key constraints
    const db = databaseService.getDatabase();
    await db.executeSql('BEGIN TRANSACTION;');
    
    try {
      // Insert user
      await db.executeSql(
        'INSERT INTO users (id, username, pin_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [mockUser.id, mockUser.username, mockUser.pin_hash, mockUser.created_at, mockUser.updated_at]
      );
      
      // Insert goal
      await db.executeSql(
        `INSERT INTO goals (id, user_id, specific, measurable, achievable, relevant, time_bound, 
          title, description, status, progress, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mockGoal.id, mockGoal.user_id, mockGoal.specific, mockGoal.measurable, 
          mockGoal.achievable, mockGoal.relevant, mockGoal.time_bound,
          mockGoal.title, mockGoal.description, mockGoal.status, mockGoal.progress,
          mockGoal.created_at, mockGoal.updated_at
        ]
      );
      
      // Insert task
      await db.executeSql(
        `INSERT INTO tasks (id, user_id, title, description, due_date, priority, status, 
          created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mockTask.id, mockTask.user_id, mockTask.title, mockTask.description,
          mockTask.due_date, mockTask.priority, mockTask.status,
          mockTask.created_at, mockTask.updated_at
        ]
      );
      
      // Insert streak
      await db.executeSql(
        `INSERT INTO streaks (id, user_id, current_streak, longest_streak, last_completed_date,
          created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          mockStreak.id, mockStreak.user_id, mockStreak.current_streak, mockStreak.longest_streak,
          mockStreak.last_completed_date, mockStreak.created_at, mockStreak.updated_at
        ]
      );
      
      await db.executeSql('COMMIT;');
    } catch (error) {
      await db.executeSql('ROLLBACK;');
      throw error;
    }
  });

  afterAll(async () => {
    // Clean up and close database
    await databaseService.close();
  });

  describe('BaseDAO Operations', () => {
    it('should find all records by user ID', async () => {
      const goals = await goalDAO.findAllByUserId(testUserId);
      expect(Array.isArray(goals)).toBe(true);
      expect(goals.length).toBeGreaterThan(0);
    });

    it('should find a record by ID', async () => {
      const goal = await goalDAO.findById(testGoalId);
      expect(goal).toBeDefined();
      expect(goal?.id).toBe(testGoalId);
    });

    it('should update a record', async () => {
      const result = await goalDAO.update(testGoalId, {
        title: 'Updated Goal Title',
        progress: 50
      });
      expect(result).toBe(true);
      
      const updatedGoal = await goalDAO.findById(testGoalId);
      expect(updatedGoal?.title).toBe('Updated Goal Title');
      expect(updatedGoal?.progress).toBe(50);
    });

    it('should delete a record', async () => {
      // Create a temporary goal to delete
      const tempGoalId = DatabaseUtils.generateId();
      const db = databaseService.getDatabase();
      
      await db.executeSql(
        `INSERT INTO goals (id, user_id, specific, measurable, achievable, relevant, time_bound, 
          title, description, status, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tempGoalId, testUserId, 'Temp goal', 'Temp measure', 'Yes', 'Testing', '2025-12-31',
          'Temp Goal', 'For deletion', 'pending',
          DatabaseUtils.getCurrentTimestamp(), DatabaseUtils.getCurrentTimestamp()
        ]
      );
      
      const result = await goalDAO.delete(tempGoalId);
      expect(result).toBe(true);
      
      const deletedGoal = await goalDAO.findById(tempGoalId);
      expect(deletedGoal).toBeNull();
    });

    it('should count records by user ID', async () => {
      const count = await goalDAO.countByUserId(testUserId);
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('UserDAO Operations', () => {
    it('should find user by username', async () => {
      const user = await userDAO.findByUsername(mockUser.username);
      expect(user).toBeDefined();
      expect(user?.username).toBe(mockUser.username);
    });

    it('should check if username exists', async () => {
      const exists = await userDAO.usernameExists(mockUser.username);
      expect(exists).toBe(true);
    });

    it('should create a new user', async () => {
      const newUser = await userDAO.create({
        username: 'new_dao_user',
        pin_hash: 'new_pin_hash'
      });
      expect(newUser).toBeDefined();
      expect(newUser.username).toBe('new_dao_user');
      expect(newUser.pin_hash).toBe('new_pin_hash');
      expect(newUser.id).toBeDefined();
    });

    it('should update user PIN hash', async () => {
      const newPinHash = 'updated_pin_hash_67890';
      const result = await userDAO.updatePinHash(testUserId, newPinHash);
      expect(result).toBe(true);
      
      const user = await userDAO.findByUsername(mockUser.username);
      expect(user?.pin_hash).toBe(newPinHash);
    });
  });

  describe('GoalDAO Operations', () => {
    it('should find goals by status', async () => {
      const goals = await goalDAO.findByStatus(testUserId, 'in_progress');
      expect(Array.isArray(goals)).toBe(true);
    });

    it('should find sub-goals', async () => {
      // Create a parent goal first
      const parentGoalId = DatabaseUtils.generateId();
      const db = databaseService.getDatabase();
      
      await db.executeSql(
        `INSERT INTO goals (id, user_id, specific, measurable, achievable, relevant, time_bound, 
          title, description, status, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parentGoalId, testUserId, 'Parent goal', 'Measure with sub-goals', 'Yes', 'Testing', '2025-12-31',
          'Parent Goal', 'Has sub-goals', 'in_progress',
          DatabaseUtils.getCurrentTimestamp(), DatabaseUtils.getCurrentTimestamp()
        ]
      );
      
      // Create a sub-goal
      const subGoalId = DatabaseUtils.generateId();
      await db.executeSql(
        `INSERT INTO goals (id, user_id, specific, measurable, achievable, relevant, time_bound, 
          title, description, status, parent_goal_id, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          subGoalId, testUserId, 'Sub goal', 'Measure completion', 'Yes', 'Testing sub-goal', '2025-12-31',
          'Sub Goal', 'Child of parent goal', 'pending', parentGoalId,
          DatabaseUtils.getCurrentTimestamp(), DatabaseUtils.getCurrentTimestamp()
        ]
      );
      
      const subGoals = await goalDAO.findSubGoals(parentGoalId);
      expect(Array.isArray(subGoals)).toBe(true);
      expect(subGoals.length).toBe(1);
      expect(subGoals[0].parent_goal_id).toBe(parentGoalId);
    });

    it('should update goal progress', async () => {
      const result = await goalDAO.updateProgress(testGoalId, 75);
      expect(result).toBe(true);
      
      const updatedGoal = await goalDAO.findById(testGoalId);
      expect(updatedGoal?.progress).toBe(75);
    });
  });

  describe('TaskDAO Operations', () => {
    it('should find tasks by status', async () => {
      const tasks = await taskDAO.findByStatus(testUserId, 'pending');
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should find tasks by priority', async () => {
      const tasks = await taskDAO.findByPriority(testUserId, 'high');
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should find tasks by goal ID', async () => {
      // First link a task to a goal
      const result = await taskDAO.update(testTaskId, {
        goal_id: testGoalId
      });
      expect(result).toBe(true);
      
      const tasks = await taskDAO.findByGoalId(testGoalId);
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks[0].goal_id).toBe(testGoalId);
    });

    it('should find sub-tasks', async () => {
      // Create a parent task
      const parentTaskId = DatabaseUtils.generateId();
      const db = databaseService.getDatabase();
      
      await db.executeSql(
        `INSERT INTO tasks (id, user_id, title, description, status, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          parentTaskId, testUserId, 'Parent Task', 'Has sub-tasks', 'pending',
          DatabaseUtils.getCurrentTimestamp(), DatabaseUtils.getCurrentTimestamp()
        ]
      );
      
      // Create a sub-task
      const subTaskId = DatabaseUtils.generateId();
      await db.executeSql(
        `INSERT INTO tasks (id, user_id, title, description, status, parent_task_id, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          subTaskId, testUserId, 'Sub Task', 'Child of parent task', 'pending', parentTaskId,
          DatabaseUtils.getCurrentTimestamp(), DatabaseUtils.getCurrentTimestamp()
        ]
      );
      
      const subTasks = await taskDAO.findSubTasks(parentTaskId);
      expect(Array.isArray(subTasks)).toBe(true);
      expect(subTasks.length).toBe(1);
      expect(subTasks[0].parent_task_id).toBe(parentTaskId);
    });
  });

  describe('StreakDAO Operations', () => {
    it('should find streak by user ID', async () => {
      const streak = await streakDAO.findByUserId(testUserId);
      expect(streak).toBeDefined();
      expect(streak?.user_id).toBe(testUserId);
    });

    it('should create a new streak', async () => {
      // Create a new user first
      const newUser = await userDAO.create({
        username: 'streak_dao_user',
        pin_hash: 'streak_pin_hash'
      });
      
      const streak = await streakDAO.createForUser(newUser.id);
      expect(streak).toBeDefined();
      expect(streak.user_id).toBe(newUser.id);
      expect(streak.current_streak).toBe(0);
    });

    it('should update streak counts', async () => {
      const result = await streakDAO.updateStreak(
        testStreakId,
        15,
        20,
        DatabaseUtils.getCurrentTimestamp()
      );
      expect(result).toBe(true);
      
      const updatedStreak = await streakDAO.findByUserId(testUserId);
      expect(updatedStreak?.current_streak).toBe(15);
      expect(updatedStreak?.longest_streak).toBe(20);
    });
  });
});