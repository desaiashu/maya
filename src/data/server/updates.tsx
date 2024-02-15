import { store } from '@/data';
import { setChats, updateMessages, setUser, authenticate } from '@/data/slices';
import { User, RefreshData, ChatInfo, Message, Chunk } from '@/data/types';

// Define handler functions for each update type
export const handleRefreshUpdate = (data: RefreshData) => {
  // Dispatch an action to handle refresh update
  store.dispatch(setChats(data.chatlist));
  store.dispatch(updateMessages(data.messages));
};

export const handleUserUpdate = (data: User | undefined) => {
  if (data) {
    store.dispatch(setUser(data));
  }
  store.dispatch(authenticate());

  console.log('ChatInfo:', data);
  //TODO: dispatch an action to update chat info
};

export const handleChatInfoUpdate = (data: ChatInfo) => {
  console.log('ChatInfo:', data);
  //TODO: dispatch an action to update chat info
};

export const handleChunkUpdate = (data: Chunk) => {
  console.log('Chunk:', data);
};

export const handleMessageUpdate = (data: Message) => {
  store.dispatch(updateMessages([data]));
};

export const handleSuccessUpdate = (data: string) => {
  console.log('Success:', data);
};

export const handleErrorUpdate = (data: string) => {
  console.error('Error:', data);
};
