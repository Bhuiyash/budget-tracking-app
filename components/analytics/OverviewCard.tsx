import { colors, fontSize, fontWeight, gradients, radius, shadows, spacing } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

interface OverviewCardProps {
  total: number;
  count: number;
}

// All-time totals (not month-scoped) — this screen intentionally shows the
// full spending history, unlike the Dashboard's HeroCard which is scoped to
// the current month. Visually mirrors HeroCard's gradient treatment for
// consistency with the rest of the app.
export function OverviewCard({ total, count }: OverviewCardProps) {
  return (
    <LinearGradient colors={gradients.primary} style={styles.card}>
      <Text style={styles.label}>Total Expenses</Text>
      <Text style={styles.amount}>₹{total.toLocaleString()}</Text>
      <Text style={styles.subtext}>
        {count} transaction{count === 1 ? "" : "s"}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: "center",
    ...shadows.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.primaryMuted,
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  subtext: {
    fontSize: fontSize.sm,
    color: colors.primaryMuted,
    marginTop: spacing.xs,
  },
});
