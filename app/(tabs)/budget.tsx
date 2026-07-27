import { BudgetRing } from "@/components/budget/BudgetRing";
import { BudgetSkeleton } from "@/components/budget/BudgetSkeleton";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";
import { TipsCard } from "@/components/budget/TipsCard";
import { WarningBanner } from "@/components/budget/WarningBanner";
import { Button, Card, Screen } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { filterCurrentMonth, sumAmounts } from "@/utils/expenseStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const BUDGET_STORAGE_KEY = "monthlyBudget";

// Staggered fade/slide-in used once per mount for the sections below —
// matches the exact pattern dashboard.tsx uses for visual consistency
// across screens.
function stagger(index: number) {
  return FadeInDown.delay(index * 70).duration(400).springify().damping(16);
}

export default function BudgetScreen() {
  const { data: expenses, isLoading } = useExpenses();
  const [monthlyBudget, setMonthlyBudget] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const loadBudget = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
      if (saved) setMonthlyBudget(saved);
    } catch (error) {
      console.error("Failed to load budget:", error);
    }
  }, []);

  // Re-read on focus so editing the budget on the Dashboard's savings/goal
  // flow (or a future entry point) stays reflected here without a second
  // competing source of truth — same convention dashboard.tsx uses for the
  // same AsyncStorage key.
  useFocusEffect(
    useCallback(() => {
      loadBudget();
    }, [loadBudget])
  );

  const monthExpenses = useMemo(() => filterCurrentMonth(expenses ?? []), [expenses]);
  const totalSpent = useMemo(() => sumAmounts(monthExpenses), [monthExpenses]);
  const budgetValue = monthlyBudget ? parseFloat(monthlyBudget) : null;

  const handleSaveBudget = async (value: string) => {
    try {
      await AsyncStorage.setItem(BUDGET_STORAGE_KEY, value);
      setMonthlyBudget(value);
      setIsEditing(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Failed to save budget:", error);
      Alert.alert("Error", "Failed to save budget. Please try again.");
    }
  };

  const currentMonth = useMemo(
    () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    []
  );

  if (isLoading) {
    return (
      <Screen scroll>
        <BudgetSkeleton />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Animated.View entering={stagger(0)}>
        <Text style={styles.title}>Budget Tracker</Text>
        <Text style={styles.subtitle}>{currentMonth}</Text>
      </Animated.View>

      <Animated.View entering={stagger(1)}>
        <Card variant="surface" style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.cardTitle}>Monthly Budget</Text>
            <Pressable style={styles.editButton} onPress={() => setIsEditing(true)} hitSlop={8}>
              <Ionicons name="pencil" size={18} color={colors.primary} />
            </Pressable>
          </View>

          {budgetValue ? (
            <Text style={styles.budgetAmount}>₹{budgetValue.toLocaleString()}</Text>
          ) : (
            <Button label="Set Monthly Budget" onPress={() => setIsEditing(true)} />
          )}
        </Card>
      </Animated.View>

      <Animated.View entering={stagger(2)}>
        <BudgetRing spent={totalSpent} budget={budgetValue} />
      </Animated.View>

      <Animated.View entering={stagger(3)}>
        <WarningBanner spent={totalSpent} budget={budgetValue} />
      </Animated.View>

      <Animated.View entering={stagger(4)}>
        <TipsCard />
      </Animated.View>

      <EditBudgetDialog
        visible={isEditing}
        currentBudget={monthlyBudget}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveBudget}
      />
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
  budgetCard: {
    marginBottom: spacing.lg,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMutedBg,
    alignItems: "center",
    justifyContent: "center",
  },
  budgetAmount: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.black,
    color: colors.primary,
    textAlign: "center",
  },
});
