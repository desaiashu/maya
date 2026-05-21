import { StateCreator } from 'zustand';
import {
  ChatMode,
  Plan,
  PlanProposed,
  PlanPendingApproval,
  PlanApproved,
  TaskDispatched,
  TaskCompleted,
  ExecutorEvent,
  RoundtableTurn,
  RoundtableSummary,
  RoundtableVerdict,
  MergeConflict,
  SeatAttribution,
  Verdict,
} from '@/data/types';

// Server uses `conversation_id`; client uses `chatid`. They're the same value.
const convo = (e: { conversation_id?: string; chatid?: string }): string =>
  e.conversation_id ?? e.chatid ?? '';

export interface PendingPlan {
  plan: Plan;
  reason: string;
  suggested_cap_usd?: number;
}

export interface TaskStatus {
  state: 'dispatched' | 'completed' | 'failed';
  worktree_path?: string;
  summary?: string;
}

export interface TurnEntry {
  seat: string;
  round: number;
  content: string;
  done: boolean;
}

export interface SummaryEntry {
  round: number;
  anonymized_summary: string;
}

export interface VerdictEntry {
  verdict: Verdict;
  reason: string;
}

export interface CodeState {
  // app-level mode — drives which chat list & compose protocol the UI shows
  viewMode: ChatMode;
  setViewMode: (mode: ChatMode) => void;

  // per chatid
  plans: Record<string, Plan>;
  pendingApprovals: Record<string, PendingPlan>;
  tasks: Record<string, Record<string, TaskStatus>>;
  turns: Record<string, TurnEntry[]>;
  summaries: Record<string, SummaryEntry[]>;
  executorEvents: Record<string, Record<string, ExecutorEvent[]>>;
  conflicts: Record<string, MergeConflict[]>;
  verdicts: Record<string, VerdictEntry>;
  seats: Record<string, Record<string, SeatAttribution>>; // chatid -> sender -> attribution

  // setters
  applyPlanProposed: (data: PlanProposed) => void;
  applyPlanPendingApproval: (data: PlanPendingApproval) => void;
  applyPlanApproved: (data: PlanApproved) => void;
  applyTaskDispatched: (data: TaskDispatched) => void;
  applyTaskCompleted: (data: TaskCompleted) => void;
  applyExecutorEvent: (data: ExecutorEvent) => void;
  applyRoundtableTurn: (data: RoundtableTurn) => void;
  applyRoundtableSummary: (data: RoundtableSummary) => void;
  applyMergeConflict: (data: MergeConflict) => void;
  applyRoundtableVerdict: (data: RoundtableVerdict) => void;
  applySeatAttribution: (data: SeatAttribution) => void;

  clearCodeState: (chatid: string) => void;
}

export const useCodeState: StateCreator<CodeState> = (set, _get) => ({
  viewMode: 'chat',
  setViewMode: mode => set({ viewMode: mode }),

  plans: {},
  pendingApprovals: {},
  tasks: {},
  turns: {},
  summaries: {},
  executorEvents: {},
  conflicts: {},
  verdicts: {},
  seats: {},

  applyPlanProposed: data => {
    const id = convo(data);
    set(state => ({
      plans: { ...state.plans, [id]: data.plan },
      pendingApprovals: omit(state.pendingApprovals, id),
    }));
  },

  applyPlanPendingApproval: data => {
    const id = convo(data);
    set(state => ({
      pendingApprovals: {
        ...state.pendingApprovals,
        [id]: {
          plan: data.plan,
          reason: data.reason,
          suggested_cap_usd: data.suggested_cap_usd,
        },
      },
      plans: { ...state.plans, [id]: data.plan },
    }));
  },

  applyPlanApproved: data => {
    const id = convo(data);
    set(state => ({ pendingApprovals: omit(state.pendingApprovals, id) }));
  },

  applyTaskDispatched: data => {
    const id = convo(data);
    set(state => ({
      tasks: {
        ...state.tasks,
        [id]: {
          ...(state.tasks[id] || {}),
          [data.task_id]: {
            state: 'dispatched',
            worktree_path: data.worktree_path,
          },
        },
      },
    }));
  },

  applyTaskCompleted: data => {
    const id = convo(data);
    set(state => ({
      tasks: {
        ...state.tasks,
        [id]: {
          ...(state.tasks[id] || {}),
          [data.task_id]: {
            state: data.success ? 'completed' : 'failed',
            summary: data.summary,
            worktree_path: state.tasks[id]?.[data.task_id]?.worktree_path,
          },
        },
      },
    }));
  },

  applyExecutorEvent: data => {
    const id = convo(data);
    set(state => {
      const perTask = state.executorEvents[id] || {};
      const existing = perTask[data.task_id] || [];
      return {
        executorEvents: {
          ...state.executorEvents,
          [id]: { ...perTask, [data.task_id]: [...existing, data] },
        },
      };
    });
  },

  applyRoundtableTurn: data => {
    const id = convo(data);
    set(state => {
      const list = state.turns[id] || [];
      const existingIdx = list.findIndex(
        t => t.round === data.round && t.seat === data.seat && !t.done,
      );
      let next: TurnEntry[];
      if (existingIdx >= 0) {
        next = [...list];
        next[existingIdx] = {
          ...next[existingIdx],
          content: next[existingIdx].content + (data.text_chunk || ''),
          done: data.done,
        };
      } else {
        next = [
          ...list,
          {
            seat: data.seat,
            round: data.round,
            content: data.text_chunk || '',
            done: data.done,
          },
        ];
      }
      return { turns: { ...state.turns, [id]: next } };
    });
  },

  applyRoundtableSummary: data => {
    const id = convo(data);
    set(state => ({
      summaries: {
        ...state.summaries,
        [id]: [
          ...(state.summaries[id] || []),
          { round: data.round, anonymized_summary: data.anonymized_summary },
        ],
      },
    }));
  },

  applyMergeConflict: data => {
    const id = convo(data);
    set(state => ({
      conflicts: {
        ...state.conflicts,
        [id]: [...(state.conflicts[id] || []), data],
      },
    }));
  },

  applyRoundtableVerdict: data => {
    const id = convo(data);
    set(state => ({
      verdicts: {
        ...state.verdicts,
        [id]: { verdict: data.verdict, reason: data.reason },
      },
    }));
  },

  applySeatAttribution: data => {
    set(state => ({
      seats: {
        ...state.seats,
        [data.chatid]: {
          ...(state.seats[data.chatid] || {}),
          [data.sender]: data,
        },
      },
    }));
  },

  clearCodeState: chatid =>
    set(state => ({
      plans: omit(state.plans, chatid),
      pendingApprovals: omit(state.pendingApprovals, chatid),
      tasks: omit(state.tasks, chatid),
      turns: omit(state.turns, chatid),
      summaries: omit(state.summaries, chatid),
      executorEvents: omit(state.executorEvents, chatid),
      conflicts: omit(state.conflicts, chatid),
      verdicts: omit(state.verdicts, chatid),
    })),
});

const omit = <T extends Record<string, unknown>>(obj: T, key: string): T => {
  if (!(key in obj)) return obj;
  const next = { ...obj };
  delete next[key];
  return next;
};
