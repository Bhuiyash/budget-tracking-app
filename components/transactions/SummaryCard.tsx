import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface SummaryCardProps {
  total: number;
  count: number;
}

// A quieter counterpart to the Dashboard's gradient HeroCard: this is a
// running total across ALL fetched expenses (not "this month"), and is
// styled as a plain surface card rather than a gradient hero so the two
// screens don't compete for the same visual weight.
export function SummaryCard({ total, count }: SummaryCardProps) {
  return (
    <Card variant="surface" style={styles.card}>
      <View style={styles.iconChip}>
        <Ionicons name="wallet-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Total Expenses</Text>
        <Text style={styles.amount}>₹{Math.round(total).toLocaleString()}</Text>
      </View>
      <Text style={styles.count}>
        {count} {count === 1 ? "expense" : "expenses"}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMutedBg,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  count: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});
