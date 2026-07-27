import { SortOption, SortSheet } from "@/components/transactions/SortSheet";
import { SummaryCard } from "@/components/transactions/SummaryCard";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { TransactionsSkeleton } from "@/components/transactions/TransactionsSkeleton";
import { EmptyState } from "@/components/ui";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { Expense } from "@/types/expense";
import { sumAmounts } from "@/utils/expenseStats";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SORT_LABELS: Record<SortOption, string> = {
  date: "Date",
  amount: "Amount",
  name: "Name",
};

function sortExpenses(data: Expense[], sortBy: SortOption): Expense[] {
  const sorted = [...data];
  switch (sortBy) {
    case "date":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case "amount":
      return sorted.sort((a, b) => b.amount - a.amount);
    case "name":
      return sorted.sort((a, b) => a.expense.localeCompare(b.expense));
    default:
      return sorted;
  }
}

export default function TableExpenseScreen() {
  const { data, isLoading, refetch, isFetching } = useExpenses();
  const deleteExpense = useDeleteExpense();
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [showSortSheet, setShowSortSheet] = useState(false);

  const expenses = data ?? [];
  const sortedExpenses = useMemo(() => sortExpenses(expenses, sortBy), [expenses, sortBy]);
  const total = useMemo(() => sumAmounts(expenses), [expenses]);

  const handleDelete = (rowIndex: number) => {
    deleteExpense.mutate(rowIndex, {
      onError: () => Alert.alert("Error", "Failed to delete expense. Please try again."),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <TransactionsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <SummaryCard total={total} count={expenses.length} />

        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortSheet(true)}>
          <Ionicons name="filter-outline" size={18} color={colors.primary} />
          <Text style={styles.sortButtonText}>Sort by {SORT_LABELS[sortBy]}</Text>
          <Ionicons name="chevron-down-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedExpenses}
        keyExtractor={(item) => String(item.originalIndex)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TransactionCard expense={item} index={index} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No expenses found"
            subtitle="Start tracking your expenses and they'll show up here."
          />
        }
      />

      <SortSheet
        visible={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        sortBy={sortBy}
        onSelect={setSortBy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primaryMutedBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryMutedBorder,
    gap: spacing.sm,
  },
  sortButtonText: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.base,
  },
  listContent: {
    padding: spacing.xl,
  },
});
