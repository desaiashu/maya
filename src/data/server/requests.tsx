import { store } from '@/data';
import { sendRequest, socket } from '@/data/server';
import { MayaRequest, RefreshRequest, ChatRequest, UserRequest, MessageRequest } from '@/data/types';
import { Message, Auth } from '@/data/types';

const test_token = '6068bf'

export const refreshChatlist = () => {
  const state = store.getState();
  let request: RefreshRequest = { 
    userid: state.user.currentUser?.userid || '+16504305130',
    token: test_token, //state.user.token,
    command: 'refresh',
    data: {
      time: state.chatlist.lastRefresh
    },
  }
  sendRequest(socket, request);
};

export const sendMessage = (message: Message) => {
  const state = store.getState();
  let request: MessageRequest = { 
    userid: state.user.currentUser?.userid || '+16504305130',
    token: test_token, //state.user.token,
    command: 'message',
    data: message,
  }
  sendRequest(socket, request);
}

export const verifyUser = (auth: Auth) => {

}