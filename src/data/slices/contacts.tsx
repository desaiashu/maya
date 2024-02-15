import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/data';
import { Profile } from '@/data/types';

interface ContactsState {
  humans: Profile[];
  bots: Profile[];
}

// Initial state for the contacts slice
const initialState: ContactsState = {
  humans: [],
  bots: [],
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Reducer to add a single user
    addContact: (state, action: PayloadAction<Profile>) => {
      state.humans.push(action.payload);
    },
    // Reducer to add multiple users
    addContacts: (state, action: PayloadAction<Profile[]>) => {
      state.humans.push(...action.payload);
    },
    // Reducer to remove a user by id
    removeContact: (state, action: PayloadAction<string>) => {
      state.humans = state.humans.filter(
        user => user.userid !== action.payload,
      );
    },
    // Reducer to update a user by id
    updateContact: (state, action: PayloadAction<Profile>) => {
      const index = state.humans.findIndex(
        user => user.userid === action.payload.userid,
      );
      if (index !== -1) {
        state.humans[index] = action.payload;
      }
    },
    updateBots: (state, action: PayloadAction<Profile[]>) => {
      state.bots = action.payload;
    },
  },
});

// Export the action creators
export const { addContact, addContacts, removeContact, updateContact } =
  contactsSlice.actions;

export const userFromId = (state: RootState, userid: string) =>
  state.contacts.humans.filter(user => user.userid === userid);

// Export the reducer
export default contactsSlice.reducer;
