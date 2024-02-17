import { getState } from '@/data';
import { socket } from '@/data/server';
import {
  MayaRequest,
  RefreshRequest,
  MessageRequest,
  UserRequest,
} from '@/data/types';
import { Message, Auth, Profile } from '@/data/types';

class ServerRequest {
  reinitialize() {
    socket.reinitalizeWebSocket();
  }

  refreshChatlist() {
    const state = getState.getState();
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

  updateUserProfile(profile: Profile) {
    const state = getState.getState();
    let newUser = { ...state.currentUser, ...profile };
    let request: UserRequest = {
      userid: state.currentUser.userid,
      token: state.token,
      command: 'update_user',
      data: newUser,
    };
    socket.sendRequest(request);
  }

  sendMessage(message: Message) {
    const state = getState.getState();
    let request: MessageRequest = {
      userid: state.currentUser.userid,
      token: state.token,
      command: 'message',
      data: message,
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
    console.log('attempting auth');
  }

  verifyUser(auth: Auth) {
    let request: MayaRequest = {
      userid: auth.userid,
      token: auth.token,
      command: 'verify',
    };
    socket.sendRequest(request);
    console.log('attempting verify');
  }
}

export const server = new ServerRequest();
