import { useStore, VERSION, logger } from '@/data';
import { socket } from '@/data/server';
import {
  MayaRequest,
  RefreshRequest,
  MessageRequest,
  UserRequest,
  ChatRequest,
  AnnotationRequest,
  PerspectiveRequest,
  SlugRequest,
  StopRequest,
  WSRequest,
  CodeWSRequest,
  ChatMode,
  PlanEdit,
  WorkspaceSource,
} from '@/data/types';
import { Message, Auth, Profile, ChatInfo } from '@/data/types';
import { throttle } from 'lodash';

// MayaRequest.command is auto-generated from pydantic and only includes WSRequest.
// Code-mode commands are valid at runtime; cast at the boundary until the pydantic
// models are regenerated.
const cmd = (c: CodeWSRequest): WSRequest => c as unknown as WSRequest;

class ServerRequest {
  reinitialize() {
    socket.reinitalizeWebSocket();
  }

  baseParams() {
    const state = useStore.getState();
    return {
      userid: state.currentUser.userid,
      phone: state.phone,
      token: state.token,
      version: VERSION,
    };
  }

  refreshChatlist() {
    this.throttledRefresh();
  }

  throttledRefresh = throttle(
    () => {
      const state = useStore.getState();
      let request: RefreshRequest = {
        ...this.baseParams(),
        command: 'refresh',
        data: {
          time: state.lastRefresh,
        },
      };
      socket.sendRequest(request);
      state.refreshRequested();
      logger.info('refresh requested');
      logger.info('last refresh: ' + state.lastRefresh);
    },
    120000,
    { leading: true, trailing: false },
  );

  sendMessage(message: Message) {
    let request: MessageRequest = {
      ...this.baseParams(),
      command: 'message',
      data: message,
    };
    socket.sendRequest(request);
  }

  getPerspectives(messages: Message[]) {
    let request: PerspectiveRequest = {
      ...this.baseParams(),
      command: 'perspective',
      data: messages,
    };
    socket.sendRequest(request);
  }

  getAnnotations(messages: Message[]) {
    let request: AnnotationRequest = {
      ...this.baseParams(),
      command: 'annotation',
      data: messages,
    };
    socket.sendRequest(request);
  }

  createChat(chat: ChatInfo) {
    let request: ChatRequest = {
      ...this.baseParams(),
      command: 'create_chat',
      data: chat,
    };
    socket.sendRequest(request);
  }

  updateUserProfile(profile: Profile) {
    const state = useStore.getState();
    let newUser = { ...state.currentUser, ...profile };
    let request: UserRequest = {
      ...this.baseParams(),
      command: 'update_user',
      data: newUser,
    };
    socket.sendRequest(request);
  }

  authUser(phone: string) {
    let request: MayaRequest = {
      ...this.baseParams(),
      phone: phone,
      command: 'auth',
    };
    socket.sendRequest(request);
  }

  verifyUser(auth: Auth) {
    let request: MayaRequest = {
      ...this.baseParams(),
      phone: auth.phone,
      token: auth.token,
      command: 'verify',
    };
    socket.sendRequest(request);
  }

  getSlug(slug: string) {
    let request: SlugRequest = {
      ...this.baseParams(),
      command: 'slug',
      data: slug,
    };
    socket.sendRequest(request);
  }

  stopStream(message: Message) {
    let request: StopRequest = {
      ...this.baseParams(),
      command: 'stop',
      data: message,
    };
    socket.sendRequest(request);
  }

  // ---------- code-mode commands ----------

  setMode(chatid: string, mode: ChatMode) {
    const request: MayaRequest = {
      ...this.baseParams(),
      command: cmd('set_mode'),
      data: { chatid, mode },
    };
    socket.sendRequest(request);
    logger.info('set_mode', chatid, mode);
  }

  approvePlan(chatid: string, plan_id: string) {
    const request: MayaRequest = {
      ...this.baseParams(),
      command: cmd('approve_plan'),
      data: { chatid, plan_id },
    };
    socket.sendRequest(request);
  }

  revisePlan(chatid: string, plan_id: string, edits: PlanEdit[]) {
    const request: MayaRequest = {
      ...this.baseParams(),
      command: cmd('revise_plan'),
      data: { chatid, plan_id, edits },
    };
    socket.sendRequest(request);
  }

  skipTask(chatid: string, plan_id: string, task_id: string) {
    const request: MayaRequest = {
      ...this.baseParams(),
      command: cmd('skip_task'),
      data: { chatid, plan_id, task_id },
    };
    socket.sendRequest(request);
  }

  cancelRun(chatid: string) {
    const request: MayaRequest = {
      ...this.baseParams(),
      command: cmd('cancel'),
      data: { chatid },
    };
    socket.sendRequest(request);
  }

  attachWorkspace(chatid: string, source: WorkspaceSource) {
    const request: MayaRequest = {
      ...this.baseParams(),
      command: cmd('attach_workspace'),
      data: { chatid, source },
    };
    socket.sendRequest(request);
  }
}

export const server = new ServerRequest();
