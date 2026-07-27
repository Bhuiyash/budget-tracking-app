import { CategoryPieCard } from "@/components/analytics/CategoryPieCard";
import { CardDetailsSkeleton } from "@/components/creditCards/CardDetailsSkeleton";
import { CreditCardVisual } from "@/components/creditCards/CreditCardVisual";
import { DueDateBanner } from "@/components/creditCards/DueDateBanner";
import { EditCardConfigDialog } from "@/components/creditCards/EditCardConfigDialog";
import { InsightsList } from "@/components/creditCards/InsightsList";
import { SpendBarChart } from "@/components/creditCards/SpendBarChart";
import { UtilizationRing } from "@/components/creditCards/UtilizationRing";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { EmptyState } from "@/components/ui";
import { findCardMeta } from "@/constants/creditCards";
import { useCreditCardConfig } from "@/hooks/useCreditCardConfig";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import {
  generateCardInsights,
  getCardPurchaseBreakdown,
  getCardSummary,
  getExpensesForCard,
  getMonthlyTrend,
  getWeeklySpending,
} from "@/utils/creditCardStats";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

function stagger(index: number) {
  return FadeInDown.delay(index * 80).duration(400).springify().damping(16);
}

// Outside the (tabs) group on purpose — pushed full-screen (no tab bar) from
// the Credit Cards dashboard. The root layout renders a bare <Slot/>, so
// there's no built-in header/back chrome here; this screen provides its own.
export default function CardDetailsScreen() {
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const router = useRouter();
  const card = findCardMeta(cardId);

  const { data: expenses, isLoading, isFetching, refetch } = useExpenses();
  const { loading: configLoading, getConfig, saveConfig } = useCreditCardConfig();
  const deleteExpense = useDeleteExpense();
  const [editVisible, setEditVisible] = useState(false);

  const cardExpenses = useMemo(
    () => (card && expenses ? getExpensesForCard(expenses, card.id) : []),
    [card, expenses]
  );

  const recentExpenses = useMemo(
    () =>
      [...cardExpenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8),
    [cardExpenses]
  );

  const breakdown = useMemo(
    () => (card && expenses ? getCardPurchaseBreakdown(expenses, card.id) : []),
    [card, expenses]
  );

  const monthlyTrend = useMemo(
    () => (card && expenses ? getMonthlyTrend(expenses, card.id) : []),
    [card, expenses]
  );

  const weeklySpend = useMemo(
    () => (card && expenses ? getWeeklySpending(expenses, card.id) : []),
    [card, expenses]
  );

  const config = useMemo(() => (card ? getConfig(card.id) : null), [card, getConfig]);
  const summary = useMemo(
    () => (card && expenses && config ? getCardSummary(expenses, card.id, config) : null),
    [card, expenses, config]
  );

  const insights = useMemo(
    () => (card && expenses && config ? generateCardInsights(expenses, card.id, config) : []),
    [card, expenses, config]
  );

  const handleDelete = (rowIndex: number) => {
    deleteExpense.mutate(rowIndex, {
      onError: () => Alert.alert("Error", "Failed to delete expense. Please try again."),
    });
  };

  if (!card) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="alert-circle-outline"
          title="Card not found"
          subtitle="This credit card doesn't exist."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {card.name}
        </Text>
        <TouchableOpacity onPress={() => setEditVisible(true)} hitSlop={10} style={styles.backButton}>
          <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {isLoading || configLoading || !summary || !config ? (
        <CardDetailsSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <Animated.View entering={stagger(0)}>
            <CreditCardVisual
              card={card}
              subtitle={`₹${Math.round(summary.monthlySpent).toLocaleString()} this month`}
            />
          </Animated.View>

          <Animated.View entering={stagger(1)} style={styles.section}>
            <UtilizationRing spent={summary.monthlySpent} creditLimit={config.creditLimit} />
          </Animated.View>

          <Animated.View entering={stagger(2)} style={styles.section}>
            <DueDateBanner
              cardName={card.name}
              dueDay={config.dueDay}
              onConfigure={() => setEditVisible(true)}
            />
          </Animated.View>

          <Animated.View entering={stagger(3)} style={styles.section}>
            <SpendBarChart title="Monthly Spending Trend" data={monthlyTrend} color={card.accentColor} />
          </Animated.View>

          <Animated.View entering={stagger(4)} style={styles.section}>
            <SpendBarChart title="Weekly Spending" data={weeklySpend} color={card.accentColor} />
          </Animated.View>

          {breakdown.length > 0 && (
            <Animated.View entering={stagger(5)} style={styles.section}>
              <CategoryPieCard
                data={breakdown.map((b) => ({
                  category: b.label,
                  total: b.total,
                  percentage: b.percentage,
                  color: b.color,
                  icon: b.icon,
                }))}
                total={summary.totalSpent}
              />
            </Animated.View>
          )}

          {insights.length > 0 && (
            <Animated.View entering={stagger(6)} style={styles.section}>
              <InsightsList insights={insights} />
            </Animated.View>
          )}

          <Animated.View entering={stagger(7)} style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {recentExpenses.length === 0 ? (
              <EmptyState
                icon="card-outline"
                title="No transactions yet"
                subtitle={`Expenses tagged "${card.categoryId}" will show up here.`}
              />
            ) : (
              recentExpenses.map((expense, index) => (
                <TransactionCard
                  key={expense.originalIndex ?? index}
                  expense={expense}
                  index={index}
                  onDelete={handleDelete}
                />
              ))
            )}
          </Animated.View>
        </ScrollView>
      )}

      {config && (
        <EditCardConfigDialog
          visible={editVisible}
          cardName={card.name}
          config={config}
          onClose={() => setEditVisible(false)}
          onSave={(patch) => {
            saveConfig(card.id, patch);
            setEditVisible(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});
