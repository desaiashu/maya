import { getState } from '@/data';
import { User, RefreshData, ChatInfo, Message, Chunk } from '@/data/types';
import { LayoutAnimation } from 'react-native';

class ClientUpdate {
  handleRefreshUpdate(data: RefreshData) {
    const state = getState.getState();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
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
    console.log('Chunk:', data);
  }

  handleMessageUpdate(data: Message) {
    const state = getState.getState();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    state.updateMessages([data]);
  }

  handleSuccessUpdate(data: string) {
    console.log('Success:', data);
  }

  handleErrorUpdate(data: string) {
    console.error('Error:', data);
  }
}

export const client = new ClientUpdate();
