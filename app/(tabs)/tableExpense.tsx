import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BudgetLogo from "../../components/BudgetLogo";
import { sheet_api_url } from "../constants/api";

type ExpenseItem = {
  date: string;
  expense: string;
  amount: string | number;
  originalIndex?: number; // Track original row position
  category?: string; // For future category support
};

type SortOption = "date" | "amount" | "name";

// Helper function to format date as dd/mm/yy
function formatDateDMY(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export default function TableExpenseScreen() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [showSortModal, setShowSortModal] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);

  const sortExpenses = (data: ExpenseItem[], sortOption: SortOption) => {
    const sorted = [...data];
    switch (sortOption) {
      case "date":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "amount":
        return sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
      case "name":
        return sorted.sort((a, b) => a.expense.localeCompare(b.expense));
      default:
        return sorted;
    }
  };

  const calculateTotal = (data: ExpenseItem[]) => {
    return data.reduce((total, item) => total + Number(item.amount || 0), 0);
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(sheet_api_url);
      const data = await res.json();
      // Add original index to each item before sorting
      const dataWithIndex = data.map((item: ExpenseItem, index: number) => ({
        ...item,
        originalIndex: index + 2 // +2 because sheet rows start from 2 (after header)
      }));
      
      const sortedData = sortExpenses(dataWithIndex, sortBy);
      const total = calculateTotal(dataWithIndex);
      
      setExpenses(dataWithIndex);
      setFilteredExpenses(sortedData);
      setTotalExpense(total);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      Alert.alert("Error", "Failed to fetch expenses!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteRow = async (rowIndex: number, index: number) => {
    try {
      setDeletingIndex(index);

      const res = await fetch(sheet_api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          rowIndex,
        }),
      });

      const text = await res.text();
      console.log("Delete Response:", text);
      Alert.alert("Deleted", "Row deleted successfully.");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting row:", error);
      Alert.alert("Error", "Failed to delete row");
    } finally {
      setDeletingIndex(null);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses();
  }, [sortBy]);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    const sorted = sortExpenses(expenses, option);
    setFilteredExpenses(sorted);
    setShowSortModal(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      const sorted = sortExpenses(expenses, sortBy);
      setFilteredExpenses(sorted);
    }
  }, [sortBy, expenses]);

  // Refresh data when tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [sortBy])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.logoSection}>
          <BudgetLogo size="medium" showText={false} />
          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>💸 Expense History</Text>
            <Text style={styles.pageSubtitle}>Track your spending journey</Text>
          </View>
        </View>
        
        {/* Total Expense Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>₹{totalExpense.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="wallet-outline" size={24} color="#3b82f6" />
          </View>
        </View>

        {/* Sort Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="filter-outline" size={18} color="#3b82f6" />
            <Text style={styles.sortButtonText}>
              Sort by {sortBy === "date" ? "Date" : sortBy === "amount" ? "Amount" : "Name"}
            </Text>
            <Ionicons name="chevron-down-outline" size={16} color="#3b82f6" />
          </TouchableOpacity>
          <Text style={styles.expenseCount}>
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>
      
      <FlatList
        data={filteredExpenses}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{formatDateDMY(item.date)}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    "Delete Expense",
                    "Are you sure you want to delete this record?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteRow(item.originalIndex || index + 2, index),
                      },
                    ]
                  );
                }}
              >
                {deletingIndex === index ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#ef4444"
                  />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{item.expense}</Text>
                <Text style={styles.expenseCategory}>{item.category || "General"}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>₹{Number(item.amount).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubtext}>Start tracking your expenses!</Text>
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Expenses</Text>
              <TouchableOpacity
                onPress={() => setShowSortModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.sortOptions}>
              {[
                { key: "date", label: "Date (Latest First)", icon: "calendar-outline" },
                { key: "amount", label: "Amount (Highest First)", icon: "cash-outline" },
                { key: "name", label: "Name (A-Z)", icon: "text-outline" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    sortBy === option.key && styles.selectedSortOption,
                  ]}
                  onPress={() => handleSort(option.key as SortOption)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={sortBy === option.key ? "#3b82f6" : "#64748b"}
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === option.key && styles.selectedSortOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.key && (
                    <Ionicons name="checkmark" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#0f172a",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 16,
  },
  headerText: {
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(59, 130, 246, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  summaryCard: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b82f6",
    letterSpacing: 0.5,
  },
  summaryIcon: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  sortButtonText: {
    color: "#3b82f6",
    fontWeight: "600",
    marginHorizontal: 8,
    fontSize: 14,
  },
  expenseCount: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    padding: 20,
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateContainer: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  dateText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e40af",
    letterSpacing: 0.3,
  },
  deleteButton: {
    backgroundColor: "#fef2f2",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  expenseCategory: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  amountContainer: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  sortOptions: {
    gap: 12,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedSortOption: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "#3b82f6",
  },
  sortOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#475569",
    marginLeft: 12,
  },
  selectedSortOptionText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
