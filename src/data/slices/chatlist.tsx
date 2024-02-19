import { ChatInfo, Profile } from '@/data/types';
import { StateCreator } from 'zustand';

export interface ChatlistState {
  chats: ChatInfo[];
  protocols: string[];
  lastRefresh: number;
  updateChats: (chats: ChatInfo[]) => void;
  updateChatInfo: (chat: ChatInfo) => void;
  updateProtocols: (protocols: string[]) => void;
  updateUserChats: (updatedProfile: Profile) => void;
  getTopic: (chatInfo: ChatInfo) => string;
  getParticipants: (chatInfo: ChatInfo, userid: string) => string;
  getAvatar: (chatInfo: ChatInfo, userid: string) => string | undefined;
}

export const useChatlistState: StateCreator<ChatlistState> = (set, get) => ({
  chats: [],
  protocols: [],
  lastRefresh: 0,

  updateChats: (chats: ChatInfo[]) => set({ chats }),

  updateChatInfo: (chat: ChatInfo) => {
    const chats = get().chats;
    let index = chats.findIndex(c => c.chatid === chat.chatid);
    if (index < 0) {
      console.log('newwwww');
      index = chats.findIndex(c => c.created === chat.created);
    }
    if (index > -1) {
      chats[index] = chat;
      set({ chats: chats });
      console.log('setting1');
    } else {
      set({ chats: [...chats, chat] });
      console.log('setting2');
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
