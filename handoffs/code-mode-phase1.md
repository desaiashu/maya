# Code mode — Phase 1 handoff

Phase-1 protocol wiring for Maya's code mode is in. Engine work and richer UI
rendering are pending. This doc tells the next agent what's landed, where it
lives, and what to pick up next.

Source of truth for the wire protocol: `CLIENT_API.md` (in `~/Downloads`, also
mirrored where the server agent is working). The workspace-management section
was added in this session — see "Spec changes (handed to server)" below.

## What landed

### Types

- `src/data/types/code.tsx` — new file, all code-mode types live here so the
  pydantic-generated `types.tsx` isn't clobbered on regen.
- Re-exported from `src/data/types/index.tsx`.
- Includes: `ChatMode`, `CodeWSRequest`, `CodeWSUpdate`, `Plan`, `TaskNode`,
  `ExecutorSpec`, `PlanEdit`, `WorkspaceSource`, command payloads
  (`SetModeData`, `ApprovePlanData`, ...), update payloads (`RoundtableTurn`,
  `PlanProposed`, `ExecutorEvent`, ...), `ExecutorEventKind` and
  `ExecutorEventPayloadMap`.

### State

- `src/data/slices/code.tsx` — new slice. Folded into the combined `State` in
  `src/data/utils/state.tsx`.
- App-level `viewMode: 'chat' | 'code'` + `setViewMode`.
- Per-`chatid` records: `plans`, `pendingApprovals`, `tasks`, `turns`,
  `summaries`, `executorEvents` (keyed by `chatid` then `task_id`),
  `conflicts`, `verdicts`, `seats`.
- Applier methods for each new update type (`applyPlanProposed`,
  `applyRoundtableTurn`, etc.).
- `clearCodeState(chatid)` resets per-chat state.
- Roundtable turn coalescing: chunks for the same `(round, seat)` accumulate
  into one `TurnEntry` until `done`.

### Dispatch

- `src/data/server/socket.tsx` — dispatch table widened to `WSUpdate |
  CodeWSUpdate`. New handlers wired for: `thought_chunk`, `tool_call_start`,
  `tool_call_end`, `seat_attribution`, `roundtable_turn`,
  `roundtable_summary`, `plan_proposed`, `plan_pending_approval`,
  `plan_approved`, `task_dispatched`, `executor_event`, `task_completed`,
  `merge_conflict`, `roundtable_verdict`.
- `src/data/server/updates.tsx` — handler methods on `ClientUpdate`. Most
  forward into the code slice. `thought_chunk` / `tool_call_*` log only
  (UI hookup is deferred to the polish pass).

### Client commands

- `src/data/server/requests.tsx` — added: `setMode`, `approvePlan`,
  `revisePlan`, `skipTask`, `cancelRun`, `attachWorkspace`.
- Note: `MayaRequest.command` is auto-generated from pydantic and only types
  `WSRequest`. New code-mode commands use a `cmd()` cast helper at the
  boundary. Once the server-side pydantic models include the new commands
  and `types.tsx` regenerates, drop the cast.

### UI

- **Drawer** (`src/views/drawer.tsx`)
  - "Chats" / "Code" toggle in the drawer header.
  - Chat list filters by `protocol === 'roundtable'` when in code mode.
  - "New Code Chat" footer item was removed; compose now creates the right
    protocol based on `viewMode`.
- **Chat header** (`src/views/chat/screens/chat.tsx`)
  - Compose button picks `newCodeChat()` vs `newCommunityChat()` based on
    `viewMode`.
  - On entering a roundtable chat, `server.setMode(chatid, 'code')` fires
    once (idempotent).
- **CodePanel** (`src/views/chat/components/code/panel.tsx`)
  - Renders above the input toolbar for roundtable chats.
  - Shows: roundtable turns + summaries, plan (with Approve / Cancel when
    pending), task statuses, merge conflicts, verdict.
  - Intentionally minimal — text-only rendering. Polish pending.
- **Helpers** (`src/data/utils/funx.tsx`)
  - `emptyChat(protocol?)` now takes an optional protocol; defaults to `maya`.
  - `newCodeChat()` creates a roundtable chat.
  - `emptyChat` uses topic `'new chat'` regardless of protocol so the
    `_new chat` drawer route resolves on compose.

### Spec changes (handed to server)

In `CLIENT_API.md`:

- New commands: `list_workspaces`, `create_workspace`, `delete_workspace`.
  Widened `attach_workspace.source` to `WorkspaceRef`.
- New updates: `workspaces`, `workspace_attached`.
- New data models: `Workspace`, `WorkspaceRef`.
- New REST endpoints: `GET /api/workspaces`, `POST /api/workspaces`,
  `DELETE /api/workspaces/{workspace_id}`,
  `POST /api/conversations/{id}/attach_workspace`.
- Conversation lifecycle step 2 updated to reference `WorkspaceRef`.
- Phase availability rows added for the new workspace surfaces.

Note: four of the six edits landed automatically; the two table edits
(commands and updates) were blocked by the permission classifier because
the spec file is in `~/Downloads`. The full diff was handed to the user to
relay to the server agent.

## What's left

### Verify

- `npm install && npx tsc --noEmit` — wasn't runnable in the worktree shell.
- Visual smoke test on a simulator: drawer toggle, compose, CodePanel on a
  roundtable chat.
- Drive Phase-1 stub events through the WS once the server has them — confirm
  each update lands in the slice and renders.

### Polish (waiting on real events to render against)

- **Tool-call card** — opens on `tool_call_start`, closes on matching
  `call_id` in `tool_call_end`. Right now just a log line.
- **Collapsible thoughts** — fold `thought_chunk` and
  `executor_event kind=thought` under an expandable section.
- **Executor event log per task** — expand a task row to see its event stream
  with proper formatting per `kind`.
- **Plan revise UI** — currently approve / cancel only. Need an edit flow that
  sends `revise_plan`.
- **Per-task skip button** in the plan card → `server.skipTask(...)`.
- **Seat attribution** — use `display_name` + `color_hint` from
  `seat_attribution` to label / color roundtable turns. Right now turns show
  raw `seat` strings.
- **Verdict banner styling** — pass / fail / loop currently render with the
  same border. Should be visually distinct.

### Workspace UI (new surfaces from the spec changes)

- Add handlers for `workspaces` and `workspace_attached` updates.
- Add `server.listWorkspaces()`, `createWorkspace(name?, source)`,
  `deleteWorkspace(workspace_id)` client helpers.
- Decide where to cache the workspace list — extend the code slice or add
  a small `workspaces` slice. State should be app-wide, not per-chat.
- Attach-workspace sheet UI: paste git URL at top + list of existing
  workspaces below. Tap a workspace → `attach_workspace { workspace_id }`.
  Paste URL → `attach_workspace { kind: "git", url }` (server auto-creates).

### Cross-cutting

- Drop the `cmd()` cast helper in `requests.tsx` once the pydantic models
  regenerate `types.tsx` with the new commands.
- Drop the inconsistency between `chatid` (client) and `conversation_id`
  (server) — currently the slice accepts either via the `convo()` helper
  in `code.tsx`. Worth aligning eventually.

## Conventions worth keeping

- New types go in `code.tsx`, not `types.tsx` (which is auto-generated).
- New protocol surfaces are additive — never rename existing fields without
  a major version bump.
- `executor_event` chunks attribute to a sub-agent (`task_id`), not a seat.
- Older clients should ignore unrecognized update `type`s, not error out.

## Pointers

- API doc: `~/Downloads/CLIENT_API.md` (with the workspace addendum)
- Slice: `src/data/slices/code.tsx`
- Types: `src/data/types/code.tsx`
- Dispatch table: `src/data/server/socket.tsx` (constructor)
- Update handlers: `src/data/server/updates.tsx`
- Command helpers: `src/data/server/requests.tsx`
- Panel: `src/views/chat/components/code/panel.tsx`
- Mode toggle: `src/views/drawer.tsx` (`CustomDrawer` header)
