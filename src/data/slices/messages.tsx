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
    set((state: MessagesState) => {
      if (messages.length === 0) return state;

      const messageMap: { [key: string]: Message } = {};
      // Create a map of new messages
      for (const message of messages) {
        messageMap[`${message.chatid}-${message.timestamp}`] = message;
      }
      // Update existing messages and mark new ones
      const updatedMessages = state.messages.map((m: Message) => {
        const key = `${m.chatid}-${m.timestamp}`;
        return messageMap[key] || m;
      });
      // Add new messages that didn't exist before
      for (const message of messages) {
        if (
          !state.messages.some(
            m =>
              m.chatid === message.chatid && m.timestamp === message.timestamp,
          )
        ) {
          updatedMessages.push(message);
        }
      }
      return { messages: updatedMessages };
    }),
  selectMessagesByChatId: (chatId: string) =>
    get().messages.filter(message => message.chatid === chatId),
  updateDraft: (chatid: string, draft: string) => {
    if (chatid !== 'new') {
      // don't want to populate unrelated future new chats with the draft
      set(state => ({ drafts: { ...state.drafts, [chatid]: draft } }));
    }
  },
});
