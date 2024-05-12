import { create } from 'zustand';
import { Chunk, Message } from '@/data/types';
import {
  timestamp,
  FIVE_MINS,
  cancelAnimation,
  server,
  useStore,
} from '@/data';

export interface StreamState {
  chunks: Message;
  isStreaming: boolean;
  stopTime: number;
  handleChunk: (chunk: Chunk) => void;
  handleMessage: (message: Message) => void;
  stopStream: () => void;
  resetStream: () => void;
}

export const dummyMessage: Message = {
  chatid: 'stream',
  content: '',
  sender: '',
  timestamp: 0,
};

export const useStream = create<StreamState>((set, get) => ({
  chunks: dummyMessage,
  isStreaming: false,
  stopTime: 0,

  handleChunk: (incoming: Chunk) => {
    const s = get();
    if (!s.isStreaming || isCurrentStream(s, incoming) || isStale(s)) {
      if (s.stopTime < incoming.timestamp) {
        set(state => ({
          ...state,
          chunks: {
            ...incoming,
            content: s.chunks.content + incoming.content,
          },
          isStreaming: true,
        }));
      }
    }
  },

  //Currently expects to receive all messages,
  //even unrelated to active stream
  handleMessage: (incoming: Message) => {
    const s = get();
    if (isCurrentStream(get(), incoming)) {
      cancelAnimation();
      s.resetStream();
    }
  },

  stopStream: () => {
    const chunks = get().chunks;
    server.stopStream(chunks);
    set(state => ({ ...state, stopTime: timestamp() }));
    cancelAnimation();
    get().resetStream();
    const zstate = useStore.getState();
    zstate.updateMessages([chunks]);
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
