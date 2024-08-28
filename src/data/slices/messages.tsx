import { StateCreator } from 'zustand';
import { Message } from '@/data/types';
import { key, logger } from '@/data';

export interface MessagesState {
  messages: Message[];
  drafts: Record<string, string>;
  addMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => Message[];
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
  updateMessages: (newMessages: Message[]) => {
    logger.info('started messages update');
    const state = get();
    const existingMessages = new Map(state.messages.map(m => [key(m), m]));
    for (const m of newMessages) {
      existingMessages.set(key(m), m);
    }
    const messages = Array.from(existingMessages.values()).sort(
      (a, b) => a.timestamp - b.timestamp,
    );
    logger.info('finished messages update');
    return messages;
  },
  selectMessagesByChatId: (chatId: string) =>
    get().messages.filter(message => message.chatid === chatId),
  updateDraft: (chatid: string, draft: string) => {
    if (chatid !== 'new') {
      // don't want to populate unrelated future new chats with the draft
      set(state => ({ drafts: { ...state.drafts, [chatid]: draft } }));
    }
  },
});
