import {
  useStore,
  useStream,
  forceUpdate,
  server,
  analytics,
  prepAnimation,
  logger,
  State,
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
    // prepAnimation('spring');
    const currentState = useStore.getState();
    const messages = currentState.updateMessages(data.messages);
    const perspectives = currentState.updatePerspectives(data.perspectives);
    useStore.setState((state: State) => ({
      ...state,
      chats: data.chatlist,
      protocols: data.protocols,
      bots: data.bots,
      messages: messages,
      perspectives: perspectives,
    }));
  }

  handleUserUpdate(data: User | undefined) {
    const state = useStore.getState();
    if (data) {
      state.setUser(data);
      logger.info('set user');
      server.reinitialize();
      analytics.set_user(data.userid);
    }
    state.authenticate();
    logger.info('user update');
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
    const currentState = useStore.getState();
    const messages = currentState.updateMessages([data]);
    useStore.setState((state: State) => ({
      ...state,
      messages: messages,
    }));
    // Pass message to stream state. If it's relevant, it will be handled
    const streamState = useStream.getState();
    streamState.handleMessage(data);
    logger.info('message update');
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
    logger.info('related update');
  }

  handleSlugUpdate(data: SlugData) {
    const currentState = useStore.getState();
    const chats = currentState.updateChatInfo(data.chatInfo);
    const messages = currentState.updateMessages(data.messages);
    const perspectives = currentState.updatePerspectives(data.perspectives);
    useStore.setState((state: State) => ({
      ...state,
      chats: chats,
      messages: messages,
      perspectives: perspectives,
    }));
  }

  handleSuccessUpdate(data: UpdateInfo) {
    logger.info('Success:', data.code);
  }

  handleErrorUpdate(data: UpdateInfo) {
    logger.error('Error:', data);
    if (data.code === 'version outdated') {
      forceUpdate(data.info);
    } else if (data.code === 'verification failed') {
      const state = useStore.getState();
      state.clearUser();
    }
  }
}

export const client = new ClientUpdate();
