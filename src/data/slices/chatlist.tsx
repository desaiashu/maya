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

  updateUserChats: (updatedProfile: Profile) =>
    set(state => ({
      chats: state.chats.map(chat => ({
        ...chat,
        profiles: chat.profiles?.map(profile =>
          profile.userid === updatedProfile.userid ? updatedProfile : profile,
        ),
      })),
    })),

  getTopics: () => getItemsByChatId(get, get().getTopicByChatId),

  getParticipants: (userid: string) =>
    getItemsByChatId(get, chatid =>
      get().getParticipantsByChatId(chatid, userid),
    ),

  getAvatars: (userid: string) =>
    getItemsByChatId(get, chatid => get().getAvatarByChatId(chatid, userid)),

  getTopicByChatId: (chatid: string) =>
    get().chats.find(chat => chat.chatid === chatid)?.topic ?? 'new chat',

  getParticipantsByChatId: (chatid: string, userid: string) => {
    const chatInfo = get().chats.find(chat => chat.chatid === chatid);
    return (
      chatInfo?.participants
        .filter(participant => participant !== userid)
        .join(', ') ?? 'Chat'
    );
  },

  getAvatarByChatId: (chatid: string, userid: string) => {
    const chatInfo = get().chats.find(chat => chat.chatid === chatid);
    return (
      chatInfo?.profiles?.find(profile => profile.userid !== userid)?.avatar ??
      defaultAvatar
    );
  },
});

//Helper function to get items by chatid
function getItemsByChatId(
  get: () => ChatlistState,
  getItem: (chatid: string) => string,
) {
  return get().chats.reduce(
    (acc: Record<string, string>, chatInfo: ChatInfo) => ({
      ...acc,
      [chatInfo.chatid]: getItem(chatInfo.chatid),
    }),
    {} as Record<string, string>,
  );
}
