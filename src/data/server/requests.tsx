import { store } from '../data/store';
import { sendRequest, socket } from './server';
import { MayaRequest, RefreshRequest, ChatRequest, UserRequest, MessageRequest } from '../data/types';
import { Message } from '../data/types';

export const refreshChatlist = () => {
  console.log('refresh');
  const state = store.getState();
  let request: RefreshRequest = { 
    userid: state.user.currentUser?.userid || '+16504305130',
    token: '623a12', //state.user.token,
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
    token: '623a12', //state.user.token,
    command: 'message',
    data: message,
  }
  sendRequest(socket, request);
}