import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/data'
import { User } from '@/data/types'

interface ContactsState {
  users: User[];
  bots: User[];
}

// Initial state for the contacts slice
const initialState: ContactsState = {
  users: [],
  bots: [],
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Reducer to add a single user
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    // Reducer to add multiple users
    addUsers: (state, action: PayloadAction<User[]>) => {
      state.users.push(...action.payload);
    },
    // Reducer to remove a user by id
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.userid !== action.payload);
    },
    // Reducer to update a user by id
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.userid === action.payload.userid);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    updateBots: (state, action: PayloadAction<User[]>) => {
      state.bots=action.payload;
    },
  },
});

// Export the action creators
export const { addUser, addUsers, removeUser, updateUser } = contactsSlice.actions;

export const userFromId = (state: RootState, userid: string) =>
  state.contacts.users.filter(user => user.userid === userid);

// Export the reducer
export default contactsSlice.reducer;