import streaksReducer, {
  setStreaksLoading,
  setStreaksError,
  clearStreaksError,
  setStreak,
  incrementStreak,
  resetStreak,
  setCurrentStreak,
  updateLastCompletedDate,
  setLongestStreak,
  checkAndResetStreak,
  clearStreak,
  updateStreak,
} from './streaksSlice';
import { StreaksState, Streak } from '../../types';

describe('streaksSlice', () => {
  const initialState: StreaksState = {
    streak: null,
    loading: false,
    error: null,
  };

  const mockStreak: Streak = {
    id: 'streak1',
    user_id: 'user123',
    current_streak: 5,
    longest_streak: 10,
    last_completed_date: '2025-10-26T00:00:00Z',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-26T00:00:00Z',
  };

  describe('synchronous actions', () => {
    it('should handle setStreaksLoading to true', () => {
      const newState = streaksReducer(initialState, setStreaksLoading(true));
      expect(newState.loading).toBe(true);
    });

    it('should handle setStreaksLoading to false', () => {
      const state: StreaksState = { ...initialState, loading: true };
      const newState = streaksReducer(state, setStreaksLoading(false));
      expect(newState.loading).toBe(false);
    });

    it('should handle setStreak', () => {
      const newState = streaksReducer(initialState, setStreak(mockStreak));
      expect(newState.streak).toEqual(mockStreak);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle setStreak with null', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, setStreak(null));
      expect(newState.streak).toBe(null);
    });

    it('should handle setStreaksError', () => {
      const errorMsg = 'Failed to load streak';
      const newState = streaksReducer(initialState, setStreaksError(errorMsg));
      expect(newState.error).toBe(errorMsg);
    });

    it('should handle clearStreaksError', () => {
      const state: StreaksState = { ...initialState, error: 'Some error' };
      const newState = streaksReducer(state, clearStreaksError());
      expect(newState.error).toBe(null);
    });

    it('should handle incrementStreak', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, incrementStreak());
      expect(newState.streak?.current_streak).toBe(6);
      expect(newState.streak?.longest_streak).toBe(10);
      expect(newState.streak?.last_completed_date).toBeTruthy();
      expect(newState.streak?.updated_at).toBeTruthy();
    });

    it('should update longest streak when current exceeds it', () => {
      const state: StreaksState = {
        ...initialState,
        streak: { ...mockStreak, current_streak: 10, longest_streak: 10 },
      };
      const newState = streaksReducer(state, incrementStreak());
      expect(newState.streak?.current_streak).toBe(11);
      expect(newState.streak?.longest_streak).toBe(11);
    });

    it('should handle incrementStreak with null streak', () => {
      const newState = streaksReducer(initialState, incrementStreak());
      expect(newState.streak).toBe(null);
    });

    it('should handle resetStreak', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, resetStreak());
      expect(newState.streak?.current_streak).toBe(0);
      expect(newState.streak?.longest_streak).toBe(10);
      expect(newState.streak?.updated_at).toBeTruthy();
    });

    it('should handle resetStreak with null streak', () => {
      const newState = streaksReducer(initialState, resetStreak());
      expect(newState.streak).toBe(null);
    });

    it('should handle setCurrentStreak', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, setCurrentStreak(20));
      expect(newState.streak?.current_streak).toBe(20);
      expect(newState.streak?.longest_streak).toBe(20);
      expect(newState.streak?.updated_at).toBeTruthy();
    });

    it('should handle setCurrentStreak without updating longest if smaller', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, setCurrentStreak(8));
      expect(newState.streak?.current_streak).toBe(8);
      expect(newState.streak?.longest_streak).toBe(10);
    });

    it('should handle updateLastCompletedDate', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, updateLastCompletedDate());
      expect(newState.streak?.last_completed_date).toBeTruthy();
      expect(newState.streak?.updated_at).toBeTruthy();
    });

    it('should handle setLongestStreak', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak };
      const newState = streaksReducer(state, setLongestStreak(15));
      expect(newState.streak?.longest_streak).toBe(15);
      expect(newState.streak?.updated_at).toBeTruthy();
    });

    it('should handle clearStreak', () => {
      const state: StreaksState = { ...initialState, streak: mockStreak, loading: true };
      const newState = streaksReducer(state, clearStreak());
      expect(newState.streak).toBe(null);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle updateStreak with complete object', () => {
      const updatedStreak: Streak = {
        ...mockStreak,
        current_streak: 25,
        longest_streak: 30,
      };
      const newState = streaksReducer(initialState, updateStreak(updatedStreak));
      expect(newState.streak).toEqual(updatedStreak);
    });

    it('should handle checkAndResetStreak when last_completed_date is today', () => {
      const today = new Date();
      const state: StreaksState = {
        ...initialState,
        streak: { ...mockStreak, last_completed_date: today.toISOString() },
      };
      const newState = streaksReducer(state, checkAndResetStreak());
      expect(newState.streak?.current_streak).toBe(5);
    });

    it('should reset streak when last_completed_date is more than 1 day ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const state: StreaksState = {
        ...initialState,
        streak: { ...mockStreak, last_completed_date: twoDaysAgo.toISOString() },
      };
      const newState = streaksReducer(state, checkAndResetStreak());
      expect(newState.streak?.current_streak).toBe(0);
    });

    it('should handle checkAndResetStreak with null streak', () => {
      const newState = streaksReducer(initialState, checkAndResetStreak());
      expect(newState.streak).toBe(null);
    });
  });

  describe('reducer edge cases', () => {
    it('should not mutate original state', () => {
      const originalState = { ...initialState };
      streaksReducer(initialState, setStreak(mockStreak));
      expect(initialState).toEqual(originalState);
    });

    it('should preserve error when updating streak', () => {
      const state: StreaksState = { ...initialState, error: 'Some error' };
      const newState = streaksReducer(state, setStreak(mockStreak));
      expect(newState.error).toBe(null);
    });

    it('should preserve loading state when incrementing streak', () => {
      const state: StreaksState = {
        ...initialState,
        streak: mockStreak,
        loading: true,
      };
      const newState = streaksReducer(state, incrementStreak());
      expect(newState.loading).toBe(true);
    });
  });

  describe('streak state transitions', () => {
    it('should properly transition from null to streak', () => {
      const state1 = streaksReducer(initialState, setStreak(mockStreak));
      expect(state1.streak).toEqual(mockStreak);

      const state2 = streaksReducer(state1, clearStreak());
      expect(state2.streak).toBe(null);
    });

    it('should maintain streak data through multiple operations', () => {
      const state1 = streaksReducer(initialState, setStreak(mockStreak));
      const state2 = streaksReducer(state1, incrementStreak());
      const state3 = streaksReducer(state2, incrementStreak());

      expect(state3.streak?.current_streak).toBe(7);
      expect(state3.streak?.longest_streak).toBe(10);
    });

    it('should handle reset and increment sequence', () => {
      const state1 = streaksReducer(initialState, setStreak(mockStreak));
      const state2 = streaksReducer(state1, resetStreak());
      expect(state2.streak?.current_streak).toBe(0);

      const state3 = streaksReducer(state2, incrementStreak());
      expect(state3.streak?.current_streak).toBe(1);
    });

    it('should correctly update longest streak only when necessary', () => {
      let state = streaksReducer(initialState, setStreak(mockStreak));

      for (let i = 0; i < 4; i++) {
        state = streaksReducer(state, incrementStreak());
      }
      expect(state.streak?.current_streak).toBe(9);
      expect(state.streak?.longest_streak).toBe(10);

      state = streaksReducer(state, incrementStreak());
      expect(state.streak?.current_streak).toBe(10);
      expect(state.streak?.longest_streak).toBe(10);

      state = streaksReducer(state, incrementStreak());
      expect(state.streak?.current_streak).toBe(11);
      expect(state.streak?.longest_streak).toBe(11);
    });
  });
});
