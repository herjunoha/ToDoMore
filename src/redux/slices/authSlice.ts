import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { authService } from '../../services/auth';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

/**
 * Initial state for authentication
 */
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

/**
 * Async thunk for user login
 */
export const loginUser = createAsyncThunk<User, { username: string; pin: string }>(
  'auth/login',
  async (
    { username, pin }: { username: string; pin: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await authService.login(username, pin);
      if (!result.success) {
        return rejectWithValue(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
      return result.user!;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
);

/**
 * Async thunk for user registration
 */
export const registerUser = createAsyncThunk<User, { username: string; pin: string }>(
  'auth/register',
  async (
    { username, pin }: { username: string; pin: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await authService.register(username, pin);
      if (!result.success) {
        return rejectWithValue(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
      return result.user!;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
);

/**
 * Async thunk for checking stored credentials on app startup
 */
export const checkStoredCredentials = createAsyncThunk<User, void>(
  'auth/checkStored',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.checkStoredCredentials();
      if (result.isAuthenticated && result.user) {
        return result.user;
      }
      return rejectWithValue('No stored credentials');
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
);

/**
 * Async thunk for changing PIN
 */
export const changePinAsync = createAsyncThunk<User, { oldPin: string; newPin: string }>(
  'auth/changePin',
  async (
    { oldPin, newPin }: { oldPin: string; newPin: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;
      if (!currentUser) {
        return rejectWithValue('No user is currently authenticated');
      }

      const result = await authService.changePin(oldPin, newPin);
      if (!result.success) {
        return rejectWithValue(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }

      // Return updated user with new PIN hash from current state
      // since the PIN hash has been updated by authService
      return currentUser;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
);

/**
 * Authentication Redux Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Logout user synchronously
     */
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },

    /**
     * Set user manually (useful for testing or special scenarios)
     */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    /**
     * Clear loading state
     */
    clearLoading: (state) => {
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    // Login thunk
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // Register thunk
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // Check stored credentials thunk
    builder
      .addCase(checkStoredCredentials.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkStoredCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkStoredCredentials.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Change PIN thunk
    builder
      .addCase(changePinAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePinAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
        }
        state.error = null;
      })
      .addCase(changePinAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, logoutUser, setUser, clearLoading } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
