import { getState } from '@/data';
import { MayaRequest, MayaUpdate } from '@/data/types';
import { hashPhoneNumber } from '@/data';
import { client } from '@/data/server/client';

const WS_URL = 'ws://localhost:5001/maya/';

class Socket {
  private socket: WebSocket;
  private updateHandlers: { [key: string]: (data: any) => void };

  constructor() {
    this.socket = this.initializeWebSocket();
    this.updateHandlers = {
      refresh: client.handleRefreshUpdate,
      success: client.handleSuccessUpdate,
      error: client.handleErrorUpdate,
      chunk: client.handleChunkUpdate,
      message: client.handleMessageUpdate,
      chatinfo: client.handleChatInfoUpdate,
      user: client.handleUserUpdate,
      // Add more mappings for other update types
    };
  }

  private initializeWebSocket = (): WebSocket => {
    console.log('WebSocket starting');
    const state = getState.getState();
    const phone_hash = hashPhoneNumber(state.currentUser.userid);
    const socket = new WebSocket(WS_URL + phone_hash);

    socket.onmessage = event => {
      const update: MayaUpdate = JSON.parse(event.data);
      console.log('WebSocket message:', update);
      const handler = this.updateHandlers[update.update];
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

  private waitForSocketOpen(socket: WebSocket, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const maxTimeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, timeout);

      socket.addEventListener('open', () => {
        clearTimeout(maxTimeout);
        resolve();
      });

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

  public reinitalizeWebSocket = () => {
    console.log('Reinitializing WebSocket with user hash...');
    try {
      if (this.socket.readyState !== WebSocket.CLOSED) {
        this.socket.close();
      }
      const newSocket = this.initializeWebSocket();
      this.waitForSocketOpen(newSocket);
      this.socket = newSocket;
    } catch (error) {
      console.error('WebSocket reconnection error:', error);
      throw error;
    }
  };

  public sendRequest = async (message: MayaRequest): Promise<void> => {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      try {
        await this.waitForSocketOpen(this.socket);
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('WebSocket send error:', error);
      }
    } else {
      console.log('Attempting to reconnect WebSocket...');
      try {
        if (this.socket.readyState !== WebSocket.CLOSED) {
          this.socket.close();
        }
        const newSocket = this.initializeWebSocket();
        await this.waitForSocketOpen(newSocket);
        this.socket = newSocket;
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('WebSocket reconnection error:', error);
      }
    }
  };
}

export const socket = new Socket();
