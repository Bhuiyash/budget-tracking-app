import { CardAnalyticsGrid } from "@/components/creditCards/CardAnalyticsGrid";
import { CardComparisonChart } from "@/components/creditCards/CardComparisonChart";
import { CreditCardSkeleton } from "@/components/creditCards/CreditCardSkeleton";
import { CreditCardSummaryCard } from "@/components/creditCards/CreditCardSummaryCard";
import { EmptyState } from "@/components/ui";
import { CREDIT_CARDS } from "@/constants/creditCards";
import { useCreditCardConfig } from "@/hooks/useCreditCardConfig";
import { useExpenses } from "@/hooks/useExpenses";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { getAggregateCardStats, getCardComparison, getCardSummary } from "@/utils/creditCardStats";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

function stagger(index: number) {
  return FadeInDown.delay(index * 90).duration(400).springify().damping(16);
}

export default function CreditCardsScreen() {
  const router = useRouter();
  const { data: expenses, isLoading, isFetching, refetch } = useExpenses();
  const { loading: configLoading, getConfig, saveConfig } = useCreditCardConfig();

  const cardsData = useMemo(() => {
    if (!expenses) return [];
    return CREDIT_CARDS.map((card) => {
      const config = getConfig(card.id);
      return { card, config, summary: getCardSummary(expenses, card.id, config) };
    });
  }, [expenses, getConfig]);

  const aggregateStats = useMemo(() => getAggregateCardStats(expenses ?? []), [expenses]);
  const comparison = useMemo(() => getCardComparison(expenses ?? []), [expenses]);

  if (isLoading || configLoading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <CreditCardSkeleton />
      </ScrollView>
    );
  }

  const hasAnyCardExpense = cardsData.some(({ summary }) => summary.transactionCount > 0);

  return (
    <ScrollView
      style={styles.screen}
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
        <Text style={styles.title}>Credit Cards</Text>
        <Text style={styles.subtitle}>Track spending across your cards</Text>
      </Animated.View>

      {!hasAnyCardExpense ? (
        <Animated.View entering={stagger(1)}>
          <EmptyState
            icon="card-outline"
            title="No card spending yet"
            subtitle={`Add an expense under "ICICI Coral" or "Amazon Pay ICICI" and it'll show up here.`}
            actionLabel="Add an Expense"
          />
        </Animated.View>
      ) : (
        <>
          <Animated.View entering={stagger(1)} style={styles.cardSection}>
            <CardAnalyticsGrid stats={aggregateStats} />
          </Animated.View>

          <Animated.View entering={stagger(2)} style={styles.cardSection}>
            <CardComparisonChart items={comparison} />
          </Animated.View>

          {cardsData.map(({ card, config, summary }, index) => (
            <Animated.View entering={stagger(index + 3)} key={card.id} style={styles.cardSection}>
              <CreditCardSummaryCard
                card={card}
                config={config}
                summary={summary}
                onPress={() => router.push({ pathname: "/card/[cardId]", params: { cardId: card.id } })}
                onSaveConfig={(patch) => saveConfig(card.id, patch)}
              />
            </Animated.View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
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
  cardSection: {
    marginBottom: spacing.xl,
  },
});
