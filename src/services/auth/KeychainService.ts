import * as Keychain from 'react-native-keychain';
import { SECURE_STORAGE_KEYS } from '../../constants';

export class KeychainService {
  private static instance: KeychainService;

  private constructor() {}

  public static getInstance(): KeychainService {
    if (!KeychainService.instance) {
      KeychainService.instance = new KeychainService();
    }
    return KeychainService.instance;
  }

  /**
   * Store user credentials securely
   */
  public async storeUserCredentials(
    username: string,
    pin: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Store PIN with username as the key
      await Keychain.setGenericPassword(
        username,
        pin,
        {
          service: SECURE_STORAGE_KEYS.USER_PIN,
          accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
        }
      );

      // Store user ID
      await Keychain.setGenericPassword(
        'user_id',
        userId,
        {
          service: SECURE_STORAGE_KEYS.USER_ID,
          accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
        }
      );

      return true;
    } catch (error) {
      console.error('Error storing user credentials:', error);
      return false;
    }
  }

  /**
   * Retrieve stored PIN for a username
   */
  public async getUserPin(username: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: SECURE_STORAGE_KEYS.USER_PIN,
      });

      if (credentials && credentials.username === username) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving user PIN:', error);
      return null;
    }
  }

  /**
   * Retrieve stored user ID
   */
  public async getUserId(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: SECURE_STORAGE_KEYS.USER_ID,
      });

      if (credentials && credentials.username === 'user_id') {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
  }

  /**
   * Update stored PIN for a user
   */
  public async updateUserPin(username: string, newPin: string): Promise<boolean> {
    try {
      // We need to get the user ID first to preserve it
      const userId = await this.getUserId();
      
      if (!userId) {
        return false;
      }

      // Store updated PIN
      await Keychain.setGenericPassword(
        username,
        newPin,
        {
          service: SECURE_STORAGE_KEYS.USER_PIN,
          accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
        }
      );

      return true;
    } catch (error) {
      console.error('Error updating user PIN:', error);
      return false;
    }
  }

  /**
   * Clear all stored credentials
   */
  public async clearCredentials(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: SECURE_STORAGE_KEYS.USER_PIN,
      });
      
      await Keychain.resetGenericPassword({
        service: SECURE_STORAGE_KEYS.USER_ID,
      });

      return true;
    } catch (error) {
      console.error('Error clearing credentials:', error);
      return false;
    }
  }

  /**
   * Check if credentials exist for a username
   */
  public async hasCredentials(username: string): Promise<boolean> {
    try {
      const pin = await this.getUserPin(username);
      const userId = await this.getUserId();
      
      return !!pin && !!userId;
    } catch (error) {
      console.error('Error checking credentials:', error);
      return false;
    }
  }
}

export const keychainService = KeychainService.getInstance();