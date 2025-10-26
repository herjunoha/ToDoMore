/**
 * Authentication Flow Integration Tests
 * Tests complete authentication workflows with database and keychain
 */

import { AuthService } from './AuthService';
import { userDAO } from '../database/UserDAO';
import { streakDAO } from '../database/StreakDAO';
import { databaseService } from '../database/DatabaseService';
import { keychainService } from './KeychainService';
import { PinHashUtils } from './PinHashUtils';

describe('Authentication Flow Integration Tests', () => {
  beforeAll(async () => {
    // Initialize database
    await databaseService.initialize();
  });

  afterAll(async () => {
    // Close database
    await databaseService.close();
  });

  beforeEach(async () => {
    // Reset auth service singleton
    (AuthService as any).instance = null;
    
    // Clear keychain
    await keychainService.clearCredentials();
  });

  describe('Registration Flow', () => {
    it('should complete full registration flow', async () => {
      const username = 'integration_user_' + Date.now();
      const pin = '1234';

      const authService = AuthService.getInstance();

      // Register user
      const result = await authService.register(username, pin);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe(username);
      expect(result.user?.id).toBeDefined();

      // Verify user in database
      const dbUser = await userDAO.findByUsername(username);
      expect(dbUser).toBeDefined();
      expect(dbUser?.username).toBe(username);

      // Verify PIN hash is not plain text
      expect(dbUser?.pin_hash).not.toBe(pin);

      // Verify streak created for user
      const streak = await streakDAO.findByUserId(dbUser!.id);
      expect(streak).toBeDefined();
      expect(streak?.user_id).toBe(dbUser!.id);
      expect(streak?.current_streak).toBe(0);

      // Cleanup
      if (dbUser) {
        await streakDAO.delete(streak!.id);
        await userDAO.delete(dbUser.id);
      }
    });

    it('should prevent duplicate username registration', async () => {
      const authService = AuthService.getInstance();
      const username = 'duplicate_user_' + Date.now();
      const pin = '1234';

      // First registration
      const firstResult = await authService.register(username, pin);
      expect(firstResult.success).toBe(true);

      // Reset service
      (AuthService as any).instance = null;

      // Second registration with same username
      const secondResult = await authService.register(username, pin);
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already exists');

      // Cleanup
      if (firstResult.user?.id) {
        const streak = await streakDAO.findByUserId(firstResult.user.id);
        if (streak) await streakDAO.delete(streak.id);
        await userDAO.delete(firstResult.user.id);
      }
    });

    it('should validate PIN format during registration', async () => {
      const authService = AuthService.getInstance();

      // Test too short PIN
      const shortResult = await authService.register('user_short_pin', '123');
      expect(shortResult.success).toBe(false);
      expect(shortResult.error).toContain('4-digit');

      // Test non-numeric PIN
      const alphaResult = await authService.register('user_alpha_pin', 'abcd');
      expect(alphaResult.success).toBe(false);
    });
  });

  describe('Login Flow', () => {
    let testUserId: string;
    let testUsername: string;

    beforeEach(async () => {
      // Create a test user
      const user = await userDAO.create({
        username: 'login_user_' + Date.now(),
        pin_hash: PinHashUtils.hashPin('5678'),
      });
      testUserId = user.id;
      testUsername = user.username;

      // Create streak for user
      await streakDAO.createForUser(testUserId);
    });

    afterEach(async () => {
      // Cleanup test user
      const streak = await streakDAO.findByUserId(testUserId);
      if (streak) await streakDAO.delete(streak.id);
      await userDAO.delete(testUserId);
    });

    it('should complete full login flow', async () => {
      const authService = AuthService.getInstance();
      const correctPin = '5678';

      const result = await authService.login(testUsername, correctPin);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe(testUsername);
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getCurrentUser()?.id).toBe(testUserId);
    });

    it('should reject login with incorrect PIN', async () => {
      const authService = AuthService.getInstance();
      const wrongPin = '9999';

      const result = await authService.login(testUsername, wrongPin);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should reject login for non-existent user', async () => {
      const authService = AuthService.getInstance();

      const result = await authService.login('nonexistent_user', '1234');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should validate PIN format during login', async () => {
      const authService = AuthService.getInstance();

      const result = await authService.login(testUsername, '123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('4-digit');
    });
  });

  describe('Logout Flow', () => {
    it('should clear authentication on logout', async () => {
      const authService = AuthService.getInstance();

      // Create and login a user
      const user = await userDAO.create({
        username: 'logout_user_' + Date.now(),
        pin_hash: PinHashUtils.hashPin('1111'),
      });
      await streakDAO.createForUser(user.id);

      // Login
      const loginResult = await authService.login(user.username, '1111');
      expect(loginResult.success).toBe(true);
      expect(authService.isAuthenticated()).toBe(true);

      // Logout
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getCurrentUser()).toBeNull();

      // Cleanup
      const streak = await streakDAO.findByUserId(user.id);
      if (streak) await streakDAO.delete(streak.id);
      await userDAO.delete(user.id);
    });
  });

  describe('Change PIN Flow', () => {
    let testUserId: string;
    let testUsername: string;
    const originalPin = '1111';
    const newPin = '2222';

    beforeEach(async () => {
      // Create a test user
      const user = await userDAO.create({
        username: 'changepin_user_' + Date.now(),
        pin_hash: PinHashUtils.hashPin(originalPin),
      });
      testUserId = user.id;
      testUsername = user.username;

      // Create streak for user
      await streakDAO.createForUser(testUserId);

      // Login the user
      const authService = AuthService.getInstance();
      await authService.login(testUsername, originalPin);
    });

    afterEach(async () => {
      // Cleanup test user
      const streak = await streakDAO.findByUserId(testUserId);
      if (streak) await streakDAO.delete(streak.id);
      await userDAO.delete(testUserId);
      
      // Reset auth service
      (AuthService as any).instance = null;
    });

    it('should complete PIN change flow', async () => {
      const authService = AuthService.getInstance();

      const result = await authService.changePin(originalPin, newPin);

      expect(result.success).toBe(true);

      // Verify old PIN doesn't work anymore
      (AuthService as any).instance = null;
      const oldPinLoginResult = await AuthService.getInstance().login(testUsername, originalPin);
      expect(oldPinLoginResult.success).toBe(false);

      // Verify new PIN works
      (AuthService as any).instance = null;
      const newPinLoginResult = await AuthService.getInstance().login(testUsername, newPin);
      expect(newPinLoginResult.success).toBe(true);
    });

    it('should reject PIN change with wrong old PIN', async () => {
      const authService = AuthService.getInstance();

      const result = await authService.changePin('9999', newPin);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');

      // Verify original PIN still works
      (AuthService as any).instance = null;
      const loginResult = await AuthService.getInstance().login(testUsername, originalPin);
      expect(loginResult.success).toBe(true);
    });

    it('should validate new PIN format', async () => {
      const authService = AuthService.getInstance();

      const result = await authService.changePin(originalPin, '222');

      expect(result.success).toBe(false);
      expect(result.error).toContain('4-digit');
    });
  });

  describe('Authentication Persistence', () => {
    it('should persist authentication state after logout/login cycle', async () => {
      const username = 'persistence_user_' + Date.now();
      const pin = '3333';

      // First cycle - Register
      let authService = AuthService.getInstance();
      const registerResult = await authService.register(username, pin);
      expect(registerResult.success).toBe(true);
      expect(authService.isAuthenticated()).toBe(true);

      // Logout
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);

      // Reset service
      (AuthService as any).instance = null;

      // Login again
      authService = AuthService.getInstance();
      const loginResult = await authService.login(username, pin);
      expect(loginResult.success).toBe(true);
      expect(authService.isAuthenticated()).toBe(true);

      // Cleanup
      if (loginResult.user?.id) {
        const streak = await streakDAO.findByUserId(loginResult.user.id);
        if (streak) await streakDAO.delete(streak.id);
        await userDAO.delete(loginResult.user.id);
      }
    });
  });

  describe('Security', () => {
    it('should never store plain text PIN', async () => {
      const username = 'security_user_' + Date.now();
      const plainPin = '4444';

      const authService = AuthService.getInstance();
      const result = await authService.register(username, plainPin);

      expect(result.success).toBe(true);

      // Get user from database
      const dbUser = await userDAO.findByUsername(username);
      expect(dbUser).toBeDefined();

      // Verify PIN hash is not the plain PIN
      expect(dbUser?.pin_hash).not.toBe(plainPin);

      // Verify PIN hash is a valid hash (should be longer than PIN)
      expect(dbUser?.pin_hash.length).toBeGreaterThan(plainPin.length);

      // Cleanup
      if (dbUser) {
        const streak = await streakDAO.findByUserId(dbUser.id);
        if (streak) await streakDAO.delete(streak.id);
        await userDAO.delete(dbUser.id);
      }
    });

    it('should use consistent PIN hashing', async () => {
      const testPin = '5555';

      // Hash the same PIN multiple times
      const hash1 = PinHashUtils.hashPin(testPin);
      const hash2 = PinHashUtils.hashPin(testPin);

      // Validate against both hashes
      const validate1 = PinHashUtils.validatePin(testPin, hash1);
      const validate2 = PinHashUtils.validatePin(testPin, hash2);

      expect(validate1).toBe(true);
      expect(validate2).toBe(true);

      // Verify hashes produce consistent results
      expect(hash1).toBe(hash2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapidly repeated login attempts', async () => {
      const username = 'rapid_user_' + Date.now();
      const pin = '6666';

      // Register
      let authService = AuthService.getInstance();
      await authService.register(username, pin);

      // Rapid login attempts
      (AuthService as any).instance = null;
      authService = AuthService.getInstance();

      const attempt1 = await authService.login(username, pin);
      expect(attempt1.success).toBe(true);

      (AuthService as any).instance = null;
      authService = AuthService.getInstance();

      const attempt2 = await authService.login(username, pin);
      expect(attempt2.success).toBe(true);

      (AuthService as any).instance = null;
      authService = AuthService.getInstance();

      const attempt3 = await authService.login(username, pin);
      expect(attempt3.success).toBe(true);

      // Cleanup
      if (attempt3.user?.id) {
        const streak = await streakDAO.findByUserId(attempt3.user.id);
        if (streak) await streakDAO.delete(streak.id);
        await userDAO.delete(attempt3.user.id);
      }
    });

    it('should handle PIN with special characters', async () => {
      const authService = AuthService.getInstance();

      // PIN must be numeric only
      const result = await authService.register('special_user', '12@4');

      expect(result.success).toBe(false);
    });

    it('should handle empty credentials', async () => {
      const authService = AuthService.getInstance();

      const result = await authService.login('', '1234');

      expect(result.success).toBe(false);
    });
  });
});
