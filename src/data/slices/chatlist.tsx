import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatInfo } from '../types'

interface ChatState {
  chats: ChatInfo[];
}

const initialState: ChatState = {
  chats: [],
};

const chatlistSlice = createSlice({
  name: 'chatlist',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<ChatInfo[]>) {
      state.chats = action.payload;
    },
  },
});

export const { setChats } = chatlistSlice.actions;

export default chatlistSlice.reducer;