import { BaseDAO } from './BaseDAO';
import { Streak } from '../../types';
import { databaseService } from './DatabaseService';
import { DatabaseUtils } from './DatabaseUtils';

export class StreakDAO extends BaseDAO<Streak> {
  constructor() {
    super('streaks');
  }

  /**
   * Find streak by user ID
   */
  public async findByUserId(userId: string): Promise<Streak | null> {
    return await this.findOneWhere('user_id = ?', [userId]);
  }

  /**
   * Create initial streak for user
   */
  public async createForUser(userId: string): Promise<Streak> {
    const db = this.getDatabase();
    const id = DatabaseUtils.generateId();
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const query = `
      INSERT INTO streaks (id, user_id, current_streak, longest_streak, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await db.executeSql(query, [
      id,
      userId,
      0,
      0,
      timestamp,
      timestamp
    ]);
    
    return {
      id,
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      created_at: timestamp,
      updated_at: timestamp
    };
  }

  /**
   * Update streak counts
   */
  public async updateStreak(streakId: string, currentStreak: number, longestStreak: number, lastCompletedDate?: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE streaks SET current_streak = ?, longest_streak = ?, last_completed_date = ?, updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [
      currentStreak,
      longestStreak,
      lastCompletedDate || null,
      timestamp,
      streakId
    ]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Increment current streak
   */
  public async incrementStreak(streakId: string, lastCompletedDate: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = `
      UPDATE streaks 
      SET current_streak = current_streak + 1,
          longest_streak = CASE 
            WHEN current_streak + 1 > longest_streak THEN current_streak + 1 
            ELSE longest_streak 
          END,
          last_completed_date = ?,
          updated_at = ?
      WHERE id = ?
    `;
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [
      lastCompletedDate,
      timestamp,
      streakId
    ]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Reset current streak
   */
  public async resetStreak(streakId: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE streaks SET current_streak = 0, updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [timestamp, streakId]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Get streak statistics for user
   */
  public async getStreakStats(userId: string): Promise<any> {
    const db = this.getDatabase();
    const query = `
      SELECT 
        current_streak,
        longest_streak,
        last_completed_date,
        CASE 
          WHEN last_completed_date IS NULL THEN 0
          WHEN DATE(last_completed_date) = DATE('now', '-1 day') THEN 1
          WHEN DATE(last_completed_date) = DATE('now') THEN 1
          ELSE 0
        END as is_active
      FROM streaks 
      WHERE user_id = ?
    `;
    
    const results = await db.executeSql(query, [userId]);
    
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    
    return null;
  }

  /**
   * Get database instance
   */
  private getDatabase() {
    return databaseService.getDatabase();
  }
}

export const streakDAO = new StreakDAO();