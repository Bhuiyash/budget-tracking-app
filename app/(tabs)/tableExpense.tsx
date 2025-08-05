import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";

const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbyoipqP5ry5cRbdPVk54T9skSzKi8a8So5OzF11iaTl2WxeeXy0iUVTteaNtZQUQFK5/exec"; // Replace with your actual URL

type ExpenseItem = {
  date: string;
  expense: string;
  amount: string | number;
};

export default function TableExpenseScreen() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(SHEET_API_URL);
      const data = await res.json();
      setExpenses(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Expense</Text>
          <Text style={styles.headerCell}>Amount</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <View
          style={[
            styles.row,
            { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e6f2ff" },
          ]}
        >
          <Text style={styles.cell}>{item.date}</Text>
          <Text style={styles.cell}>{item.expense}</Text>
          <Text style={styles.cell}>₹ {item.amount}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerRow: {
    backgroundColor: "#007bff",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    color: "#333",
  },
});
