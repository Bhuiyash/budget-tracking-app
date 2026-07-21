import { Button } from "@/components/ui/Button";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  icon?: string; // Ionicons name
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Shared "nothing here yet" placeholder — originated on the Dashboard (no
// expenses at all) and promoted here since the All Expenses screen hits the
// exact same condition. Copy is fully overridable via props; defaults match
// the original Dashboard wording so that call site needs no changes.
export function EmptyState({
  icon = "receipt-outline",
  title = "No expenses yet",
  subtitle = "Add your first expense and this dashboard will fill in with your real spending.",
  actionLabel = "Add Your First Expense",
  onAction,
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon as any} size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Button
        label={actionLabel}
        onPress={onAction ?? (() => router.push("/submitExpense"))}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryMutedBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  button: {
    minWidth: 220,
  },
});
