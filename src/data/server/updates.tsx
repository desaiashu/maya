import { store } from '../data/store';
import { setChats } from '../slices/chatlist';
import { updateMessages } from '../slices/messages';
import { MayaUpdate, RefreshUpdate, ChunkUpdate, ErrorUpdate, MessageUpdate, SuccessUpdate } from '../data/types';
import { RefreshData, ChatInfo, Message, Chunk } from '../data/types'

// Define handler functions for each update type
export const handleRefreshUpdate = (data: RefreshData) => {
    // Dispatch an action to handle refresh update
    store.dispatch(setChats(data.chatlist));
    store.dispatch(updateMessages(data.messages));
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
