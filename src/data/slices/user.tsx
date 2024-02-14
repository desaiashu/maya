import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/data/types'
import { RootState } from '@/data';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string;
}

const initialState: UserState = {
  currentUser: {
    userid: '+16504305130',
    username: 'ashu',
    avatar: 'local://user.png'
  },
  isAuthenticated: false,
  token: '',
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

export const getLocalUser = (state: RootState) => {
  let user = state.user.currentUser;
  if (user === null) {
    user = { userid: 'error', username: 'error', avatar: ''}
  }
  return user;
}

export default userSlice.reducer;