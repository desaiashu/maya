import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatInfo } from '../data/types'
import { RootState } from '../data/store';
import { getAvatarSource } from '../data/funx'

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
  },
});

export const { setChats } = chatlistSlice.actions;

export const getParticipantsByChatId = (state: RootState, chatid: string) => {
  const chat = state.chatlist.chats.find(chat => chat.chatid === chatid);
  const user = state.user.currentUser;
  const nonUserParticipants = chat?.participants.filter(participant => participant !== user?.userid);
  return nonUserParticipants?.join(', ') || 'Chat';
}

export const getTopicByChatId = (state: RootState, chatid: string) => {
  const chat = state.chatlist.chats.find(chat => chat.chatid === chatid);
  const user = state.user.currentUser;
  if (chat?.topic) {
    return chat.topic;
  } else {
    return 'new chat'
  }
}

export const getAvatarByChatId = (state: RootState, chatid: string) => {
  const chatInfo = state.chatlist.chats.find(chat => chat.chatid === chatid);
  const currentUser = state.user.currentUser; // Assuming you have a currentUser in your state
  const nonCurrentUserProfile = chatInfo?.profiles?.find(profile => profile.userid != currentUser?.userid);
  let avatarString = nonCurrentUserProfile?.avatar || 'local://user.png';
  return getAvatarSource(avatarString);
}

export default chatlistSlice.reducer;