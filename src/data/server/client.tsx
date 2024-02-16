import { getState } from '@/data';
import { User, RefreshData, ChatInfo, Message, Chunk } from '@/data/types';

class ClientUpdate {
  handleRefreshUpdate(data: RefreshData) {
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
    console.log('Chunk:', data);
  }

  handleMessageUpdate(data: Message) {
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
