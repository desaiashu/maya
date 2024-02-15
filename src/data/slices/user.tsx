import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/data/types';

interface UserState {
  currentUser: User;
  isAuthenticated: boolean;
  token: string;
}

const emptyUser: User = {
  userid: '',
  username: '',
  avatar: '',
  contacts: [],
  bot: false,
};

const initialState: UserState = {
  currentUser: emptyUser,
  isAuthenticated: false,
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    authenticate(state) {
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setUserProfile(
      state,
      action: PayloadAction<{
        userid: string;
        username: string;
        avatar: string;
      }>,
    ) {
      state.currentUser.userid = action.payload.userid;
      state.currentUser.username = action.payload.username;
      state.currentUser.avatar = action.payload.avatar;
    },
    clearUser(state) {
      state.currentUser = emptyUser;
      state.isAuthenticated = false;
    },
    updateContacts(state, action: PayloadAction<string[]>) {
      action.payload.forEach(contact => {
        state.currentUser.contacts.push(contact);
      });
    },
    // Add additional reducers for other user-related actions
  },
});

export const {
  updateToken,
  authenticate,
  setUser,
  setUserProfile,
  clearUser,
  updateContacts,
} = userSlice.actions;

export default userSlice.reducer;
