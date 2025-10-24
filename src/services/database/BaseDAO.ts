/**
 * Base Data Access Object class
 * Provides common database operations for all entities
 */

import { databaseService } from './DatabaseService';

export abstract class BaseDAO<T extends Record<string, any>> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Find all records for a user
   */
  public async findAllByUserId(userId: string): Promise<T[]> {
    const db = databaseService.getDatabase();
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC`;
    const results = await db.executeSql(query, [userId]);
    
    const items: T[] = [];
    const rows = results[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    
    return items;
  }

  /**
   * Find a record by ID
   */
  public async findById(id: string): Promise<T | null> {
    const db = databaseService.getDatabase();
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await db.executeSql(query, [id]);
    
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    
    return null;
  }

  /**
   * Create a new record
   */
  public async create(item: Partial<T>): Promise<T> {
    const db = databaseService.getDatabase();
    
    // Filter out undefined values
    const definedItem: Record<string, any> = {};
    Object.keys(item).forEach(key => {
      if (item[key] !== undefined) {
        definedItem[key] = item[key];
      }
    });
    
    const columns = Object.keys(definedItem).join(', ');
    const placeholders = Object.keys(definedItem).map(() => '?').join(', ');
    const values = Object.values(definedItem);
    
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    await db.executeSql(query, values);
    
    return item as T;
  }

  /**
   * Update a record
   */
  public async update(id: string, item: Partial<T>): Promise<boolean> {
    const db = databaseService.getDatabase();
    
    // Filter out undefined values
    const definedItem: Record<string, any> = {};
    Object.keys(item).forEach(key => {
      if (item[key] !== undefined) {
        definedItem[key] = item[key];
      }
    });
    
    if (Object.keys(definedItem).length === 0) {
      return false; // Nothing to update
    }
    
    const columns = Object.keys(definedItem).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(definedItem), id];
    
    const query = `UPDATE ${this.tableName} SET ${columns} WHERE id = ?`;
    const results = await db.executeSql(query, values);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Delete a record
   */
  public async delete(id: string): Promise<boolean> {
    const db = databaseService.getDatabase();
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const results = await db.executeSql(query, [id]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Delete all records for a user
   */
  public async deleteAllByUserId(userId: string): Promise<number> {
    const db = databaseService.getDatabase();
    const query = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
    const results = await db.executeSql(query, [userId]);
    
    return results[0].rowsAffected;
  }

  /**
   * Count records for a user
   */
  public async countByUserId(userId: string): Promise<number> {
    const db = databaseService.getDatabase();
    const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = ?`;
    const results = await db.executeSql(query, [userId]);
    
    return results[0].rows.item(0).count;
  }

  /**
   * Find records with custom WHERE clause
   */
  public async findWhere(whereClause: string, params: any[] = []): Promise<T[]> {
    const db = databaseService.getDatabase();
    const query = `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY created_at DESC`;
    const results = await db.executeSql(query, params);
    
    const items: T[] = [];
    const rows = results[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    
    return items;
  }

  /**
   * Find one record with custom WHERE clause
   */
  public async findOneWhere(whereClause: string, params: any[] = []): Promise<T | null> {
    const items = await this.findWhere(whereClause, params);
    return items.length > 0 ? items[0] : null;
  }

  /**
   * Execute a custom query
   */
  public async executeQuery(query: string, params: any[] = []): Promise<any> {
    const db = databaseService.getDatabase();
    return await db.executeSql(query, params);
  }
}