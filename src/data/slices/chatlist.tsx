import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Chat {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: number;
}

interface ChatState {
  chats: Chat[];
}

const initialState: ChatState = {
  chats: [],
};

const chatlistSlice = createSlice({
  name: 'chatlist',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
  },
});

export const { setChats } = chatlistSlice.actions;

export default chatlistSlice.reducer;