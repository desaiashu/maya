import { store } from '@/data';
import { sendRequest, socket } from '@/data/server';
import {
  MayaRequest,
  RefreshRequest,
  MessageRequest,
  UserRequest,
} from '@/data/types';
import { Message, Auth, Profile } from '@/data/types';

const test_token = '6068bf';

export const refreshChatlist = () => {
  const state = store.getState();
  let request: RefreshRequest = {
    userid: state.user.currentUser.userid,
    token: test_token, //state.user.token,
    command: 'refresh',
    data: {
      time: state.chatlist.lastRefresh,
    },
  };
  sendRequest(socket, request);
};

export const updateUserProfile = (profile: Profile) => {
  const state = store.getState();
  let newUser = { ...state.user.currentUser, ...profile };
  let request: UserRequest = {
    userid: state.user.currentUser.userid,
    token: test_token, //state.user.token,
    command: 'update_user',
    data: newUser,
  };
  sendRequest(socket, request);
};

export const sendMessage = (message: Message) => {
  const state = store.getState();
  let request: MessageRequest = {
    userid: state.user.currentUser.userid,
    token: test_token, //state.user.token,
    command: 'message',
    data: message,
  };
  sendRequest(socket, request);
};

export const authUser = (userid: string) => {
  let request: MayaRequest = {
    userid: userid,
    token: '',
    command: 'auth',
  };
  sendRequest(socket, request);
  console.log('attempting auth');
};

export const verifyUser = (auth: Auth) => {
  let request: MayaRequest = {
    userid: auth.userid,
    token: auth.token,
    command: 'verify',
  };
  sendRequest(socket, request);
  console.log('attempting verify');
};
