import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sheet_api_url } from "../../constants/api";

type ExpenseItem = {
  date: string;
  expense: string;
  amount: string | number;
};

export default function TableExpenseScreen() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(sheet_api_url);
      const data = await res.json();
      setExpenses(data);
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
  }, []);

  useEffect(() => {
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
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={<Text style={styles.sectionTitle}>Your Expenses</Text>}
      renderItem={({ item, index }) => (
        <View
          style={[
            styles.card,
            { backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f9ff" },
          ]}
        >
          <Text style={styles.date}>{item.date}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.expense}>{item.expense}</Text>
            <View style={styles.amountBox}>
              <Text style={styles.amountText}>₹ {item.amount}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteRow(index + 2, index)}>
              {deletingIndex === index ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="red"
                  style={{ marginLeft: 12 }}
                />
              )}
            </TouchableOpacity>
          </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
    textAlign: "left",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expense: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  amountBox: {
    backgroundColor: "#e6f0ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  amountText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
