import authReducer, {
  loginUser,
  registerUser,
  checkStoredCredentials,
  changePinAsync,
  clearError,
  logoutUser,
  setUser,
} from './authSlice';
import { AuthState } from '../../types';

describe('authSlice', () => {
  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  };

  const mockUser = {
    id: 'user123',
    username: 'testuser',
    pin_hash: 'hashed_pin',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  describe('synchronous actions', () => {
    it('should handle clearError', () => {
      const state: AuthState = {
        ...initialState,
        error: 'Some error',
      };

      const newState = authReducer(state, clearError());
      expect(newState.error).toBe(null);
    });

    it('should handle logoutUser', () => {
      const state: AuthState = {
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      };

      const newState = authReducer(state, logoutUser());
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.user).toBe(null);
      expect(newState.error).toBe(null);
    });

    it('should handle setUser', () => {
      const state = initialState;

      const newState = authReducer(state, setUser(mockUser));
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthenticated).toBe(true);
    });

    it('should handle setUser with null', () => {
      const state: AuthState = {
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      };

      const newState = authReducer(state, setUser(null));
      expect(newState.user).toBe(null);
      expect(newState.isAuthenticated).toBe(false);
    });
  });

  describe('async actions', () => {
    describe('loginUser', () => {
      it('should handle loginUser.pending', () => {
        const action = { type: loginUser.pending.type };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(null);
      });

      it('should handle loginUser.fulfilled', () => {
        const action = { type: loginUser.fulfilled.type, payload: mockUser };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.isAuthenticated).toBe(true);
        expect(newState.user).toEqual(mockUser);
        expect(newState.error).toBe(null);
      });

      it('should handle loginUser.rejected', () => {
        const action = {
          type: loginUser.rejected.type,
          payload: 'Invalid credentials',
        };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.isAuthenticated).toBe(false);
        expect(newState.user).toBe(null);
        expect(newState.error).toBe('Invalid credentials');
      });
    });

    describe('registerUser', () => {
      it('should handle registerUser.fulfilled', () => {
        const action = { type: registerUser.fulfilled.type, payload: mockUser };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.isAuthenticated).toBe(true);
        expect(newState.user).toEqual(mockUser);
      });

      it('should handle registerUser.rejected', () => {
        const action = {
          type: registerUser.rejected.type,
          payload: 'Username already exists',
        };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Username already exists');
        expect(newState.isAuthenticated).toBe(false);
      });
    });

    describe('checkStoredCredentials', () => {
      it('should handle checkStoredCredentials.fulfilled', () => {
        const action = {
          type: checkStoredCredentials.fulfilled.type,
          payload: mockUser,
        };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.isAuthenticated).toBe(true);
        expect(newState.user).toEqual(mockUser);
      });

      it('should handle checkStoredCredentials.rejected', () => {
        const action = { type: checkStoredCredentials.rejected.type };
        const newState = authReducer(initialState, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.isAuthenticated).toBe(false);
        expect(newState.user).toBe(null);
      });
    });

    describe('changePinAsync', () => {
      it('should handle changePinAsync.pending', () => {
        const action = { type: changePinAsync.pending.type };
        const state: AuthState = {
          ...initialState,
          isAuthenticated: true,
          user: mockUser,
        };
        const newState = authReducer(state, action as any);
        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(null);
      });

      it('should handle changePinAsync.fulfilled', () => {
        const updatedUser = { ...mockUser, updated_at: '2023-01-02T00:00:00Z' };
        const action = {
          type: changePinAsync.fulfilled.type,
          payload: updatedUser,
        };
        const state: AuthState = {
          ...initialState,
          isAuthenticated: true,
          user: mockUser,
        };
        const newState = authReducer(state, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(updatedUser);
        expect(newState.error).toBe(null);
      });

      it('should handle changePinAsync.rejected', () => {
        const action = {
          type: changePinAsync.rejected.type,
          payload: 'Current PIN is incorrect',
        };
        const state: AuthState = {
          ...initialState,
          isAuthenticated: true,
          user: mockUser,
        };
        const newState = authReducer(state, action as any);
        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Current PIN is incorrect');
      });
    });
  });
});
