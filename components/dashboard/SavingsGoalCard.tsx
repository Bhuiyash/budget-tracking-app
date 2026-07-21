import { Button, Card, Dialog } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface SavingsGoalCardProps {
  goal: number | null;
  saved: number;
  onSaveGoal: (value: string) => Promise<boolean>;
}

// "Saved" is computed simply by the caller as max(0, monthlyBudget -
// totalSpentThisMonth) — there's no real savings/income tracking in this
// app, so this card is honest about being a budget-derived estimate rather
// than a real balance.
export function SavingsGoalCard({ goal, saved, onSaveGoal }: SavingsGoalCardProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const openEditor = () => {
    setInput(goal ? String(goal) : "");
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSaveGoal(input);
    setSaving(false);
    if (ok) setEditing(false);
  };

  const percentage = goal ? Math.min(Math.round((saved / goal) * 100), 100) : 0;

  return (
    <Card variant="surface" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconChip}>
            <Ionicons name="flag-outline" size={16} color={colors.primary} />
          </View>
          <Text style={styles.title}>Savings Goal</Text>
        </View>
        <Pressable onPress={openEditor} hitSlop={8}>
          <Ionicons name="pencil" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      {goal ? (
        <>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.savedText}>₹{Math.round(saved).toLocaleString()} saved</Text>
            <Text style={styles.goalText}>of ₹{goal.toLocaleString()}</Text>
          </View>
        </>
      ) : (
        <Pressable style={styles.emptyState} onPress={openEditor}>
          <Text style={styles.emptyText}>
            Set a savings goal to start tracking progress toward it.
          </Text>
          <Text style={styles.emptyCta}>Set a goal →</Text>
        </Pressable>
      )}

      <Dialog visible={editing} onClose={() => setEditing(false)} title="Set Savings Goal">
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Target amount (₹)"
          placeholderTextColor={colors.textSubtle}
          keyboardType="numeric"
          autoFocus
        />
        <Button label="Save Goal" onPress={handleSave} loading={saving} style={styles.saveButton} />
      </Dialog>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconChip: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMutedBg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  progressTrack: {
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  savedText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  goalText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
  },
  emptyCta: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textOnSurface,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
