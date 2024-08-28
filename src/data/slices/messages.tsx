import { StateCreator } from 'zustand';
import { Message } from '@/data/types';
import { logger, key } from '@/data';

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
  updateMessages: (newMessages: Message[]) => {
    logger.info('starting message update');
    const state = get();
    if (newMessages.length === 0) return state.messages;
    // Create a Map of existing messages, update them
    const existingMessages = new Map(
      state.messages.map((m: Message) => [key(m), m]),
    );
    for (const m of newMessages) {
      existingMessages.set(key(m), m);
    }
    logger.info('finished message update');
    return Array.from(existingMessages.values());
  },
  selectMessagesByChatId: (chatId: string) =>
    get().messages.filter((message: Message) => message.chatid === chatId),
  updateDraft: (chatid: string, draft: string) => {
    if (chatid !== 'new') {
      // don't want to populate unrelated future new chats with the draft
      set(state => ({ drafts: { ...state.drafts, [chatid]: draft } }));
    }
  },
});
