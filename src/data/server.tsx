import { store } from './store';
import { setChats, Chat } from './slices/chatlist';
import { addMessage, Message } from './slices/messages';

const API_URL = 'https://localhost:5001/maya-refresh';
const WS_URL = 'wss://localhost:5001/maya-ws/';

export const fetchChats = async (): Promise<void> => {
  try {
    let params = {}
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const chats: Chat[] = await response.json();
    store.dispatch(setChats(chats));
  } catch (error) {
    console.error('Failed to fetch chats:', error);
  }
};

export const initializeWebSocket = (): WebSocket => {
  const socket = new WebSocket(WS_URL);

  socket.onmessage = (event) => {
    const message: Message = JSON.parse(event.data);
    store.dispatch(addMessage(message));
  };

  socket.onerror = (event) => {
    console.error('WebSocket error:', event);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  };

  return socket;
};

// Function to send a message through the WebSocket
export const sendMessage = (socket: WebSocket, message: Message): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};