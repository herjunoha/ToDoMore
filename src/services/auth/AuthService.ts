import { userDAO } from '../database/UserDAO';
import { keychainService } from './KeychainService';
import { PinHashUtils } from './PinHashUtils';
import { User } from '../../types';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user with username and PIN
   */
  public async register(username: string, pin: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate PIN format
      if (!PinHashUtils.isValidPinFormat(pin)) {
        return {
          success: false,
          error: 'PIN must be a 4-digit number'
        };
      }

      // Check if username already exists
      const usernameExists = await userDAO.usernameExists(username);
      if (usernameExists) {
        return {
          success: false,
          error: 'Username already exists'
        };
      }

      // Hash the PIN
      const pinHash = PinHashUtils.hashPin(pin);

      // Create user in database
      const user = await userDAO.create({
        username,
        pin_hash: pinHash
      });

      // Store credentials securely
      const stored = await keychainService.storeUserCredentials(username, pin, user.id);
      if (!stored) {
        // If storing credentials fails, we should delete the user to maintain consistency
        // In a production app, you might want to handle this more gracefully
        console.warn('Failed to store credentials securely');
      }

      this.currentUser = user;

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Failed to register user'
      };
    }
  }

  /**
   * Login with username and PIN
   */
  public async login(username: string, pin: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate PIN format
      if (!PinHashUtils.isValidPinFormat(pin)) {
        return {
          success: false,
          error: 'PIN must be a 4-digit number'
        };
      }

      // Find user by username
      const user = await userDAO.findByUsername(username);
      if (!user) {
        return {
          success: false,
          error: 'Invalid username or PIN'
        };
      }

      // Validate PIN
      const isValidPin = PinHashUtils.validatePin(pin, user.pin_hash);
      if (!isValidPin) {
        return {
          success: false,
          error: 'Invalid username or PIN'
        };
      }

      // Update last login
      await userDAO.updateLastLogin(user.id);

      // Store credentials securely for future use
      await keychainService.storeUserCredentials(username, pin, user.id);

      this.currentUser = user;

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Failed to login'
      };
    }
  }

  /**
   * Logout current user
   */
  public async logout(): Promise<void> {
    // Clear secure credentials
    await keychainService.clearCredentials();
    
    // Clear current user
    this.currentUser = null;
  }

  /**
   * Check if user is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Get current authenticated user
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Change PIN for current user
   */
  public async changePin(oldPin: string, newPin: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user is currently authenticated'
        };
      }

      // Validate PIN formats
      if (!PinHashUtils.isValidPinFormat(oldPin)) {
        return {
          success: false,
          error: 'Current PIN must be a 4-digit number'
        };
      }

      if (!PinHashUtils.isValidPinFormat(newPin)) {
        return {
          success: false,
          error: 'New PIN must be a 4-digit number'
        };
      }

      // Validate old PIN
      const isValidOldPin = PinHashUtils.validatePin(oldPin, this.currentUser.pin_hash);
      if (!isValidOldPin) {
        return {
          success: false,
          error: 'Current PIN is incorrect'
        };
      }

      // Hash new PIN
      const newPinHash = PinHashUtils.hashPin(newPin);

      // Update PIN in database
      const updated = await userDAO.updatePinHash(this.currentUser.id, newPinHash);
      if (!updated) {
        return {
          success: false,
          error: 'Failed to update PIN'
        };
      }

      // Update PIN in secure storage
      await keychainService.updateUserPin(this.currentUser.username, newPin);

      // Update current user object
      this.currentUser.pin_hash = newPinHash;

      return {
        success: true
      };
    } catch (error) {
      console.error('Change PIN error:', error);
      return {
        success: false,
        error: 'Failed to change PIN'
      };
    }
  }

  /**
   * Check if credentials are stored securely for auto-login
   */
  public async checkStoredCredentials(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      // Check if we have stored credentials
      const userId = await keychainService.getUserId();
      if (!userId) {
        return { isAuthenticated: false };
      }

      // Get user from database
      // Note: In a real implementation, you might want to validate the stored PIN as well
      const user = await userDAO.findById(userId);
      if (!user) {
        // If user doesn't exist, clear credentials
        await keychainService.clearCredentials();
        return { isAuthenticated: false };
      }

      this.currentUser = user;
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Check stored credentials error:', error);
      // If there's an error, clear credentials to be safe
      await keychainService.clearCredentials();
      return { isAuthenticated: false };
    }
  }
}

export const authService = AuthService.getInstance();