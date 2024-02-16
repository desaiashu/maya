import { StateCreator } from 'zustand';
import { Message } from '@/data/types';

export interface MessagesState {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => void;
  selectMessagesByChatId: (chatId: string) => Message[];
}

export const useMessagesState: StateCreator<MessagesState> = (set, get) => ({
  messages: [],
  addMessage: (message: Message) =>
    set(state => ({ messages: [...state.messages, message] })),
  updateMessages: (messages: Message[]) =>
    set(state => ({
      messages: [
        ...state.messages,
        ...messages.filter(
          message =>
            !state.messages.some(
              existingMessage =>
                existingMessage.timestamp === message.timestamp,
            ),
        ),
      ],
    })),
  selectMessagesByChatId: (chatId: string) => {
    const state = get();
    return state.messages.filter(message => message.chatid === chatId);
  },
});
