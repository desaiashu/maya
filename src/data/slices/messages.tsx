import { StateCreator } from 'zustand';
import { Message } from '@/data/types';
import { logger } from '@/data';

export interface MessagesState {
  messages: Record<string, Message[]>;
  drafts: Record<string, string>;
  addMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => Record<string, Message[]>;
  selectMessagesByChatId: (chatId: string) => Message[];
  updateDraft: (chatid: string, draft: string) => void;
}

export const useMessagesState: StateCreator<MessagesState> = (set, get) => ({
  messages: {},
  drafts: {},
  //Add locally sent message to state
  addMessage: (message: Message) =>
    set(state => ({
      messages: {
        ...state.messages,
        [message.chatid]: [...(state.messages[message.chatid] || []), message],
      },
    })),
  //Add messages from server to state
  updateMessages: (newMessages: Message[]) => {
    logger.info('started messages update');
    const state = get();
    const updatedMessages = { ...state.messages };

    for (const m of newMessages.reverse()) {
      const existing = updatedMessages[m.chatid] || [];
      if (
        !existing.length ||
        m.timestamp > existing[existing.length - 1].timestamp
      ) {
        updatedMessages[m.chatid] = [...existing, m];
      }
    }

    logger.info('finished messages update');
    return updatedMessages;
  },
  selectMessagesByChatId: (chatId: string) => get().messages[chatId],
  updateDraft: (chatid: string, draft: string) => {
    if (chatid !== 'new') {
      // don't want to populate unrelated future new chats with the draft
      set(state => ({ drafts: { ...state.drafts, [chatid]: draft } }));
    }
  },
});
