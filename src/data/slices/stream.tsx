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
  streams: Record<string, Message>;
  isStreaming: Record<string, boolean>;
  stopTimes: Record<string, number>;
  handleChunk: (chunk: Chunk) => void;
  handleMessage: (message: Message) => void;
  stopStream: (streamid?: string) => void;
  resetStream: (streamid?: string) => void;
}

export const dummyMessage = (streamid: string): Message => {
  return {
    chatid: 'stream_' + streamid,
    content: '',
    sender: '',
    timestamp: 0,
  };
};

export const useStream = create<StreamState>((set, get) => ({
  streams: {},
  isStreaming: {},
  stopTimes: {},

  handleChunk: (incoming: Chunk) => {
    const s = get();
    const streamid = incoming.chatid;
    if (
      !s.isStreaming[streamid] ||
      isCurrentStream(s, incoming) ||
      isStale(s, streamid)
    ) {
      if ((s.stopTimes[streamid] || 0) < incoming.timestamp) {
        set(state => ({
          ...state,
          streams: {
            ...state.streams,
            [streamid]: {
              ...incoming,
              content:
                (state.streams[streamid]?.content || '') + incoming.content,
            },
          },
          isStreaming: {
            ...state.isStreaming,
            [streamid]: true,
          },
        }));
      }
    }
  },

  //Currently expects to receive all messages,
  //even unrelated to active stream
  handleMessage: (incoming: Message) => {
    const s = get();
    const streamid = incoming.chatid;
    if (isCurrentStream(s, incoming)) {
      cancelAnimation();
      s.resetStream(streamid);
    }
  },

  stopStream: (streamid: string = '') => {
    if (streamid === '') return;
    const chunks = get().streams[streamid];
    server.stopStream(chunks);
    set(state => ({
      ...state,
      stopTimes: {
        ...state.stopTimes,
        [streamid]: timestamp(),
      },
    }));
    cancelAnimation();
    get().resetStream(streamid);
    const zstate = useStore.getState();
    zstate.addMessage(chunks);
  },

  resetStream: (streamid: string = '') => {
    if (streamid === '') return;
    set(state => ({
      ...state,
      streams: {
        ...state.streams,
        [streamid]: dummyMessage(streamid),
      },
      isStreaming: {
        ...state.isStreaming,
        [streamid]: false,
      },
    }));
  },
}));

const isCurrentStream = (s: StreamState, message: Message) =>
  s.isStreaming[message.chatid] &&
  s.streams[message.chatid]?.chatid === message.chatid &&
  s.streams[message.chatid]?.timestamp === message.timestamp;

const isStale = (s: StreamState, streamid: string) =>
  timestamp() - (s.streams[streamid]?.timestamp || 0) > FIVE_MINS;
