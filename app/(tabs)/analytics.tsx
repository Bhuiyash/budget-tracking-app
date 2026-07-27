import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { CategoryPieCard } from "@/components/analytics/CategoryPieCard";
import { withInferredCategories } from "@/components/analytics/inferCategory";
import { generateInsights } from "@/components/analytics/insights";
import { InsightsCard } from "@/components/analytics/InsightsCard";
import { OverviewCard } from "@/components/analytics/OverviewCard";
import { RecommendationsCard } from "@/components/analytics/RecommendationsCard";
import { EmptyState, Screen } from "@/components/ui";
import { getCategoryMeta } from "@/constants/categories";
import { useExpenses } from "@/hooks/useExpenses";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { filterCurrentMonth, groupByCategory, sumAmounts } from "@/utils/expenseStats";
import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Staggered fade/slide-in used once per mount for the sections below —
// matches the exact pattern used across Dashboard/Budget/All Expenses.
function stagger(index: number) {
  return FadeInDown.delay(index * 70).duration(400).springify().damping(16);
}

export default function AnalyticsScreen() {
  const { data: expenses, isLoading } = useExpenses();

  // Fill in a guessed category for legacy rows that predate category
  // tracking, before any grouping/totals are derived.
  const categorizedExpenses = useMemo(() => withInferredCategories(expenses ?? []), [expenses]);

  // This screen intentionally shows an ALL-TIME total/breakdown (unlike the
  // Dashboard, which is scoped to the current month) — that's an existing,
  // correct design choice.
  const totalExpense = useMemo(() => sumAmounts(categorizedExpenses), [categorizedExpenses]);

  const categoryTotals = useMemo(() => groupByCategory(categorizedExpenses), [categorizedExpenses]);

  const pieData = useMemo(
    () =>
      categoryTotals.map((item) => ({
        ...item,
        color: getCategoryMeta(item.category).color,
      })),
    [categoryTotals]
  );

  const monthTotal = useMemo(
    () => sumAmounts(filterCurrentMonth(categorizedExpenses)),
    [categorizedExpenses]
  );

  const insights = useMemo(
    () => generateInsights(categoryTotals, totalExpense, categorizedExpenses.length, monthTotal),
    [categoryTotals, totalExpense, categorizedExpenses.length, monthTotal]
  );

  if (isLoading) {
    return (
      <Screen scroll>
        <AnalyticsSkeleton />
      </Screen>
    );
  }

  const hasExpenses = categorizedExpenses.length > 0;

  return (
    <Screen scroll>
      <Animated.View entering={stagger(0)}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Your all-time spending breakdown</Text>
      </Animated.View>

      {!hasExpenses ? (
        <EmptyState />
      ) : (
        <>
          <Animated.View entering={stagger(1)} style={styles.section}>
            <OverviewCard total={totalExpense} count={categorizedExpenses.length} />
          </Animated.View>

          <Animated.View entering={stagger(2)} style={styles.section}>
            <CategoryPieCard data={pieData} total={totalExpense} />
          </Animated.View>

          <Animated.View entering={stagger(3)} style={styles.section}>
            <InsightsCard insights={insights} />
          </Animated.View>

          <Animated.View entering={stagger(4)}>
            <RecommendationsCard />
          </Animated.View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
});
