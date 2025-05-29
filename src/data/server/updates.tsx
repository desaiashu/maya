import {
  useStore,
  useStream,
  forceUpdate,
  server,
  analytics,
  prepAnimation,
  logger,
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
    logger.info('refresh update');
    logger.info(data.messages.length);
    logger.info(data.perspectives.length);
    logger.info(data.chatlist.length);

    // Seems to be messing with the navigation stack
    // prepAnimation('spring');
    const currentState = useStore.getState();
    // const messages = currentState.updateMessages(data.messages);
    // const p = currentState.updatePerspectives(data.perspectives);
    useStore.setState(state => ({
      ...state,
      chats: currentState.updateChats(data.chatlist),
      protocols: data.protocols,
      bots: data.bots,
      messages: currentState.updateMessages(data.messages),
      ...currentState.updatePerspectives(data.perspectives),
    }));
    currentState.refreshSucceeded();
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
    const currentState = useStore.getState();
    // const chats = currentState.updateChatInfo(data);
    useStore.setState(state => ({
      ...state,
      chats: currentState.updateChatInfo(data),
    }));
  }

  handleChunkUpdate(data: Chunk) {
    const streamState = useStream.getState();
    streamState.handleChunk(data);
  }

  handleMessageUpdate(data: Message) {
    prepAnimation('spring');
    const currentState = useStore.getState();
    // const messages = currentState.updateMessages([data]);
    useStore.setState(state => ({
      ...state,
      messages: currentState.updateMessages([data]),
    }));
    // Pass message to stream state. If it's relevant, it will be handled
    const streamState = useStream.getState();
    streamState.handleMessage(data);
    logger.info('message update');
  }

  handleConfidenceUpdate(data: Confidence) {
    const state = useStore.getState();
    state.saveConfidence(data);
  }

  handleSearchUpdate(data: SearchResult[]) {
    const state = useStore.getState();
    state.saveResults(data);
  }

  handleRelatedUpdate(data: RelatedTopic[]) {
    const state = useStore.getState();
    state.saveTopics(data);
    logger.info('related update');
  }

  handleSlugUpdate(data: SlugData) {
    const currentState = useStore.getState();
    // const chats = currentState.updateChatInfo(data.chatInfo);
    // const messages = currentState.updateMessages(data.messages);
    // const p = currentState.updatePerspectives(data.perspectives);
    useStore.setState(state => ({
      ...state,
      chats: currentState.updateChatInfo(data.chatInfo),
      messages: currentState.updateMessages(data.messages),
      ...currentState.updatePerspectives(data.perspectives),
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
