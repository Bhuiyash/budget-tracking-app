import { Card } from "@/components/ui";
import { getCategoryMeta } from "@/constants/categories";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { Expense } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface RecentTransactionsProps {
  expenses: Expense[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  if (expenses.length === 0) return null;

  return (
    <Card variant="surface" style={styles.card}>
      <Text style={styles.title}>Recent Transactions</Text>
      <View style={styles.list}>
        {expenses.map((item, index) => {
          const meta = getCategoryMeta(item.category);
          return (
            <View key={`${item.originalIndex ?? index}-${item.date}-${item.expense}`} style={styles.row}>
              <View style={[styles.iconChip, { backgroundColor: `${meta.color}26` }]}>
                <Ionicons name={meta.icon as any} size={18} color={meta.color} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.expense}
                </Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </View>
              <Text style={styles.amount}>₹{Math.round(item.amount).toLocaleString()}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  amount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});
