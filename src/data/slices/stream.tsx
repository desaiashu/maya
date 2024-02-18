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
    const s = get();
    if (!s.isStreaming || isCurrentStream(s, incoming) || isStale(s)) {
      set(state => ({
        ...state,
        chunks: {
          ...incoming,
          content: s.chunks.content + incoming.content,
        },
        isStreaming: true,
      }));
    }
  },

  //Currently expects to receive all messages,
  //even unrelated to active stream
  handleMessage: (incoming: Message) => {
    const s = get();
    if (isCurrentStream(s, incoming)) {
      s.resetStream();
    }
  },

  resetStream: () =>
    set(state => ({
      ...state,
      chunks: dummyMessage,
      isStreaming: false,
    })),
}));

const isCurrentStream = (s: StreamState, message: Message) =>
  s.isStreaming &&
  s.chunks.chatid === message.chatid &&
  s.chunks.timestamp === message.timestamp;

const isStale = (s: StreamState) =>
  timestamp() - s.chunks.timestamp > FIVE_MINS;
