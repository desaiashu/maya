import { useStore } from '@/data';
import { socket } from '@/data/server';
import {
  MayaRequest,
  RefreshRequest,
  MessageRequest,
  UserRequest,
  ChatRequest,
} from '@/data/types';
import { Message, Auth, Profile, ChatInfo } from '@/data/types';

class ServerRequest {
  reinitialize() {
    socket.reinitalizeWebSocket();
  }

  refreshChatlist() {
    const state = useStore.getState();
    let request: RefreshRequest = {
      userid: state.currentUser.userid,
      token: state.token,
      command: 'refresh',
      data: {
        time: state.lastRefresh,
      },
    };
    socket.sendRequest(request);
  }

  sendMessage(message: Message) {
    const state = useStore.getState();
    let request: MessageRequest = {
      userid: state.currentUser.userid,
      token: state.token,
      command: 'message',
      data: message,
    };
    socket.sendRequest(request);
  }

  createChat(chat: ChatInfo) {
    const state = useStore.getState();
    let request: ChatRequest = {
      userid: state.currentUser.userid,
      token: state.token,
      command: 'create_chat',
      data: chat,
    };
    socket.sendRequest(request);
  }

  updateUserProfile(profile: Profile) {
    const state = useStore.getState();
    let newUser = { ...state.currentUser, ...profile };
    let request: UserRequest = {
      userid: state.currentUser.userid,
      token: state.token,
      command: 'update_user',
      data: newUser,
    };
    socket.sendRequest(request);
  }

  authUser(userid: string) {
    let request: MayaRequest = {
      userid: userid,
      token: '',
      command: 'auth',
    };
    socket.sendRequest(request);
  }

  verifyUser(auth: Auth) {
    let request: MayaRequest = {
      userid: auth.userid,
      token: auth.token,
      command: 'verify',
    };
    console.log('Sending verify request:', auth.userid);
    socket.sendRequest(request);
  }
}

export const server = new ServerRequest();
