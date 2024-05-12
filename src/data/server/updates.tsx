import {
  useStore,
  useStream,
  forceUpdate,
  server,
  analytics,
  prepAnimation,
} from '@/data';
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
  UpdateInfo,
} from '@/data/types';

class ClientUpdate {
  handleRefreshUpdate(data: RefreshData) {
    // Seems to be messing with the navigation stack
    // prepAnimation(LayoutAnimation.Presets.spring);
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
      console.log('set user');
      server.reinitialize();
      analytics.set_user(data.userid);
    }
    state.authenticate();
    console.log('user update');
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
    prepAnimation('spring');
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
  }

  handleSuccessUpdate(data: UpdateInfo) {
    console.log('Success:', data.code);
  }

  handleErrorUpdate(data: UpdateInfo) {
    console.error('Error:', data);
    if (data.code === 'version outdated') {
      forceUpdate(data.info);
    } else if (data.code === 'verification failed') {
      const state = useStore.getState();
      state.clearUser();
    }
  }
}

export const client = new ClientUpdate();
