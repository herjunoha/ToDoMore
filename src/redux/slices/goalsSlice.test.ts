import goalsReducer, {
  setGoalsLoading,
  addGoal,
  updateGoal,
  deleteGoal,
  setGoals,
  setGoalsError,
  clearGoalsError,
  updateGoalStatus,
  updateGoalProgress,
  updateGoalSmartFields,
  clearGoals,
  deleteSubGoals,
} from './goalsSlice';
import { GoalsState, Goal, GoalStatus } from '../../types';

describe('goalsSlice', () => {
  const initialState: GoalsState = {
    items: [],
    loading: false,
    error: null,
  };

  const mockGoal: Goal = {
    id: 'goal1',
    user_id: 'user123',
    specific: 'Learn TypeScript fundamentals',
    measurable: 'Complete 5 TypeScript tutorials',
    achievable: 'Yes, I have 2 hours per week available',
    relevant: 'Important for my development career',
    time_bound: '2025-12-31',
    title: 'Master TypeScript',
    description: 'Complete goal description',
    status: GoalStatus.IN_PROGRESS,
    progress: 60,
    parent_goal_id: undefined,
    created_at: '2025-10-26T00:00:00Z',
    updated_at: '2025-10-26T00:00:00Z',
  };

  const mockGoal2: Goal = {
    ...mockGoal,
    id: 'goal2',
    title: 'Learn React',
    status: GoalStatus.NOT_STARTED,
    progress: 0,
  };

  describe('synchronous actions', () => {
    it('should handle setGoalsLoading to true', () => {
      const newState = goalsReducer(initialState, setGoalsLoading(true));
      expect(newState.loading).toBe(true);
    });

    it('should handle setGoalsLoading to false', () => {
      const state: GoalsState = { ...initialState, loading: true };
      const newState = goalsReducer(state, setGoalsLoading(false));
      expect(newState.loading).toBe(false);
    });

    it('should handle addGoal', () => {
      const newState = goalsReducer(initialState, addGoal(mockGoal));
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockGoal);
    });

    it('should handle addGoal to existing goals', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(state, addGoal(mockGoal2));
      expect(newState.items).toHaveLength(2);
      expect(newState.items[1]).toEqual(mockGoal2);
    });

    it('should handle updateGoal', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const updatedGoal = { ...mockGoal, status: GoalStatus.ACHIEVED };
      const newState = goalsReducer(state, updateGoal(updatedGoal));
      expect(newState.items[0]).toEqual(updatedGoal);
      expect(newState.items[0].status).toBe(GoalStatus.ACHIEVED);
    });

    it('should handle updateGoal with non-existent goal', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newGoal: Goal = { ...mockGoal, id: 'nonexistent' };
      const newState = goalsReducer(state, updateGoal(newGoal));
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockGoal);
    });

    it('should handle deleteGoal', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal, mockGoal2] };
      const newState = goalsReducer(state, deleteGoal('goal1'));
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockGoal2);
    });

    it('should handle deleteGoal with non-existent goal', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(state, deleteGoal('nonexistent'));
      expect(newState.items).toHaveLength(1);
    });

    it('should handle setGoals', () => {
      const newState = goalsReducer(initialState, setGoals([mockGoal, mockGoal2]));
      expect(newState.items).toHaveLength(2);
      expect(newState.items).toEqual([mockGoal, mockGoal2]);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle setGoalsError', () => {
      const errorMsg = 'Failed to load goals';
      const newState = goalsReducer(initialState, setGoalsError(errorMsg));
      expect(newState.error).toBe(errorMsg);
    });

    it('should handle clearGoalsError', () => {
      const state: GoalsState = { ...initialState, error: 'Some error' };
      const newState = goalsReducer(state, clearGoalsError());
      expect(newState.error).toBe(null);
    });

    it('should handle updateGoalStatus', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalStatus({ goalId: 'goal1', status: GoalStatus.ACHIEVED })
      );
      expect(newState.items[0].status).toBe(GoalStatus.ACHIEVED);
      expect(newState.items[0].updated_at).toBeTruthy();
    });

    it('should handle updateGoalStatus for non-existent goal', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalStatus({ goalId: 'nonexistent', status: GoalStatus.ACHIEVED })
      );
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].status).toBe(GoalStatus.IN_PROGRESS);
    });

    it('should handle updateGoalProgress', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalProgress({ goalId: 'goal1', progress: 100 })
      );
      expect(newState.items[0].progress).toBe(100);
      expect(newState.items[0].updated_at).toBeTruthy();
    });

    it('should clamp progress to 100', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalProgress({ goalId: 'goal1', progress: 150 })
      );
      expect(newState.items[0].progress).toBe(100);
    });

    it('should clamp progress to 0', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalProgress({ goalId: 'goal1', progress: -10 })
      );
      expect(newState.items[0].progress).toBe(0);
    });

    it('should handle updateGoalSmartFields', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalSmartFields({
          goalId: 'goal1',
          specific: 'New specific goal',
          measurable: 'New measurable',
        })
      );
      expect(newState.items[0].specific).toBe('New specific goal');
      expect(newState.items[0].measurable).toBe('New measurable');
      expect(newState.items[0].achievable).toBe(mockGoal.achievable);
      expect(newState.items[0].updated_at).toBeTruthy();
    });

    it('should handle clearGoals', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal, mockGoal2], loading: true };
      const newState = goalsReducer(state, clearGoals());
      expect(newState.items).toHaveLength(0);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle deleteSubGoals', () => {
      const parentGoal = mockGoal;
      const subGoal1 = { ...mockGoal2, id: 'subgoal1', parent_goal_id: 'goal1' };
      const subGoal2 = { ...mockGoal2, id: 'subgoal2', parent_goal_id: 'goal1' };
      const unrelatedGoal = { ...mockGoal2, id: 'goal3', parent_goal_id: undefined };
      
      const state: GoalsState = {
        ...initialState,
        items: [parentGoal, subGoal1, subGoal2, unrelatedGoal],
      };
      const newState = goalsReducer(state, deleteSubGoals('goal1'));
      expect(newState.items).toHaveLength(2);
      expect(newState.items.some(g => g.id === 'subgoal1')).toBe(false);
      expect(newState.items.some(g => g.id === 'subgoal2')).toBe(false);
      expect(newState.items.some(g => g.id === 'goal1')).toBe(true);
    });
  });

  describe('reducer edge cases', () => {
    it('should not mutate original state', () => {
      const originalState = { ...initialState };
      goalsReducer(initialState, addGoal(mockGoal));
      expect(initialState).toEqual(originalState);
    });

    it('should handle empty goals array', () => {
      const newState = goalsReducer(initialState, setGoals([]));
      expect(newState.items).toHaveLength(0);
    });

    it('should preserve error when adding goal', () => {
      const state: GoalsState = { ...initialState, error: 'Some error' };
      const newState = goalsReducer(state, addGoal(mockGoal));
      expect(newState.error).toBe('Some error');
    });

    it('should preserve loading state when deleting goal', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal], loading: true };
      const newState = goalsReducer(state, deleteGoal('goal1'));
      expect(newState.loading).toBe(true);
    });
  });

  describe('goal filtering scenarios', () => {
    it('should maintain goal order when adding', () => {
      const state1 = goalsReducer(initialState, addGoal(mockGoal));
      const state2 = goalsReducer(state1, addGoal(mockGoal2));
      expect(state2.items[0].id).toBe('goal1');
      expect(state2.items[1].id).toBe('goal2');
    });

    it('should find and update goal by id', () => {
      const goal3 = { ...mockGoal, id: 'goal3', title: 'Third Goal' };
      const state = goalsReducer(
        initialState,
        setGoals([mockGoal, mockGoal2, goal3])
      );
      const updated = { ...mockGoal2, title: 'Updated Title' };
      const newState = goalsReducer(state, updateGoal(updated));
      expect(newState.items[1].title).toBe('Updated Title');
      expect(newState.items[1].id).toBe('goal2');
    });

    it('should handle multiple deletes in sequence', () => {
      const state1 = goalsReducer(initialState, setGoals([mockGoal, mockGoal2]));
      const state2 = goalsReducer(state1, deleteGoal('goal1'));
      const state3 = goalsReducer(state2, deleteGoal('goal2'));
      expect(state3.items).toHaveLength(0);
    });

    it('should handle partial SMART field updates', () => {
      const state: GoalsState = { ...initialState, items: [mockGoal] };
      const newState = goalsReducer(
        state,
        updateGoalSmartFields({
          goalId: 'goal1',
          specific: 'Only update specific',
        })
      );
      expect(newState.items[0].specific).toBe('Only update specific');
      expect(newState.items[0].measurable).toBe(mockGoal.measurable);
      expect(newState.items[0].achievable).toBe(mockGoal.achievable);
      expect(newState.items[0].relevant).toBe(mockGoal.relevant);
      expect(newState.items[0].time_bound).toBe(mockGoal.time_bound);
    });
  });
});
