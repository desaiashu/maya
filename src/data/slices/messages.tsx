import { StateCreator } from 'zustand';
import { Message } from '@/data/types';

export interface MessagesState {
  messages: Message[];
  drafts: Record<string, string>;
  addMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => void;
  selectMessagesByChatId: (chatId: string) => Message[];
  updateDraft: (chatid: string, draft: string) => void;
}

export const useMessagesState: StateCreator<MessagesState> = (set, get) => ({
  messages: [],
  drafts: {},
  //Add locally sent message to state
  addMessage: (message: Message) =>
    set(state => ({
      messages: [...state.messages, message],
    })),
  //Add messages from server to state
  updateMessages: (messages: Message[]) =>
    set(state => ({
      messages: messages.reduce((acc: Message[], message: Message) => {
        const index = acc.findIndex(
          m => m.chatid === message.chatid && m.timestamp === message.timestamp,
        );
        index !== -1 ? (acc[index] = message) : acc.push(message);
        return acc;
      }, state.messages),
    })),
  selectMessagesByChatId: (chatId: string) =>
    get().messages.filter(message => message.chatid === chatId),
  updateDraft: (chatid: string, draft: string) =>
    set(state => ({ drafts: { ...state.drafts, [chatid]: draft } })),
});
