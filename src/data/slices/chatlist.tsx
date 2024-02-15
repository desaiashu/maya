import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatInfo, Profile } from '@/data/types';
import { RootState } from '@/data';

interface ChatState {
  chats: ChatInfo[];
  lastRefresh: number;
}

const initialState: ChatState = {
  chats: [],
  lastRefresh: 0,
};

const chatlistSlice = createSlice({
  name: 'chatlist',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<ChatInfo[]>) {
      state.chats = action.payload;
    },
    updateUserChats(state, action: PayloadAction<Profile>) {
      const user = action.payload;
      state.chats.forEach(chat => {
        if (chat.profiles && chat.participants.includes(user.userid)) {
          // Do something with the chat
          const userProfile = chat.profiles.find(
            profile => profile.userid === user.userid,
          );
          if (userProfile) {
            userProfile.avatar = user.avatar;
            userProfile.username = user.username;
          }
        }
      });
    },
  },
});

export const { setChats, updateUserChats } = chatlistSlice.actions;

export const getParticipantsByChatId = (state: RootState, chatid: string) => {
  const chatInfo = state.chatlist.chats.find(chat => chat.chatid === chatid);
  const user = state.user.currentUser;
  const nonUserParticipants = chatInfo?.participants.filter(
    participant => participant !== user.userid,
  );
  return nonUserParticipants?.join(', ') || 'Chat';
};

export const getTopicByChatId = (state: RootState, chatid: string) => {
  const chatInfo = state.chatlist.chats.find(chat => chat.chatid === chatid);
  if (chatInfo?.topic) {
    return chatInfo.topic;
  } else {
    return 'new chat';
  }
};

export const getAvatarByChatId = (state: RootState, chatid: string) => {
  const chatInfo = state.chatlist.chats.find(chat => chat.chatid === chatid);
  const currentUser = state.user.currentUser; // Assuming you have a currentUser in your state
  const nonCurrentUserProfile = chatInfo?.profiles?.find(
    profile => profile.userid !== currentUser.userid,
  );
  let avatarString = nonCurrentUserProfile?.avatar;
  return avatarString;
};

export default chatlistSlice.reducer;
