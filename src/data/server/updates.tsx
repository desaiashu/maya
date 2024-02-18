import { getState, getStream } from '@/data';
import { User, RefreshData, ChatInfo, Message, Chunk } from '@/data/types';
import { LayoutAnimation } from 'react-native';

class ClientUpdate {
  handleRefreshUpdate(data: RefreshData) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const state = getState.getState();
    state.setChats(data.chatlist);
    state.updateMessages(data.messages);
  }

  handleUserUpdate(data: User | undefined) {
    const state = getState.getState();
    if (data) {
      state.setUser(data);
    }
    state.authenticate();
  }

  handleChatInfoUpdate(data: ChatInfo) {
    console.log('ChatInfo:', data);
  }

  handleChunkUpdate(data: Chunk) {
    const streamState = getStream.getState();
    streamState.handleChunk(data);
  }

  handleMessageUpdate(data: Message) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const state = getState.getState();
    state.updateMessages([data]);
    // Pass message to stream state. If it's relevant, it will be handled
    const streamState = getStream.getState();
    streamState.handleMessage(data);
  }

  handleSuccessUpdate(data: string) {
    console.log('Success:', data);
  }

  handleErrorUpdate(data: string) {
    console.error('Error:', data);
  }
}

export const client = new ClientUpdate();
