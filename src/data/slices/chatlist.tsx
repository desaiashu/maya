import { ChatInfo, Profile } from '@/data/types';
import { StateCreator } from 'zustand';
import { defaultAvatar } from '@/data';

export interface ChatlistState {
  chats: ChatInfo[];
  lastRefresh: number;
  setChats: (chats: ChatInfo[]) => void;
  updateUserChats: (updatedProfile: Profile) => void;
  getTopicByChatId: (chatid: string) => string;
  getParticipantsByChatId: (chatid: string, userid: string) => string;
  getAvatarByChatId: (chatid: string, userid: string) => string;
  getTopics: () => Record<string, string>;
  getParticipants: (userid: string) => Record<string, string>;
  getAvatars: (userid: string) => Record<string, string>;
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
  getTopicByChatId: (chatid: string) => {
    const chatlistState = get();
    const chatInfo = chatlistState.chats.find(chat => chat.chatid === chatid);
    if (chatInfo?.topic) {
      return chatInfo.topic;
    } else {
      return 'new chat';
    }
  },
  getParticipantsByChatId: (chatid: string, userid: string) => {
    const chatlistState = get();
    const chatInfo = chatlistState.chats.find(chat => chat.chatid === chatid);
    const nonUserParticipants = chatInfo?.participants.filter(
      participant => participant !== userid,
    );
    return nonUserParticipants?.join(', ') || 'Chat';
  },
  getAvatarByChatId: (chatid: string, userid: string) => {
    const state = get();
    const chatInfo = state.chats.find(chat => chat.chatid === chatid);
    const nonCurrentUserProfile = chatInfo?.profiles?.find(
      profile => profile.userid !== userid,
    );
    let avatarString = nonCurrentUserProfile?.avatar;
    return avatarString || defaultAvatar;
  },
  getTopics: () => {
    const state = get();
    const topics = state.chats.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = state.getTopicByChatId(chatInfo.chatid);
      return acc;
    }, {} as Record<string, string>);
    return topics;
  },
  getParticipants: (userid: string) => {
    const state = get();
    const participants = state.chats.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = state.getParticipantsByChatId(
        chatInfo.chatid,
        userid,
      );
      return acc;
    }, {} as Record<string, string>);
    return participants;
  },
  getAvatars: (userid: string) => {
    const state = get();
    const avatars = state.chats.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = state.getAvatarByChatId(chatInfo.chatid, userid);
      return acc;
    }, {} as Record<string, string>);
    return avatars;
  },
});
