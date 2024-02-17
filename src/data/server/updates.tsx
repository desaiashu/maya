import { getState } from '@/data';
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
    const state = getState.getState();
    LayoutAnimation.configureNext(
      LayoutAnimation.create(10, 'easeInEaseOut', 'opacity'),
    );
    state.updateChunk(data);
  }

  handleMessageUpdate(data: Message) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const state = getState.getState();
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
