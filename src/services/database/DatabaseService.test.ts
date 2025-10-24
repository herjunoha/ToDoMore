/**
 * Database Service Tests
 * Tests for database initialization, table creation, and basic operations
 */

import { databaseService } from './DatabaseService';
import { userDAO } from './UserDAO';
import { goalDAO } from './GoalDAO';
import { taskDAO } from './TaskDAO';
import { streakDAO } from './StreakDAO';

// Mock data for testing
const mockUser = {
  username: 'testuser',
  pin_hash: 'hashed_pin_1234',
};

const mockGoal = {
  user_id: 'user-123',
  specific: 'Learn React Native',
  measurable: 'Complete 3 projects',
  achievable: 'Yes, with dedicated time',
  relevant: 'Career advancement',
  time_bound: '2025-12-31',
  title: 'Master React Native',
  description: 'Build mobile apps with React Native',
  status: 'in_progress',
};

const mockTask = {
  user_id: 'user-123',
  title: 'Setup development environment',
  description: 'Install Node.js, React Native CLI, and Android Studio',
  due_date: '2025-11-30',
  priority: 'high',
  status: 'pending',
};

describe('Database Service Layer', () => {
  beforeAll(async () => {
    // Initialize database before running tests
    try {
      await databaseService.initialize();
      console.log('Database initialized for testing');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    // Close database connection after tests
    try {
      await databaseService.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Failed to close database:', error);
    }
  });

  describe('Database Initialization', () => {
    it('should initialize database successfully', () => {
      expect(databaseService.isInitialized()).toBe(true);
    });

    it('should create all required tables', async () => {
      const db = databaseService.getDatabase();
      
      // Check if users table exists
      const userTable = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
      );
      expect(userTable[0].rows.length).toBe(1);
      
      // Check if goals table exists
      const goalTable = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='goals'"
      );
      expect(goalTable[0].rows.length).toBe(1);
      
      // Check if tasks table exists
      const taskTable = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"
      );
      expect(taskTable[0].rows.length).toBe(1);
      
      // Check if streaks table exists
      const streakTable = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='streaks'"
      );
      expect(streakTable[0].rows.length).toBe(1);
    });
  });

  describe('User DAO Operations', () => {
    let createdUserId: string;

    it('should create a new user', async () => {
      const user = await userDAO.create(mockUser);
      expect(user).toBeDefined();
      expect(user.username).toBe(mockUser.username);
      expect(user.pin_hash).toBe(mockUser.pin_hash);
      expect(user.id).toBeDefined();
      createdUserId = user.id;
    });

    it('should find user by username', async () => {
      const user = await userDAO.findByUsername(mockUser.username);
      expect(user).toBeDefined();
      expect(user?.username).toBe(mockUser.username);
    });

    it('should check if username exists', async () => {
      const exists = await userDAO.usernameExists(mockUser.username);
      expect(exists).toBe(true);
    });

    it('should update user PIN hash', async () => {
      const newPinHash = 'new_hashed_pin_5678';
      const result = await userDAO.updatePinHash(createdUserId, newPinHash);
      expect(result).toBe(true);
      
      const user = await userDAO.findByUsername(mockUser.username);
      expect(user?.pin_hash).toBe(newPinHash);
    });
  });

  describe('Goal DAO Operations', () => {
    let createdGoalId: string;

    it('should create a new goal', async () => {
      // First create a user for foreign key constraint
      const user = await userDAO.create({
        username: 'goaluser',
        pin_hash: 'goal_pin_hash',
      });
      
      const goalData = {
        ...mockGoal,
        user_id: user.id,
      };
      
      // @ts-ignore - ignoring for test purposes
      const goal = await goalDAO.create(goalData);
      expect(goal).toBeDefined();
      expect(goal.title).toBe(mockGoal.title);
      expect(goal.user_id).toBe(user.id);
      createdGoalId = goal.id;
    });

    it('should find goals by status', async () => {
      const goals = await goalDAO.findByStatus('user-123', 'in_progress');
      expect(Array.isArray(goals)).toBe(true);
    });

    it('should update goal progress', async () => {
      const result = await goalDAO.updateProgress(createdGoalId, 50);
      expect(result).toBe(true);
    });
  });

  describe('Task DAO Operations', () => {
    it('should create a new task', async () => {
      // First create a user for foreign key constraint
      const user = await userDAO.create({
        username: 'taskuser',
        pin_hash: 'task_pin_hash',
      });
      
      const taskData = {
        ...mockTask,
        user_id: user.id,
      };
      
      // @ts-ignore - ignoring for test purposes
      const task = await taskDAO.create(taskData);
      expect(task).toBeDefined();
      expect(task.title).toBe(mockTask.title);
      expect(task.user_id).toBe(user.id);
    });

    it('should find tasks by status', async () => {
      const tasks = await taskDAO.findByStatus('user-123', 'pending');
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should find tasks by priority', async () => {
      const tasks = await taskDAO.findByPriority('user-123', 'high');
      expect(Array.isArray(tasks)).toBe(true);
    });
  });

  describe('Streak DAO Operations', () => {
    let createdStreakId: string;

    it('should create a new streak', async () => {
      // First create a user for foreign key constraint
      const user = await userDAO.create({
        username: 'streakuser',
        pin_hash: 'streak_pin_hash',
      });
      
      const streak = await streakDAO.createForUser(user.id);
      expect(streak).toBeDefined();
      expect(streak.user_id).toBe(user.id);
      expect(streak.current_streak).toBe(0);
      createdStreakId = streak.id;
    });

    it('should find streak by user ID', async () => {
      // First create a user
      const user = await userDAO.create({
        username: 'streakuser2',
        pin_hash: 'streak_pin_hash2',
      });
      
      await streakDAO.createForUser(user.id);
      const streak = await streakDAO.findByUserId(user.id);
      expect(streak).toBeDefined();
      expect(streak?.user_id).toBe(user.id);
    });

    it('should update streak counts', async () => {
      const result = await streakDAO.updateStreak(
        createdStreakId,
        5,
        10,
        new Date().toISOString()
      );
      expect(result).toBe(true);
    });
  });

  describe('Base DAO Operations', () => {
    it('should perform basic CRUD operations', async () => {
      // Create a user for testing
      const user = await userDAO.create({
        username: 'baseuser',
        pin_hash: 'base_pin_hash',
      });
      
      // Test findAllByUserId
      const users = await userDAO.findAllByUserId(user.id);
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      
      // Test findById
      const foundUser = await userDAO.findById(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      
      // Test update
      const updateResult = await userDAO.update(user.id, {
        username: 'updateduser',
      });
      expect(updateResult).toBe(true);
      
      // Test delete
      const deleteResult = await userDAO.delete(user.id);
      expect(deleteResult).toBe(true);
    });
  });
});