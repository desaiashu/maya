import { create } from 'zustand';
import { Chunk, Message } from '@/data/types';
import { timestamp } from '@/data';
import { FIVE_MINS } from '@/data';

export interface StreamState {
  chunks: Message;
  isStreaming: boolean;
  handleChunk: (chunk: Chunk) => void;
  handleMessage: (message: Message) => void;
  resetStream: () => void;
}

export const dummyMessage: Message = {
  chatid: 'stream',
  content: '',
  sender: '',
  timestamp: 0,
};

export const getStream = create<StreamState>((set, get) => ({
  chunks: dummyMessage,
  isStreaming: false,
  handleChunk: (incoming: Chunk) => {
    const stream = get();
    if (stream.isStreaming) {
      if (
        stream.chunks.chatid === incoming.chatid &&
        stream.chunks.timestamp === incoming.timestamp
      ) {
        set(state => ({
          ...state,
          chunks: {
            ...state.chunks,
            content: state.chunks.content + incoming.content,
          },
        }));
      } else {
        //If stream is stale, reset it
        //Handles if user exits app or something
        if (timestamp() - incoming.timestamp > FIVE_MINS) {
          set(state => ({
            ...state,
            chunks: incoming,
            isStreaming: true,
          }));
        }
      }
    } else {
      set(state => ({
        ...state,
        chunks: incoming,
        isStreaming: true,
      }));
    }
  },
  handleMessage: (incoming: Message) => {
    const stream = get();
    //Currently expects to receive all messages,
    //even unrelated to active stream
    if (
      stream.isStreaming &&
      stream.chunks.chatid === incoming.chatid &&
      stream.chunks.timestamp === incoming.timestamp
    ) {
      set(state => ({
        ...state,
        chunks: dummyMessage,
        isStreaming: false,
      }));
    }
  },
  resetStream: () => {
    set(state => ({
      ...state,
      chunks: dummyMessage,
      isStreaming: false,
    }));
  },
}));
