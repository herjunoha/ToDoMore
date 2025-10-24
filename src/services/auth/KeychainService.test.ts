import { KeychainService } from './KeychainService';
import * as Keychain from 'react-native-keychain';

// Mock the react-native-keychain module
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  ACCESS_CONTROL: {
    USER_PRESENCE: 'UserPresence'
  }
}));

describe('KeychainService', () => {
  let keychainService: KeychainService;
  
  beforeEach(() => {
    keychainService = KeychainService.getInstance();
    
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the singleton instance
    (KeychainService as any).instance = null;
    keychainService = KeychainService.getInstance();
  });

  describe('storeUserCredentials', () => {
    it('should store user credentials successfully', async () => {
      const username = 'testuser';
      const pin = '1234';
      const userId = 'user123';

      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await keychainService.storeUserCredentials(username, pin, userId);

      expect(result).toBe(true);
      expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(2);
      
      // Check PIN storage call
      expect(Keychain.setGenericPassword).toHaveBeenNthCalledWith(1, username, pin, {
        service: 'user_pin',
        accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE
      });
      
      // Check user ID storage call
      expect(Keychain.setGenericPassword).toHaveBeenNthCalledWith(2, 'user_id', userId, {
        service: 'user_id',
        accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE
      });
    });

    it('should return false if storing credentials fails', async () => {
      const username = 'testuser';
      const pin = '1234';
      const userId = 'user123';

      (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(new Error('Storage failed'));

      const result = await keychainService.storeUserCredentials(username, pin, userId);

      expect(result).toBe(false);
    });
  });

  describe('getUserPin', () => {
    it('should retrieve user PIN successfully', async () => {
      const username = 'testuser';
      const pin = '1234';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username,
        password: pin,
        service: 'user_pin'
      });

      const result = await keychainService.getUserPin(username);

      expect(result).toBe(pin);
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: 'user_pin'
      });
    });

    it('should return null if credentials are not found', async () => {
      const username = 'testuser';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await keychainService.getUserPin(username);

      expect(result).toBeNull();
    });

    it('should return null if username does not match', async () => {
      const username = 'testuser';
      const storedUsername = 'otheruser';
      const pin = '1234';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: storedUsername,
        password: pin,
        service: 'user_pin'
      });

      const result = await keychainService.getUserPin(username);

      expect(result).toBeNull();
    });
  });

  describe('getUserId', () => {
    it('should retrieve user ID successfully', async () => {
      const userId = 'user123';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'user_id',
        password: userId,
        service: 'user_id'
      });

      const result = await keychainService.getUserId();

      expect(result).toBe(userId);
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: 'user_id'
      });
    });

    it('should return null if user ID is not found', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await keychainService.getUserId();

      expect(result).toBeNull();
    });

    it('should return null if username is not "user_id"', async () => {
      const userId = 'user123';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'wrong_username',
        password: userId,
        service: 'user_id'
      });

      const result = await keychainService.getUserId();

      expect(result).toBeNull();
    });
  });

  describe('updateUserPin', () => {
    it('should update user PIN successfully', async () => {
      const username = 'testuser';
      const newPin = '5678';
      const userId = 'user123';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'user_id',
        password: userId,
        service: 'user_id'
      });
      
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await keychainService.updateUserPin(username, newPin);

      expect(result).toBe(true);
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: 'user_id'
      });
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(username, newPin, {
        service: 'user_pin',
        accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE
      });
    });

    it('should return false if user ID is not found', async () => {
      const username = 'testuser';
      const newPin = '5678';
      
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await keychainService.updateUserPin(username, newPin);

      expect(result).toBe(false);
    });
  });

  describe('clearCredentials', () => {
    it('should clear all credentials successfully', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await keychainService.clearCredentials();

      expect(result).toBe(true);
      expect(Keychain.resetGenericPassword).toHaveBeenCalledTimes(2);
      expect(Keychain.resetGenericPassword).toHaveBeenNthCalledWith(1, {
        service: 'user_pin'
      });
      expect(Keychain.resetGenericPassword).toHaveBeenNthCalledWith(2, {
        service: 'user_id'
      });
    });

    it('should return false if clearing credentials fails', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockRejectedValue(new Error('Clear failed'));

      const result = await keychainService.clearCredentials();

      expect(result).toBe(false);
    });
  });

  describe('hasCredentials', () => {
    it('should return true if credentials exist', async () => {
      const username = 'testuser';
      const pin = '1234';
      const userId = 'user123';
      
      (Keychain.getGenericPassword as jest.Mock)
        .mockResolvedValueOnce({
          username,
          password: pin,
          service: 'user_pin'
        })
        .mockResolvedValueOnce({
          username: 'user_id',
          password: userId,
          service: 'user_id'
        });

      const result = await keychainService.hasCredentials(username);

      expect(result).toBe(true);
    });

    it('should return false if PIN is missing', async () => {
      const username = 'testuser';
      const userId = 'user123';
      
      (Keychain.getGenericPassword as jest.Mock)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce({
          username: 'user_id',
          password: userId,
          service: 'user_id'
        });

      const result = await keychainService.hasCredentials(username);

      expect(result).toBe(false);
    });

    it('should return false if user ID is missing', async () => {
      const username = 'testuser';
      const pin = '1234';
      
      (Keychain.getGenericPassword as jest.Mock)
        .mockResolvedValueOnce({
          username,
          password: pin,
          service: 'user_pin'
        })
        .mockResolvedValueOnce(false);

      const result = await keychainService.hasCredentials(username);

      expect(result).toBe(false);
    });
  });
});