import { useStore, useStream } from '@/data';
import {
  User,
  RefreshData,
  ChatInfo,
  Message,
  Chunk,
  RelatedTopic,
  Confidence,
  SearchResult,
  SlugData,
} from '@/data/types';
import { LayoutAnimation } from 'react-native';

class ClientUpdate {
  handleRefreshUpdate(data: RefreshData) {
    // Seems to be messing with the navigation stack
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const state = useStore.getState();
    state.updateChats(data.chatlist);
    state.updateMessages(data.messages);
    state.updateProtocols(data.protocols);
    state.updateBots(data.bots);
    state.updateHumans(data.contacts);
  }

  handleUserUpdate(data: User | undefined) {
    const state = useStore.getState();
    if (data) {
      state.setUser(data);
    }
    state.authenticate();
  }

  handleChatInfoUpdate(data: ChatInfo) {
    const state = useStore.getState();
    state.updateChatInfo(data);
  }

  handleChunkUpdate(data: Chunk) {
    const streamState = useStream.getState();
    streamState.handleChunk(data);
  }

  handleMessageUpdate(data: Message) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const state = useStore.getState();
    state.updateMessages([data]);
    // Pass message to stream state. If it's relevant, it will be handled
    const streamState = useStream.getState();
    streamState.handleMessage(data);
    console.log('message update');
  }

  handleConfidenceUpdate(data: Confidence) {
    const state = useStore.getState();
    state.updatePerspective(data.messageid, data.chatid, { confidence: data });
  }

  handleSearchUpdate(data: SearchResult[]) {
    const state = useStore.getState();
    state.updatePerspective(data[0].messageid, data[0].chatid, {
      search: data,
    });
  }

  handleRelatedUpdate(data: RelatedTopic[]) {
    const state = useStore.getState();
    state.updatePerspective(data[0].messageid, data[0].chatid, {
      related: data,
    });
    console.log('related update');
  }

  handleSlugUpdate(data: SlugData) {
    const state = useStore.getState();
    state.updateChatInfo(data.chatInfo);
    state.updateMessages(data.messages);
    for (let p of data.perspectives) {
      state.updatePerspective(p.messageid, p.chatid, p);
    }

    console.log(data);

    console.log('SLUG RECEIVED');
  }

  handleSuccessUpdate(data: string) {
    console.log('Success:', data);
  }

  handleErrorUpdate(data: string) {
    console.error('Error:', data);
    if (data === 'verification failed') {
      const state = useStore.getState();
      state.clearUser();
    }
  }
}

export const client = new ClientUpdate();
