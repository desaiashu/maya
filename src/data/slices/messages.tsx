import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { Message, MessageRequest, MessageUpdate } from '@/data/types'
import { RootState } from '@/data';


interface MessagesState {
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    updateMessages(state, action: PayloadAction<Message[]>) {
      for (const message of action.payload) {
        const messageExists = state.messages.some(existingMessage => existingMessage.timestamp === message.timestamp);
        if (!messageExists) {
          state.messages.push(message);
        }
      }
    },
  },
});

export const { addMessage, updateMessages } = messagesSlice.actions;

// Selector that gets the messages state
const getMessagesState = (state: RootState) => state.messages;

// Memoized selector that takes state and chatId and returns messages for that chatId
export const selectMessagesByChatId = createSelector(
  [getMessagesState, (_, chatId: string) => chatId],
  (messagesState, chatId) => messagesState.messages.filter(message => message.chatid === chatId)
);

export default messagesSlice.reducer;

