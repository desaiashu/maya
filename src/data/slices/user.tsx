import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  userid: string;
  username: string;
  avatar?: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    // Add additional reducers for other user-related actions
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;