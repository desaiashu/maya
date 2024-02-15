import { store } from '@/data';
import { MayaRequest, MayaUpdate } from '@/data/types';
import { hashPhoneNumber } from '@/data';
import {
  handleRefreshUpdate,
  handleChatInfoUpdate,
  handleChunkUpdate,
  handleMessageUpdate,
  handleSuccessUpdate,
  handleErrorUpdate,
  handleUserUpdate,
} from './updates';

const WS_URL = 'ws://localhost:5001/maya/';

const updateHandlers: { [key: string]: (data: any) => void } = {
  refresh: handleRefreshUpdate,
  success: handleSuccessUpdate,
  error: handleErrorUpdate,
  chunk: handleChunkUpdate,
  message: handleMessageUpdate,
  chatinfo: handleChatInfoUpdate,
  user: handleUserUpdate,
  // Add more mappings for other update types
};

export const initializeWebSocket = (): WebSocket => {
  console.log('WebSocket starting');
  const state = store.getState();
  //TODO: if user is not logged in, we need to snag the phone# first
  //Might want to use HTTP for first auth...
  //Or close and reopen the socket when the user logs in
  const phone_hash = hashPhoneNumber(state.user.currentUser.userid);
  const socket = new WebSocket(WS_URL + phone_hash);

  socket.onmessage = event => {
    const update: MayaUpdate = JSON.parse(event.data);
    console.log('WebSocket message:', update);
    const handler = updateHandlers[update.update];
    if (handler) {
      handler(update.data);
    } else {
      console.error('Unknown update type:', update.update);
    }
  };

  socket.onerror = event => {
    console.error('WebSocket error:', event);
  };

  socket.onclose = event => {
    console.log('WebSocket connection closed:', event);
  };

  console.log('WebSocket initialized');
  return socket;
};

function waitForSocketOpen(socket: WebSocket, timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const maxTimeout = setTimeout(() => {
      reject(new Error('WebSocket connection timeout'));
    }, timeout);

    socket.addEventListener('open', () => {
      clearTimeout(maxTimeout);
      resolve();
    });

    // Optional: handle errors and closure
    socket.addEventListener('error', event => {
      clearTimeout(maxTimeout);
      reject(new Error('WebSocket connection error'));
      console.error('WebSocket error:', event);
    });

    socket.addEventListener('close', event => {
      clearTimeout(maxTimeout);
      reject(new Error('WebSocket was closed'));
      console.log('WebSocket closed:', event);
    });
  });
}

export const reinitalizeWebSocket = () => {
  console.log('Reinitializing WebSocket with user hash...');
  try {
    // Close the previous socket if it's not in a CLOSED state
    if (socket.readyState !== WebSocket.CLOSED) {
      socket.close();
    }
    // Reinitialize the WebSocket connection
    const newSocket = initializeWebSocket();
    waitForSocketOpen(newSocket);
    socket = newSocket;
  } catch (error) {
    console.error('WebSocket reconnection error:', error);
    throw error;
  }
};

// Function to send a message through the WebSocket
export const sendRequest = async (message: MayaRequest): Promise<void> => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else if (socket.readyState === WebSocket.CONNECTING) {
    try {
      await waitForSocketOpen(socket);
      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('WebSocket send error:', error);
    }
  } else {
    // Handle the case where the socket is not open and not connecting
    // Attempt to reconnect
    console.log('Attempting to reconnect WebSocket...');
    try {
      // Close the previous socket if it's not in a CLOSED state
      if (socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
      // Reinitialize the WebSocket connection
      const newSocket = initializeWebSocket();
      await waitForSocketOpen(newSocket);
      socket = newSocket;
      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('WebSocket reconnection error:', error);
    }
  }
};

export let socket = initializeWebSocket();
