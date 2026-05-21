// Code-mode (roundtable protocol) types. Tracks CLIENT_API.md.
// Lives outside the auto-generated types.tsx so pydantic2ts doesn't clobber it.

export type ChatMode = 'chat' | 'code';

export type CodeWSRequest =
  | 'set_mode'
  | 'approve_plan'
  | 'revise_plan'
  | 'skip_task'
  | 'cancel'
  | 'attach_workspace';

export type CodeWSUpdate =
  // chat-mode UX upgrades (apply to all modes)
  | 'thought_chunk'
  | 'tool_call_start'
  | 'tool_call_end'
  | 'seat_attribution'
  // code-mode updates
  | 'roundtable_turn'
  | 'roundtable_summary'
  | 'plan_proposed'
  | 'plan_pending_approval'
  | 'plan_approved'
  | 'task_dispatched'
  | 'executor_event'
  | 'task_completed'
  | 'merge_conflict'
  | 'roundtable_verdict';

// ---------- shared shapes ----------

export interface ExecutorSpec {
  executor: string; // e.g. "openhands"
  llm_config: string; // e.g. "claude-opus-4-7"
  tools_allowlist: string[] | null;
}

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  success_criteria?: string[];
  depends_on: string[];
  touches_paths?: string[];
  estimated_tokens?: number;
  executor: ExecutorSpec;
}

export interface Plan {
  id: string;
  task: string;
  estimated_cost_usd?: number;
  notes?: string | null;
  nodes: TaskNode[];
}

export interface PlanEdit {
  node_id: string;
  patch: {
    title?: string;
    description?: string;
    executor?: ExecutorSpec;
    depends_on?: string[];
    success_criteria?: string[];
  };
}

export type WorkspaceSource =
  | { kind: 'git'; url: string }
  | { kind: 'upload'; upload_id: string };

// ---------- command payloads ----------

export interface SetModeData {
  chatid: string;
  mode: ChatMode;
}

export interface ApprovePlanData {
  chatid: string;
  plan_id: string;
}

export interface RevisePlanData {
  chatid: string;
  plan_id: string;
  edits: PlanEdit[];
}

export interface SkipTaskData {
  chatid: string;
  plan_id: string;
  task_id: string;
}

export interface CancelData {
  chatid: string;
}

export interface AttachWorkspaceData {
  chatid: string;
  source: WorkspaceSource;
}

// ---------- update payloads ----------

// Per the doc the server uses `conversation_id`; client treats it as `chatid`.
// Keep both names so we can accept either without breakage.
interface ConvoRef {
  conversation_id: string;
  chatid?: string;
}

export interface ThoughtChunk {
  chatid: string;
  sender: string;
  timestamp: number;
  content: string;
}

export interface ToolCallStart {
  chatid: string;
  sender: string;
  call_id: string;
  tool: string;
  args: unknown;
}

export interface ToolCallEnd {
  chatid: string;
  sender: string;
  call_id: string;
  summary?: string;
  content: unknown;
}

export interface SeatAttribution {
  chatid: string;
  sender: string;
  display_name: string;
  color_hint?: string;
}

export interface RoundtableTurn extends ConvoRef {
  seat: string;
  round: number;
  text_chunk: string;
  done: boolean;
}

export interface RoundtableSummary extends ConvoRef {
  round: number;
  anonymized_summary: string;
}

export interface PlanProposed extends ConvoRef {
  plan: Plan;
}

export interface PlanPendingApproval extends ConvoRef {
  plan: Plan;
  reason: string;
  suggested_cap_usd?: number;
}

export interface PlanApproved extends ConvoRef {
  plan_id: string;
  approver: 'auto' | 'human';
}

export interface TaskDispatched extends ConvoRef {
  task_id: string;
  worktree_path: string;
}

export type ExecutorEventKind =
  | 'system_prompt'
  | 'message'
  | 'thought'
  | 'tool_call_start'
  | 'tool_call_end'
  | 'error'
  | 'done'
  | 'aborted';

export interface ExecutorEventPayloadMap {
  system_prompt: { text: string };
  message: { text: string };
  thought: { text: string };
  tool_call_start: {
    call_id: string;
    tool: string;
    args: unknown;
    summary?: string;
  };
  tool_call_end: { call_id: string; content: unknown; summary?: string };
  error: { type: string; message: string };
  done: Record<string, never>;
  aborted: { reason: string };
}

export interface ExecutorEvent<K extends ExecutorEventKind = ExecutorEventKind>
  extends ConvoRef {
  task_id: string;
  kind: K;
  payload: ExecutorEventPayloadMap[K];
}

export interface TaskCompleted extends ConvoRef {
  task_id: string;
  success: boolean;
  summary: string;
}

export interface MergeConflict extends ConvoRef {
  task_id: string;
  paths: string[];
  resolution_strategy: string;
}

export type Verdict = 'pass' | 'loop' | 'fail';

export interface RoundtableVerdict extends ConvoRef {
  verdict: Verdict;
  reason: string;
}
