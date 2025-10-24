import { BaseDAO } from './BaseDAO';
import { Goal } from '../../types';
import { databaseService } from './DatabaseService';
import { DatabaseUtils } from './DatabaseUtils';

export class GoalDAO extends BaseDAO<Goal> {
  constructor() {
    super('goals');
  }

  /**
   * Find goals by status
   */
  public async findByStatus(userId: string, status: string): Promise<Goal[]> {
    return await this.findWhere('user_id = ? AND status = ?', [userId, status]);
  }

  /**
   * Find sub-goals for a parent goal
   */
  public async findSubGoals(parentGoalId: string): Promise<Goal[]> {
    return await this.findWhere('parent_goal_id = ?', [parentGoalId]);
  }

  /**
   * Find goals by date range
   */
  public async findByDateRange(userId: string, startDate: string, endDate: string): Promise<Goal[]> {
    const db = this.getDatabase();
    const query = `SELECT * FROM goals 
      WHERE user_id = ? 
      AND time_bound >= ? 
      AND time_bound <= ? 
      ORDER BY time_bound ASC`;
    const results = await db.executeSql(query, [userId, startDate, endDate]);
    
    const goals: Goal[] = [];
    const rows = results[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
      goals.push(rows.item(i));
    }
    
    return goals;
  }

  /**
   * Update goal progress
   */
  public async updateProgress(goalId: string, progress: number): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE goals SET progress = ?, updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [progress, timestamp, goalId]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Update goal status
   */
  public async updateStatus(goalId: string, status: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE goals SET status = ?, updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [status, timestamp, goalId]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Get goals with task completion statistics
   */
  public async getGoalsWithTaskStats(userId: string): Promise<any[]> {
    const db = this.getDatabase();
    const query = `
      SELECT g.*, 
             COUNT(t.id) as total_tasks,
             SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
             CAST(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) * 100 / 
               CASE WHEN COUNT(t.id) > 0 THEN COUNT(t.id) ELSE 1 END as completion_percentage
      FROM goals g
      LEFT JOIN tasks t ON g.id = t.goal_id
      WHERE g.user_id = ?
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `;
    
    const results = await db.executeSql(query, [userId]);
    
    const goals: any[] = [];
    const rows = results[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
      goals.push(rows.item(i));
    }
    
    return goals;
  }

  /**
   * Get database instance
   */
  private getDatabase() {
    return databaseService.getDatabase();
  }
}

export const goalDAO = new GoalDAO();