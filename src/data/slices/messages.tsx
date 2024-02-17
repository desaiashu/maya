import { StateCreator } from 'zustand';
import { Message, Chunk } from '@/data/types';
import { messageFromChunk } from '@/data';

export interface MessagesState {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => void;
  selectMessagesByChatId: (chatId: string) => Message[];
  updateChunk: (chunk: Chunk) => void;
}

export const useMessagesState: StateCreator<MessagesState> = (set, get) => ({
  messages: [],
  //Add locally sent message to state
  addMessage: (message: Message) =>
    set(state => ({ messages: [...state.messages, message] })),
  //Add messages from server to state
  updateMessages: (messages: Message[]) =>
    set(state => ({
      messages: state.messages
        .map(existingMessage => {
          const updatedMessage = messages.find(
            message =>
              existingMessage.chatid === message.chatid &&
              existingMessage.timestamp === message.timestamp,
          );
          return updatedMessage || existingMessage;
        })
        .concat(
          messages.filter(
            message =>
              !state.messages.some(
                existingMessage =>
                  existingMessage.chatid === message.chatid &&
                  existingMessage.timestamp === message.timestamp,
              ),
          ),
        ),
    })),
  updateChunk: (chunk: Chunk) =>
    set(state => ({
      messages: state.messages
        .map(message => {
          if (
            message.chatid === chunk.chatid &&
            message.timestamp === chunk.timestamp
          ) {
            return {
              ...message,
              content: message.content + chunk.content,
            };
          }
          return message;
        })
        .concat(
          state.messages.some(
            message =>
              message.chatid === chunk.chatid &&
              message.timestamp === chunk.timestamp,
          )
            ? []
            : [messageFromChunk(chunk)],
        ),
    })),
  selectMessagesByChatId: (chatId: string) => {
    const state = get();
    return state.messages.filter(message => message.chatid === chatId);
  },
});
