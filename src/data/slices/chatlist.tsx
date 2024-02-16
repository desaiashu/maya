import { ChatInfo, Profile } from '@/data/types';
import { StateCreator } from 'zustand';
import { getState } from '@/data';

export interface ChatlistState {
  chats: ChatInfo[];
  lastRefresh: number;
  setChats: (chats: ChatInfo[]) => void;
  updateUserChats: (updatedProfile: Profile) => void;
  getParticipantsByChatId: (chatid: string) => string;
  getTopicByChatId: (chatid: string) => string;
  getAvatarByChatId: (chatid: string) => string;
  getTopics: () => Record<string, string>;
  getParticipants: () => Record<string, string>;
  getAvatars: () => Record<string, string>;
}

export const useChatlistState: StateCreator<ChatlistState> = (set, get) => ({
  chats: [],
  lastRefresh: 0,
  setChats: (chats: ChatInfo[]) => set({ chats }),
  updateUserChats: (updatedProfile: Profile) => {
    set(state => ({
      chats: state.chats.map(chat => ({
        ...chat,
        profiles: chat.profiles?.map(profile =>
          profile.userid === updatedProfile.userid ? updatedProfile : profile,
        ),
      })),
    }));
  },
  getParticipantsByChatId: (chatid: string) => {
    const chatlistState = get();
    const state = getState();
    const chatInfo = chatlistState.chats.find(chat => chat.chatid === chatid);
    const nonUserParticipants = chatInfo?.participants.filter(
      participant => participant !== state.currentUser.userid,
    );
    return nonUserParticipants?.join(', ') || 'Chat';
  },
  getTopicByChatId: (chatid: string) => {
    const chatlistState = get();
    const chatInfo = chatlistState.chats.find(chat => chat.chatid === chatid);
    if (chatInfo?.topic) {
      return chatInfo.topic;
    } else {
      return 'new chat';
    }
  },
  getAvatarByChatId: (chatid: string) => {
    const state = get();
    const userState = getState();
    const chatInfo = state.chats.find(chat => chat.chatid === chatid);
    const nonCurrentUserProfile = chatInfo?.profiles?.find(
      profile => profile.userid !== userState.currentUser.userid,
    );
    let avatarString = nonCurrentUserProfile?.avatar;
    return avatarString || '';
  },
  getTopics: () => {
    const state = get();
    const topics = state.chats.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = state.getTopicByChatId(chatInfo.chatid);
      return acc;
    }, {} as Record<string, ReturnType<typeof state.getTopicByChatId>>);
    return topics;
  },
  getParticipants: () => {
    const state = get();
    const participants = state.chats.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = state.getParticipantsByChatId(chatInfo.chatid);
      return acc;
    }, {} as Record<string, ReturnType<typeof state.getParticipantsByChatId>>);
    return participants;
  },
  getAvatars: () => {
    const state = get();
    const participants = state.chats.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = state.getAvatarByChatId(chatInfo.chatid);
      return acc;
    }, {} as Record<string, ReturnType<typeof state.getAvatarByChatId>>);
    return participants;
  },
});
