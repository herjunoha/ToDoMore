import { BaseDAO } from './BaseDAO';
import { Task } from '../../types';
import { databaseService } from './DatabaseService';
import { DatabaseUtils } from './DatabaseUtils';

export class TaskDAO extends BaseDAO<Task> {
  constructor() {
    super('tasks');
  }

  /**
   * Find tasks by status
   */
  public async findByStatus(userId: string, status: string): Promise<Task[]> {
    return await this.findWhere('user_id = ? AND status = ?', [userId, status]);
  }

  /**
   * Find tasks by priority
   */
  public async findByPriority(userId: string, priority: string): Promise<Task[]> {
    return await this.findWhere('user_id = ? AND priority = ?', [userId, priority]);
  }

  /**
   * Find tasks by goal ID
   */
  public async findByGoalId(goalId: string): Promise<Task[]> {
    return await this.findWhere('goal_id = ?', [goalId]);
  }

  /**
   * Find sub-tasks for a parent task
   */
  public async findSubTasks(parentTaskId: string): Promise<Task[]> {
    return await this.findWhere('parent_task_id = ?', [parentTaskId]);
  }

  /**
   * Find tasks by date range
   */
  public async findByDateRange(userId: string, startDate: string, endDate: string): Promise<Task[]> {
    const db = this.getDatabase();
    const query = `SELECT * FROM tasks 
      WHERE user_id = ? 
      AND due_date >= ? 
      AND due_date <= ? 
      ORDER BY due_date ASC`;
    const results = await db.executeSql(query, [userId, startDate, endDate]);
    
    const tasks: Task[] = [];
    const rows = results[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
      tasks.push(rows.item(i));
    }
    
    return tasks;
  }

  /**
   * Find overdue tasks
   */
  public async findOverdue(userId: string, currentDate: string): Promise<Task[]> {
    return await this.findWhere(
      'user_id = ? AND due_date < ? AND status != ?', 
      [userId, currentDate, 'completed']
    );
  }

  /**
   * Update task status
   */
  public async updateStatus(taskId: string, status: string): Promise<boolean> {
    const db = this.getDatabase();
    const query = 'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?';
    const timestamp = DatabaseUtils.getCurrentTimestamp();
    
    const results = await db.executeSql(query, [status, timestamp, taskId]);
    
    return results[0].rowsAffected > 0;
  }

  /**
   * Get tasks with goal information
   */
  public async getTasksWithGoals(userId: string): Promise<any[]> {
    const db = this.getDatabase();
    const query = `
      SELECT t.*, g.title as goal_title, g.status as goal_status
      FROM tasks t
      LEFT JOIN goals g ON t.goal_id = g.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `;
    
    const results = await db.executeSql(query, [userId]);
    
    const tasks: any[] = [];
    const rows = results[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
      tasks.push(rows.item(i));
    }
    
    return tasks;
  }

  /**
   * Get database instance
   */
  private getDatabase() {
    return databaseService.getDatabase();
  }
}

export const taskDAO = new TaskDAO();