import tasksReducer, {
  setTasksLoading,
  addTask,
  deleteTask,
  setTasks,
  setTasksError,
  clearTasksError,
  clearTasks,
  deleteTasksByGoal,
} from './tasksSlice';
import { TasksState, Task, TaskStatus, Priority } from '../../types';

describe('tasksSlice', () => {
  const initialState: TasksState = {
    items: [],
    loading: false,
    error: null,
  };

  const mockTask: Task = {
    id: 'task1',
    user_id: 'user123',
    title: 'Test Task',
    description: 'Test Description',
    due_date: '2025-12-31',
    priority: Priority.HIGH,
    status: TaskStatus.PENDING,
    parent_task_id: undefined,
    goal_id: undefined,
    created_at: '2025-10-26T00:00:00Z',
    updated_at: '2025-10-26T00:00:00Z',
  };

  const mockTask2: Task = {
    ...mockTask,
    id: 'task2',
    title: 'Another Task',
    status: TaskStatus.IN_PROGRESS,
  };

  describe('synchronous actions', () => {
    it('should handle setTasksLoading to true', () => {
      const newState = tasksReducer(initialState, setTasksLoading(true));
      expect(newState.loading).toBe(true);
    });

    it('should handle setTasksLoading to false', () => {
      const state: TasksState = { ...initialState, loading: true };
      const newState = tasksReducer(state, setTasksLoading(false));
      expect(newState.loading).toBe(false);
    });

    it('should handle addTask', () => {
      const newState = tasksReducer(initialState, addTask(mockTask));
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockTask);
    });

    it('should handle addTask to existing tasks', () => {
      const state: TasksState = { ...initialState, items: [mockTask] };
      const newState = tasksReducer(state, addTask(mockTask2));
      expect(newState.items).toHaveLength(2);
      expect(newState.items[1]).toEqual(mockTask2);
    });



    it('should handle deleteTask', () => {
      const state: TasksState = { ...initialState, items: [mockTask, mockTask2] };
      const newState = tasksReducer(state, deleteTask('task1'));
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockTask2);
    });

    it('should handle deleteTask with non-existent task', () => {
      const state: TasksState = { ...initialState, items: [mockTask] };
      const newState = tasksReducer(state, deleteTask('nonexistent'));
      expect(newState.items).toHaveLength(1);
    });

    it('should handle setTasks', () => {
      const newState = tasksReducer(initialState, setTasks([mockTask, mockTask2]));
      expect(newState.items).toHaveLength(2);
      expect(newState.items).toEqual([mockTask, mockTask2]);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle setTasksError', () => {
      const errorMsg = 'Failed to load tasks';
      const newState = tasksReducer(initialState, setTasksError(errorMsg));
      expect(newState.error).toBe(errorMsg);
    });

    it('should handle clearTasksError', () => {
      const state: TasksState = { ...initialState, error: 'Some error' };
      const newState = tasksReducer(state, clearTasksError());
      expect(newState.error).toBe(null);
    });



    it('should handle clearTasks', () => {
      const state: TasksState = { ...initialState, items: [mockTask, mockTask2], loading: true };
      const newState = tasksReducer(state, clearTasks());
      expect(newState.items).toHaveLength(0);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle deleteTasksByGoal', () => {
      const taskWithGoal = { ...mockTask, goal_id: 'goal1' };
      const taskWithDifferentGoal = { ...mockTask2, goal_id: 'goal2' };
      const state: TasksState = {
        ...initialState,
        items: [taskWithGoal, taskWithDifferentGoal],
      };
      const newState = tasksReducer(state, deleteTasksByGoal('goal1'));
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].goal_id).toBe('goal2');
    });
  });

  describe('reducer edge cases', () => {
    it('should not mutate original state', () => {
      const originalState = { ...initialState };
      tasksReducer(initialState, addTask(mockTask));
      expect(initialState).toEqual(originalState);
    });

    it('should handle empty tasks array', () => {
      const newState = tasksReducer(initialState, setTasks([]));
      expect(newState.items).toHaveLength(0);
    });

    it('should preserve error when adding task', () => {
      const state: TasksState = { ...initialState, error: 'Some error' };
      const newState = tasksReducer(state, addTask(mockTask));
      expect(newState.error).toBe('Some error');
    });

    it('should preserve loading state when deleting task', () => {
      const state: TasksState = { ...initialState, items: [mockTask], loading: true };
      const newState = tasksReducer(state, deleteTask('task1'));
      expect(newState.loading).toBe(true);
    });
  });

  describe('task filtering scenarios', () => {
    it('should maintain task order when adding', () => {
      const state1 = tasksReducer(initialState, addTask(mockTask));
      const state2 = tasksReducer(state1, addTask(mockTask2));
      expect(state2.items[0].id).toBe('task1');
      expect(state2.items[1].id).toBe('task2');
    });



    it('should handle multiple deletes in sequence', () => {
      const state1 = tasksReducer(initialState, setTasks([mockTask, mockTask2]));
      const state2 = tasksReducer(state1, deleteTask('task1'));
      const state3 = tasksReducer(state2, deleteTask('task2'));
      expect(state3.items).toHaveLength(0);
    });
  });
});
