import { BudgetRing } from "@/components/budget/BudgetRing";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SavingsGoalCard } from "@/components/dashboard/SavingsGoalCard";
import { EmptyState, Screen } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { filterCurrentMonth, groupByCategory, sumAmounts } from "@/utils/expenseStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Staggered fade/slide-in used once per mount for the sections below —
// spreading the delay keeps the reveal readable instead of everything
// popping in at once.
function stagger(index: number) {
  return FadeInDown.delay(index * 70).duration(400).springify().damping(16);
}

export default function DashboardScreen() {
  const { data: expenses, isLoading } = useExpenses();
  const { goal, setGoal } = useSavingsGoal();
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  // Same "monthlyBudget" AsyncStorage key budget.tsx already owns — re-read
  // on focus so editing the budget there is reflected here without a
  // second competing source of truth.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const saved = await AsyncStorage.getItem("monthlyBudget");
          if (!active) return;
          const parsed = saved ? parseFloat(saved) : NaN;
          setMonthlyBudget(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
        } catch (error) {
          console.error("Failed to load monthly budget:", error);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const monthExpenses = useMemo(() => filterCurrentMonth(expenses ?? []), [expenses]);
  const totalSpent = useMemo(() => sumAmounts(monthExpenses), [monthExpenses]);
  const topCategories = useMemo(() => groupByCategory(monthExpenses).slice(0, 4), [monthExpenses]);
  const recentExpenses = useMemo(
    () =>
      [...(expenses ?? [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [expenses]
  );

  // Savings, defined simply: whatever hasn't been spent of this month's
  // budget. There's no income/balance tracking in this app, so this is an
  // honest budget-derived estimate, not a real savings figure.
  const saved = monthlyBudget ? Math.max(0, monthlyBudget - totalSpent) : 0;

  const monthLabel = useMemo(
    () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    []
  );

  if (isLoading) {
    return (
      <Screen scroll>
        <DashboardSkeleton />
      </Screen>
    );
  }

  const hasExpenses = (expenses?.length ?? 0) > 0;

  return (
    <Screen scroll>
      <Animated.View entering={stagger(0)}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subGreeting}>Here&apos;s your spending at a glance</Text>
      </Animated.View>

      {!hasExpenses ? (
        <EmptyState />
      ) : (
        <>
          <Animated.View entering={stagger(1)} style={styles.section}>
            <HeroCard totalSpent={totalSpent} monthLabel={monthLabel} />
          </Animated.View>

          <Animated.View entering={stagger(2)}>
            <BudgetRing spent={totalSpent} budget={monthlyBudget} />
          </Animated.View>

          <Animated.View entering={stagger(3)}>
            <SavingsGoalCard goal={goal} saved={saved} onSaveGoal={setGoal} />
          </Animated.View>

          <Animated.View entering={stagger(4)}>
            <CategoryBreakdown categories={topCategories} />
          </Animated.View>

          <Animated.View entering={stagger(5)}>
            <RecentTransactions expenses={recentExpenses} />
          </Animated.View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
});
