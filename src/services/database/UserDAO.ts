import { BaseDAO } from './BaseDAO';
import { User } from '../../types';
import { databaseService } from './DatabaseService';
import { DatabaseUtils } from './DatabaseUtils';

export class UserDAO extends BaseDAO<User> {
  constructor() {
    super('users');
  }

  /**
   * Find user by username
   */
  public async findByUsername(username: string): Promise<User | null> {
    const db = this.getDatabase();
    const query = 'SELECT * FROM users WHERE username = ?';
    const results = await db.executeSql(query, [username]);
    
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    
    return null;
  }

  /**
   * Check if username exists
   */
  public async usernameExists(username: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const results = await db.executeSql(query, [username]);
    
    return results[0].rows.item(0).count > 0;
  }

  /**
   * Create a new user
   */
  public async create(userData: { username: string; pin_hash: string }): Promise<User> {
    const db = this.getDatabase();
    const id = DatabaseUtils.generateId();
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const query = `
      INSERT INTO users (id, username, pin_hash, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await db.executeSql(query, [
      id,
      userData.username,
      userData.pin_hash,
      timestamp,
      timestamp
    ]);
    
    return {
      id,
      username: userData.username,
      pin_hash: userData.pin_hash,
      created_at: timestamp,
      updated_at: timestamp
    };
  }

  /**
   * Update user's PIN hash
   */
  public async updatePinHash(userId: string, pinHash: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE users SET pin_hash = ?, updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [pinHash, timestamp, userId]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Update user's last login timestamp
   */
  public async updateLastLogin(userId: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE users SET updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [timestamp, userId]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Get database instance
   */
  private getDatabase() {
    return databaseService.getDatabase();
  }
}

export const userDAO = new UserDAO();