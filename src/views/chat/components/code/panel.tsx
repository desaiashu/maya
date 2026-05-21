import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { State, useStore, server, analytics } from '@/data';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Button } from '@/ui/atoms';

// Phase-1 code-mode panel. Renders plan / pending approval / turns / tasks /
// executor-event counts / verdict for a single chat. Stub UX — polish later.

interface CodePanelProps {
  chatid: string;
}

const CodePanel: React.FC<CodePanelProps> = ({ chatid }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const {
    plan,
    pending,
    tasks,
    turns,
    summaries,
    executorEvents,
    conflicts,
    verdict,
  } = useStore((state: State) => ({
    plan: state.plans[chatid],
    pending: state.pendingApprovals[chatid],
    tasks: state.tasks[chatid] || {},
    turns: state.turns[chatid] || [],
    summaries: state.summaries[chatid] || [],
    executorEvents: state.executorEvents[chatid] || {},
    conflicts: state.conflicts[chatid] || [],
    verdict: state.verdicts[chatid],
  }));

  const hasAnything =
    !!plan ||
    !!pending ||
    Object.keys(tasks).length > 0 ||
    turns.length > 0 ||
    summaries.length > 0 ||
    Object.keys(executorEvents).length > 0 ||
    conflicts.length > 0 ||
    !!verdict;

  if (!hasAnything) {
    return (
      <View style={styles.empty}>
        <Words tag="small" style={styles.muted}>
          code mode — send a task to begin
        </Words>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {turns.length > 0 && (
        <View style={styles.section}>
          <Words tag="h5" style={styles.heading}>
            Roundtable
          </Words>
          {turns.map((t, i) => (
            <View key={`${t.round}-${t.seat}-${i}`} style={styles.row}>
              <Words tag="small" style={styles.muted}>
                R{t.round} · {t.seat}
                {t.done ? '' : ' …'}
              </Words>
              <Words tag="body">{t.content}</Words>
            </View>
          ))}
          {summaries.map(s => (
            <View key={`summary-${s.round}`} style={styles.row}>
              <Words tag="small" style={styles.muted}>
                R{s.round} summary
              </Words>
              <Words tag="body">{s.anonymized_summary}</Words>
            </View>
          ))}
        </View>
      )}

      {plan && (
        <View style={styles.section}>
          <Words tag="h5" style={styles.heading}>
            Plan {pending ? '(awaiting approval)' : ''}
          </Words>
          <Words tag="body" style={styles.muted}>
            {plan.task}
          </Words>
          {plan.estimated_cost_usd != null && (
            <Words tag="small" style={styles.muted}>
              est. ${plan.estimated_cost_usd.toFixed(2)}
            </Words>
          )}
          {plan.nodes.map(node => (
            <View key={node.id} style={styles.taskNode}>
              <Words tag="small" style={styles.muted}>
                {node.id}
                {node.depends_on.length > 0
                  ? ` ← ${node.depends_on.join(', ')}`
                  : ''}
              </Words>
              <Words tag="body">{node.title}</Words>
            </View>
          ))}
          {pending && (
            <View style={styles.actionsRow}>
              <Words tag="small" style={styles.muted}>
                {pending.reason}
                {pending.suggested_cap_usd != null
                  ? ` · cap $${pending.suggested_cap_usd}`
                  : ''}
              </Words>
              <View style={styles.actionsButtons}>
                <Button
                  title="Approve"
                  tag="small"
                  onPress={() => {
                    server.approvePlan(chatid, plan.id);
                    analytics.track('plan_approve');
                  }}
                />
                <Button
                  title="Cancel"
                  tag="small"
                  outlined
                  onPress={() => {
                    server.cancelRun(chatid);
                    analytics.track('plan_cancel');
                  }}
                />
              </View>
            </View>
          )}
        </View>
      )}

      {Object.keys(tasks).length > 0 && (
        <View style={styles.section}>
          <Words tag="h5" style={styles.heading}>
            Tasks
          </Words>
          {Object.entries(tasks).map(([taskId, status]) => {
            const events = executorEvents[taskId] || [];
            return (
              <View key={taskId} style={styles.taskNode}>
                <Words tag="small" style={styles.muted}>
                  {taskId} · {status.state}
                  {events.length > 0 ? ` · ${events.length} events` : ''}
                </Words>
                {status.summary && <Words tag="body">{status.summary}</Words>}
              </View>
            );
          })}
        </View>
      )}

      {conflicts.length > 0 && (
        <View style={styles.section}>
          <Words tag="h5" style={styles.heading}>
            Merge conflicts
          </Words>
          {conflicts.map((c, i) => (
            <Words key={i} tag="small" style={styles.muted}>
              {c.task_id} · {c.paths.join(', ')} · {c.resolution_strategy}
            </Words>
          ))}
        </View>
      )}

      {verdict && (
        <View
          style={[
            styles.section,
            styles.verdict,
            verdict.verdict === 'pass'
              ? styles.verdictPass
              : verdict.verdict === 'fail'
                ? styles.verdictFail
                : styles.verdictLoop,
          ]}
        >
          <Words tag="h5">verdict: {verdict.verdict}</Words>
          <Words tag="body">{verdict.reason}</Words>
        </View>
      )}
    </ScrollView>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      maxHeight: 320,
      borderTopWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 12,
      gap: 12,
    },
    empty: {
      padding: 12,
      alignItems: 'center',
    },
    section: {
      gap: 4,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderColor: theme.colors.outline,
    },
    heading: {
      marginBottom: 4,
    },
    row: {
      paddingVertical: 4,
    },
    taskNode: {
      paddingVertical: 4,
    },
    muted: {
      color: theme.colors.text.secondary,
    },
    actionsRow: {
      marginTop: 8,
      gap: 6,
    },
    actionsButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    verdict: {
      padding: 8,
      borderRadius: 6,
      borderWidth: 1,
    },
    verdictPass: { borderColor: theme.colors.outline },
    verdictFail: { borderColor: theme.colors.outline },
    verdictLoop: { borderColor: theme.colors.outline },
  });

export default CodePanel;
