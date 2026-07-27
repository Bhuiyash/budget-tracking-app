import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { getBudgetStatus, type BudgetStatus } from "@/utils/budgetStatus";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface WarningBannerProps {
  spent: number;
  budget: number | null;
}

const ICON_BY_STATUS: Record<BudgetStatus, string> = {
  success: "checkmark-circle-outline",
  warning: "alert-outline",
  caution: "alert-circle-outline",
  danger: "warning-outline",
};

// Persistent inline card — replaces the old interruptive warning Modal,
// which re-fired setShowWarningModal(true) from a useEffect on every
// totalSpent change while already over a threshold, so it kept popping back
// up and interrupting the user again just because they logged another
// expense. This is a plain conditional render driven by getBudgetStatus
// (the single source of truth for thresholds): visible whenever status is
// warning/caution/danger, gone otherwise, no dismiss state to fight with.
export function WarningBanner({ spent, budget }: WarningBannerProps) {
  if (!budget) return null;

  const { status, color, percentage } = getBudgetStatus(spent, budget);
  if (status === "success") return null;

  const remaining = budget - spent;

  const copy = {
    warning: {
      title: `${Math.round(percentage)}% used`,
      description: `₹${Math.round(remaining).toLocaleString()} remaining this month. Keep an eye on your spending.`,
    },
    caution: {
      title: "Almost at your limit",
      description: `Only ₹${Math.round(remaining).toLocaleString()} left (${Math.max(0, 100 - percentage).toFixed(1)}% remaining).`,
    },
    danger: {
      title: `Budget exceeded by ₹${Math.round(Math.abs(remaining)).toLocaleString()}`,
      description: "You've spent more than your monthly budget. Consider reviewing your expenses.",
    },
  }[status];

  return (
    <Card variant="elevated" style={[styles.card, { borderColor: color }]}>
      <View style={styles.header}>
        <Ionicons name={ICON_BY_STATUS[status] as any} size={22} color={color} />
        <Text style={[styles.title, { color }]}>{copy.title}</Text>
      </View>
      <Text style={styles.description}>{copy.description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.textSubtle,
    lineHeight: 20,
  },
});
