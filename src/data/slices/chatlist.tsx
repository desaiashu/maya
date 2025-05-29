import { ChatInfo, Profile } from '@/data/types';
import { StateCreator } from 'zustand';
import { timestamp, logger } from '@/data';

export interface ChatlistState {
  chats: ChatInfo[];
  protocols: string[];

  lastRefreshRequest: number;
  lastRefresh: number;

  refreshRequested: () => void;
  refreshSucceeded: () => void;

  updateChats: (chats: ChatInfo[]) => ChatInfo[];
  updateChatInfo: (chat: ChatInfo) => ChatInfo[];
  updateProtocols: (protocols: string[]) => void;
  updateUserChats: (updatedProfile: Profile) => void;
  getTopic: (chatInfo: ChatInfo) => string;
  getParticipants: (chatInfo: ChatInfo, userid: string) => string;
  getAvatar: (chatInfo: ChatInfo, userid: string) => string | undefined;
}

export const useChatlistState: StateCreator<ChatlistState> = (set, get) => ({
  chats: [],
  protocols: [],

  lastRefreshRequest: 0,
  lastRefresh: 0,

  refreshRequested: () => set({ lastRefreshRequest: timestamp() }),
  refreshSucceeded: () =>
    set(state => ({ lastRefresh: state.lastRefreshRequest })),

  updateChats: (newChats: ChatInfo[]) => {
    logger.info('started chat update');
    const state = get();
    let updatedChats = [...state.chats];
    for (const chat of newChats.reverse()) {
      const idx = updatedChats.findIndex(c => c.chatid === chat.chatid);
      if (idx === -1) {
        updatedChats = [...updatedChats, chat];
      } else if (chat.updated > updatedChats[idx].updated) {
        updatedChats[idx] = chat;
      }
    }
    logger.info('finished chat update');
    return updatedChats;
  },

  updateChatInfo: (chat: ChatInfo) => {
    const chats = get().chats;
    let index = chats.findIndex(c => c.chatid === chat.chatid);
    if (index < 0) {
      index = chats.findIndex(c => c.created === chat.created);
    }
    if (index > -1) {
      chats[index] = chat;
      return chats;
    } else {
      return [...chats, chat];
    }
  },

  updateProtocols: (protocols: string[]) => set({ protocols }),

  updateUserChats: (updatedProfile: Profile) =>
    set(state => ({
      chats: state.chats.map(chat => ({
        ...chat,
        profiles: chat.profiles?.map(profile =>
          profile.userid === updatedProfile.userid ? updatedProfile : profile,
        ),
      })),
    })),

  getTopic: (chatInfo: ChatInfo) =>
    get().chats.find(chat => chat.chatid === chatInfo.chatid)?.topic ??
    'new chat',

  getParticipants: (chatInfo: ChatInfo, userid: string) => {
    if (!chatInfo.profiles) return '';
    return (
      chatInfo.profiles
        .filter(profile => profile.userid !== userid)
        .map(profile => profile.username)
        .join(', ') ?? 'Chat'
    );
  },

  getAvatar: (chatInfo: ChatInfo, userid: string) =>
    chatInfo?.profiles?.find(profile => profile.userid !== userid)?.avatar,
});
