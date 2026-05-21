import { useStore } from '@/data';
import { MayaRequest, MayaUpdate, WSUpdate, CodeWSUpdate } from '@/data/types';
import { client } from '@/data/server/updates';
import { WS_URL, WEB, logger } from '@/data';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type AnyUpdate = WSUpdate | CodeWSUpdate;

class Socket {
  private socket: WebSocket;
  private updateHandlers: Record<AnyUpdate, (data: any) => void>;

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
      confidence: client.handleConfidenceUpdate,
      related: client.handleRelatedUpdate,
      search: client.handleSearchUpdate,
      slug: client.handleSlugUpdate,
      // code-mode
      thought_chunk: client.handleThoughtChunkUpdate,
      tool_call_start: client.handleToolCallStartUpdate,
      tool_call_end: client.handleToolCallEndUpdate,
      seat_attribution: client.handleSeatAttributionUpdate,
      roundtable_turn: client.handleRoundtableTurnUpdate,
      roundtable_summary: client.handleRoundtableSummaryUpdate,
      plan_proposed: client.handlePlanProposedUpdate,
      plan_pending_approval: client.handlePlanPendingApprovalUpdate,
      plan_approved: client.handlePlanApprovedUpdate,
      task_dispatched: client.handleTaskDispatchedUpdate,
      executor_event: client.handleExecutorEventUpdate,
      task_completed: client.handleTaskCompletedUpdate,
      merge_conflict: client.handleMergeConflictUpdate,
      roundtable_verdict: client.handleRoundtableVerdictUpdate,
    };
  }

  private initializeWebSocket = (): WebSocket => {
    logger.info('WebSocket starting');
    const state = useStore.getState();
    const user_slug =
      WEB || state.currentUser.userid === '_'
        ? uuidv4()
        : state.currentUser.userid;
    const socket = new WebSocket(WS_URL + user_slug);

    socket.onmessage = event => {
      const update: MayaUpdate = JSON.parse(event.data);
      const kind = update.update as AnyUpdate;
      if (kind !== 'chunk') logger.info('received update: ', kind);
      const handler = this.updateHandlers[kind];
      if (handler) {
        setTimeout(() => {
          handler(update.data);
          if (kind !== 'chunk') logger.info('completed update: ', kind);
        }, 0);
      } else {
        logger.error('Unknown update type:', kind);
      }
    };

    socket.onerror = event => {
      logger.error('WebSocket error:', event);
    };

    socket.onclose = event => {
      logger.info('WebSocket connection closed:', event);
    };

    logger.info('WebSocket initialized');
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
        logger.error('WebSocket error:', event);
      });

      socket.addEventListener('close', event => {
        clearTimeout(maxTimeout);
        reject(new Error('WebSocket was closed'));
        logger.info('WebSocket closed:', event);
      });
    });
  }

  public reinitalizeWebSocket = () => {
    logger.info('Reinitializing WebSocket with user hash...');
    try {
      if (this.socket.readyState !== WebSocket.CLOSED) {
        this.socket.close();
      }
      const newSocket = this.initializeWebSocket();
      this.waitForSocketOpen(newSocket);
      this.socket = newSocket;
    } catch (error) {
      logger.error('WebSocket reconnection error:', error);
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
        logger.error('WebSocket send error:', error);
      }
    } else {
      logger.info('Attempting to reconnect WebSocket...');
      try {
        if (this.socket.readyState !== WebSocket.CLOSED) {
          this.socket.close();
        }
        const newSocket = this.initializeWebSocket();
        await this.waitForSocketOpen(newSocket);
        this.socket = newSocket;
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        logger.error('WebSocket reconnection error:', error);
      }
    }

    logger.info('sending request: ', message.command);
  };
}

export const socket = new Socket();
