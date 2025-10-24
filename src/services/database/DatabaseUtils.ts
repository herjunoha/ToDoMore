/**
 * Database Utilities
 * Helper functions for common database operations
 */

import { databaseService } from './DatabaseService';

export class DatabaseUtils {
  /**
   * Generate a UUID-like ID
   */
  public static generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get current ISO timestamp
   */
  public static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Convert JavaScript Date to ISO string
   */
  public static dateToISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Convert ISO string to JavaScript Date
   */
  public static isoStringToDate(isoString: string): Date {
    return new Date(isoString);
  }

  /**
   * Escape SQL special characters
   */
  public static escapeSqlString(str: string): string {
    return str.replace(/'/g, "''");
  }

  /**
   * Validate if a string is a valid UUID
   */
  public static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Backup database (placeholder for future implementation)
   */
  public static async backupDatabase(): Promise<boolean> {
    try {
      // In a real implementation, this would backup the SQLite database file
      console.log('Database backup would be implemented here');
      return true;
    } catch (error) {
      console.error('Database backup failed:', error);
      return false;
    }
  }

  /**
   * Restore database (placeholder for future implementation)
   */
  public static async restoreDatabase(): Promise<boolean> {
    try {
      // In a real implementation, this would restore the SQLite database file
      console.log('Database restore would be implemented here');
      return true;
    } catch (error) {
      console.error('Database restore failed:', error);
      return false;
    }
  }

  /**
   * Clear all data (useful for testing)
   */
  public static async clearAllData(): Promise<void> {
    const db = databaseService.getDatabase();
    
    await db.executeSql('BEGIN TRANSACTION;');
    
    try {
      // Clear all tables in reverse order of foreign key dependencies
      await db.executeSql('DELETE FROM tasks;');
      await db.executeSql('DELETE FROM goals;');
      await db.executeSql('DELETE FROM streaks;');
      await db.executeSql('DELETE FROM users;');
      
      // Reset auto-increment counters (if any)
      await db.executeSql('DELETE FROM sqlite_sequence WHERE name IN ("users", "goals", "tasks", "streaks");');
      
      await db.executeSql('COMMIT;');
      console.log('All data cleared successfully');
    } catch (error) {
      await db.executeSql('ROLLBACK;');
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  public static async getDatabaseStats(): Promise<any> {
    const db = databaseService.getDatabase();
    
    try {
      const stats: any = {};
      
      // Get table counts
      const userCount = await db.executeSql('SELECT COUNT(*) as count FROM users;');
      stats.users = userCount[0].rows.item(0).count;
      
      const goalCount = await db.executeSql('SELECT COUNT(*) as count FROM goals;');
      stats.goals = goalCount[0].rows.item(0).count;
      
      const taskCount = await db.executeSql('SELECT COUNT(*) as count FROM tasks;');
      stats.tasks = taskCount[0].rows.item(0).count;
      
      const streakCount = await db.executeSql('SELECT COUNT(*) as count FROM streaks;');
      stats.streaks = streakCount[0].rows.item(0).count;
      
      // Get database size (approximate)
      const dbSize = await db.executeSql("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();");
      stats.size = dbSize[0].rows.item(0).size;
      
      return stats;
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }
}