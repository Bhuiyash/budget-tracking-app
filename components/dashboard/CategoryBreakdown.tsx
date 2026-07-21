import { Card } from "@/components/ui";
import { getCategoryMeta } from "@/constants/categories";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { CategoryTotal } from "@/utils/expenseStats";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface CategoryBreakdownProps {
  categories: CategoryTotal[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  if (categories.length === 0) return null;

  return (
    <Card variant="surface" style={styles.card}>
      <Text style={styles.title}>Top Categories</Text>
      <View style={styles.list}>
        {categories.map((item) => {
          const meta = getCategoryMeta(item.category);
          return (
            <View key={item.category} style={styles.row}>
              <View style={[styles.iconChip, { backgroundColor: `${meta.color}26` }]}>
                <Ionicons name={meta.icon as any} size={16} color={meta.color} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {meta.label}
              </Text>
              <Text style={styles.percentage}>{item.percentage}%</Text>
              <Text style={styles.amount}>₹{Math.round(item.total).toLocaleString()}</Text>
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
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  percentage: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  amount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});
