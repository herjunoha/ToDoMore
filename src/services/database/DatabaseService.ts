/**
 * Database Service for SQLite operations
 * Handles database initialization, table creation, and connection management
 */

import SQLite from 'react-native-sqlite-storage';
import { Migrations } from './Migrations';

import { DB_NAME, DB_VERSION } from '../../constants';
SQLite.DEBUG(false); // Set to true for debugging
SQLite.enablePromise(true);

export class DatabaseService {
  private static instance: DatabaseService;
  private db: any | null = null;
  private version: number = DB_VERSION;

  // Private constructor for singleton pattern
  private constructor() {}

  // Singleton instance getter
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize the database connection and create tables
   */
  public async initialize(): Promise<void> {
    try {
      // Open database connection
      this.db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      // Check current database version
      const currentVersion = await this.getDatabaseVersion();
      
      // Create tables
      await this.createTables();
      
      // If database is being upgraded, run migrations
      if (currentVersion < this.version) {
        await Migrations.runMigrations(currentVersion, this.version);
      }
      
      // Update version
      await this.setDatabaseVersion(this.version);
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }

  /**
   * Get current database version
   */
  private async getDatabaseVersion(): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Create metadata table if it doesn't exist
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS metadata (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);

      // Get current version
      const result = await this.db.executeSql(
        'SELECT value FROM metadata WHERE key = ?',
        ['version']
      );

      if (result[0].rows.length > 0) {
        return parseInt(result[0].rows.item(0).value, 10);
      }
      
      return 0; // Default version
    } catch (error) {
      console.error('Error getting database version:', error);
      return 0;
    }
  }

  /**
   * Set database version
   */
  private async setDatabaseVersion(version: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      await this.db.executeSql(
        'INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)',
        ['version', version.toString()]
      );
    } catch (error) {
      console.error('Error setting database version:', error);
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  private async runMigrations(fromVersion: number, toVersion: number): Promise<void> {
    console.log(`Running migrations from version ${fromVersion} to ${toVersion}`);
    await Migrations.runMigrations(fromVersion, toVersion);
    console.log('Migrations completed');
  }

  /**
   * Create all required tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Start transaction for better performance
      await this.db.executeSql('BEGIN TRANSACTION;');

      // Create metadata table for version tracking
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS metadata (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);

      // Create users table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          pin_hash TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);

      // Create goals table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS goals (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          specific TEXT NOT NULL,
          measurable TEXT NOT NULL,
          achievable TEXT NOT NULL,
          relevant TEXT NOT NULL,
          time_bound TEXT NOT NULL,
          title TEXT,
          description TEXT,
          status TEXT NOT NULL,
          progress REAL DEFAULT 0,
          parent_goal_id TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (parent_goal_id) REFERENCES goals(id) ON DELETE CASCADE
        );
      `);

      // Create tasks table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          due_date TEXT,
          priority TEXT,
          status TEXT NOT NULL,
          parent_task_id TEXT,
          goal_id TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
          FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
        );
      `);

      // Create streaks table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS streaks (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL UNIQUE,
          current_streak INTEGER NOT NULL DEFAULT 0,
          longest_streak INTEGER NOT NULL DEFAULT 0,
          last_completed_date TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Create indexes for better query performance
      await this.createIndexes();

      // Commit transaction
      await this.db.executeSql('COMMIT;');

      console.log('Database tables created successfully');
    } catch (error) {
      // Rollback transaction on error
      await this.db.executeSql('ROLLBACK;');
      console.error('Error creating tables:', error);
      throw new Error(`Failed to create tables: ${error}`);
    }
  }

  /**
   * Create indexes for better query performance
   */
  private async createIndexes(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Users indexes
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);');

      // Goals indexes
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_goals_parent_goal_id ON goals(parent_goal_id);');

      // Tasks indexes
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);');

      // Streaks indexes
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);');

      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw new Error(`Failed to create indexes: ${error}`);
    }
  }

  /**
   * Get database connection
   */
  public getDatabase(): any {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Database connection closed');
    }
  }

  /**
   * Delete database (useful for testing or reset)
   */
  public static async deleteDatabase(): Promise<void> {
    try {
      await SQLite.deleteDatabase({
        name: DB_NAME,
        location: 'default',
      });
      console.log('Database deleted successfully');
    } catch (error) {
      console.error('Error deleting database:', error);
      throw new Error(`Failed to delete database: ${error}`);
    }
  }

  /**
   * Check if database is initialized
   */
  public isInitialized(): boolean {
    return this.db !== null;
  }

  /**
   * Execute a SQL query with parameters
   */
  public async executeQuery<T>(
    query: string,
    params: any[] = []
  ): Promise<any> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const results = await this.db.executeSql(query, params);
      return results[0];
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error(`Query execution failed: ${error}`);
    }
  }

  /**
   * Execute multiple SQL statements in a transaction
   */
  public async executeTransaction(queries: Array<{query: string, params?: any[]}>): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      await this.db.executeSql('BEGIN TRANSACTION;');
      
      for (const {query, params = []} of queries) {
        await this.db.executeSql(query, params);
      }
      
      await this.db.executeSql('COMMIT;');
    } catch (error) {
      await this.db.executeSql('ROLLBACK;');
      console.error('Transaction failed:', error);
      throw new Error(`Transaction failed: ${error}`);
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();
