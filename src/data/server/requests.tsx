import { store } from '@/data';
import { sendRequest } from '@/data/server';
import {
  MayaRequest,
  RefreshRequest,
  MessageRequest,
  UserRequest,
} from '@/data/types';
import { Message, Auth, Profile } from '@/data/types';

export const refreshChatlist = () => {
  const state = store.getState();
  let request: RefreshRequest = {
    userid: state.user.currentUser.userid,
    token: state.user.token,
    command: 'refresh',
    data: {
      time: state.chatlist.lastRefresh,
    },
  };
  sendRequest(request);
};

export const updateUserProfile = (profile: Profile) => {
  const state = store.getState();
  let newUser = { ...state.user.currentUser, ...profile };
  let request: UserRequest = {
    userid: state.user.currentUser.userid,
    token: state.user.token,
    command: 'update_user',
    data: newUser,
  };
  sendRequest(request);
};

export const sendMessage = (message: Message) => {
  const state = store.getState();
  let request: MessageRequest = {
    userid: state.user.currentUser.userid,
    token: state.user.token,
    command: 'message',
    data: message,
  };
  sendRequest(request);
};

export const authUser = (userid: string) => {
  let request: MayaRequest = {
    userid: userid,
    token: '',
    command: 'auth',
  };
  sendRequest(request);
  console.log('attempting auth');
};

export const verifyUser = (auth: Auth) => {
  let request: MayaRequest = {
    userid: auth.userid,
    token: auth.token,
    command: 'verify',
  };
  sendRequest(request);
  console.log('attempting verify');
};
