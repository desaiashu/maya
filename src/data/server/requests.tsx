import { useStore, VERSION } from '@/data';
import { socket } from '@/data/server';
import {
  MayaRequest,
  RefreshRequest,
  MessageRequest,
  UserRequest,
  ChatRequest,
  AnnotationRequest,
  PerspectiveRequest,
  SlugRequest,
  StopRequest,
} from '@/data/types';
import { Message, Auth, Profile, ChatInfo } from '@/data/types';

class ServerRequest {
  reinitialize() {
    socket.reinitalizeWebSocket();
  }

  baseParams() {
    const state = useStore.getState();
    return {
      userid: state.currentUser.userid,
      phone: state.phone,
      token: state.token,
      version: VERSION,
    };
  }

  refreshChatlist() {
    const state = useStore.getState();
    let request: RefreshRequest = {
      ...this.baseParams(),
      command: 'refresh',
      data: {
        time: state.lastRefresh,
      },
    };
    socket.sendRequest(request);
  }

  sendMessage(message: Message) {
    let request: MessageRequest = {
      ...this.baseParams(),
      command: 'message',
      data: message,
    };
    socket.sendRequest(request);
  }

  getPerspectives(messages: Message[]) {
    let request: PerspectiveRequest = {
      ...this.baseParams(),
      command: 'perspective',
      data: messages,
    };
    socket.sendRequest(request);
  }

  getAnnotations(messages: Message[]) {
    let request: AnnotationRequest = {
      ...this.baseParams(),
      command: 'annotation',
      data: messages,
    };
    socket.sendRequest(request);
  }

  createChat(chat: ChatInfo) {
    let request: ChatRequest = {
      ...this.baseParams(),
      command: 'create_chat',
      data: chat,
    };
    socket.sendRequest(request);
  }

  updateUserProfile(profile: Profile) {
    const state = useStore.getState();
    let newUser = { ...state.currentUser, ...profile };
    let request: UserRequest = {
      ...this.baseParams(),
      command: 'update_user',
      data: newUser,
    };
    socket.sendRequest(request);
  }

  authUser(phone: string) {
    let request: MayaRequest = {
      ...this.baseParams(),
      phone: phone,
      command: 'auth',
    };
    socket.sendRequest(request);
  }

  verifyUser(auth: Auth) {
    let request: MayaRequest = {
      ...this.baseParams(),
      phone: auth.phone,
      token: auth.token,
      command: 'verify',
    };
    socket.sendRequest(request);
  }

  getSlug(slug: string) {
    let request: SlugRequest = {
      ...this.baseParams(),
      command: 'slug',
      data: slug,
    };
    socket.sendRequest(request);
  }

  stopStream(message: Message) {
    let request: StopRequest = {
      ...this.baseParams(),
      command: 'stop',
      data: message,
    };
    socket.sendRequest(request);
  }
}

export const server = new ServerRequest();
