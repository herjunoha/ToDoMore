import { AuthService } from './AuthService';
import { userDAO } from '../database/UserDAO';
import { keychainService } from './KeychainService';
import { PinHashUtils } from './PinHashUtils';

// Mock the dependencies
jest.mock('../database/UserDAO');
jest.mock('./KeychainService');
jest.mock('./PinHashUtils');

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = AuthService.getInstance();
    
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the singleton instance
    (AuthService as any).instance = null;
    authService = AuthService.getInstance();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const username = 'testuser';
      const pin = '1234';
      const hashedPin = 'hashed1234';
      const mockUser = {
        id: 'user123',
        username,
        pin_hash: hashedPin,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Mock the dependencies
      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(true);
      (userDAO.usernameExists as jest.Mock).mockResolvedValue(false);
      (PinHashUtils.hashPin as jest.Mock).mockReturnValue(hashedPin);
      (userDAO.create as jest.Mock).mockResolvedValue(mockUser);
      (keychainService.storeUserCredentials as jest.Mock).mockResolvedValue(true);

      const result = await authService.register(username, pin);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(PinHashUtils.isValidPinFormat).toHaveBeenCalledWith(pin);
      expect(userDAO.usernameExists).toHaveBeenCalledWith(username);
      expect(PinHashUtils.hashPin).toHaveBeenCalledWith(pin);
      expect(userDAO.create).toHaveBeenCalledWith({
        username,
        pin_hash: hashedPin
      });
      expect(keychainService.storeUserCredentials).toHaveBeenCalledWith(username, pin, mockUser.id);
    });

    it('should fail registration if PIN format is invalid', async () => {
      const username = 'testuser';
      const invalidPin = '123'; // Too short

      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(false);

      const result = await authService.register(username, invalidPin);

      expect(result.success).toBe(false);
      expect(result.error).toBe('PIN must be a 4-digit number');
    });

    it('should fail registration if username already exists', async () => {
      const username = 'testuser';
      const pin = '1234';

      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(true);
      (userDAO.usernameExists as jest.Mock).mockResolvedValue(true);

      const result = await authService.register(username, pin);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const username = 'testuser';
      const pin = '1234';
      const hashedPin = 'hashed1234';
      const mockUser = {
        id: 'user123',
        username,
        pin_hash: hashedPin,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Mock the dependencies
      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(true);
      (userDAO.findByUsername as jest.Mock).mockResolvedValue(mockUser);
      (PinHashUtils.validatePin as jest.Mock).mockReturnValue(true);
      (userDAO.updateLastLogin as jest.Mock).mockResolvedValue(true);
      (keychainService.storeUserCredentials as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(username, pin);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(PinHashUtils.isValidPinFormat).toHaveBeenCalledWith(pin);
      expect(userDAO.findByUsername).toHaveBeenCalledWith(username);
      expect(PinHashUtils.validatePin).toHaveBeenCalledWith(pin, hashedPin);
      expect(userDAO.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
      expect(keychainService.storeUserCredentials).toHaveBeenCalledWith(username, pin, mockUser.id);
    });

    it('should fail login if PIN format is invalid', async () => {
      const username = 'testuser';
      const invalidPin = '123'; // Too short

      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(false);

      const result = await authService.login(username, invalidPin);

      expect(result.success).toBe(false);
      expect(result.error).toBe('PIN must be a 4-digit number');
    });

    it('should fail login if user does not exist', async () => {
      const username = 'nonexistent';
      const pin = '1234';

      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(true);
      (userDAO.findByUsername as jest.Mock).mockResolvedValue(null);

      const result = await authService.login(username, pin);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or PIN');
    });

    it('should fail login if PIN is incorrect', async () => {
      const username = 'testuser';
      const pin = '1234';
      const hashedPin = 'hashed1234';
      const mockUser = {
        id: 'user123',
        username,
        pin_hash: hashedPin,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(true);
      (userDAO.findByUsername as jest.Mock).mockResolvedValue(mockUser);
      (PinHashUtils.validatePin as jest.Mock).mockReturnValue(false);

      const result = await authService.login(username, pin);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or PIN');
    });
  });

  describe('logout', () => {
    it('should logout user and clear credentials', async () => {
      (keychainService.clearCredentials as jest.Mock).mockResolvedValue(true);

      await authService.logout();

      expect(keychainService.clearCredentials).toHaveBeenCalled();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('changePin', () => {
    it('should change PIN successfully', async () => {
      const oldPin = '1234';
      const newPin = '5678';
      const hashedOldPin = 'hashed1234';
      const hashedNewPin = 'hashed5678';
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        pin_hash: hashedOldPin,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Set current user
      (authService as any).currentUser = mockUser;

      // Mock the dependencies
      (PinHashUtils.isValidPinFormat as jest.Mock).mockReturnValue(true);
      (PinHashUtils.validatePin as jest.Mock).mockReturnValue(true);
      (PinHashUtils.hashPin as jest.Mock).mockReturnValue(hashedNewPin);
      (userDAO.updatePinHash as jest.Mock).mockResolvedValue(true);
      (keychainService.updateUserPin as jest.Mock).mockResolvedValue(true);

      const result = await authService.changePin(oldPin, newPin);

      expect(result.success).toBe(true);
      expect(PinHashUtils.isValidPinFormat).toHaveBeenCalledWith(oldPin);
      expect(PinHashUtils.isValidPinFormat).toHaveBeenCalledWith(newPin);
      expect(PinHashUtils.validatePin).toHaveBeenCalledWith(oldPin, hashedOldPin);
      expect(PinHashUtils.hashPin).toHaveBeenCalledWith(newPin);
      expect(userDAO.updatePinHash).toHaveBeenCalledWith(mockUser.id, hashedNewPin);
      expect(keychainService.updateUserPin).toHaveBeenCalledWith('testuser', newPin);
    });

    it('should fail to change PIN if not authenticated', async () => {
      const oldPin = '1234';
      const newPin = '5678';

      // Ensure no user is authenticated
      (authService as any).currentUser = null;

      const result = await authService.changePin(oldPin, newPin);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No user is currently authenticated');
    });
  });
});