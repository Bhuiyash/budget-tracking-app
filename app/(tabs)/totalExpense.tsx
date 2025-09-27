import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { sheet_api_url } from "../constants/api";
import { useFocusEffect } from "@react-navigation/native";

export default function TotalExpenseScreen() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchExpenses = async () => {
        setLoading(true);
        try {
          const res = await fetch(sheet_api_url);
          const data = await res.json();
          const sum = Array.isArray(data)
            ? data.reduce((acc: number, item: any) => acc + Number(item.amount || 0), 0)
            : 0;
          if (isActive) setTotal(sum);
        } catch (error) {
          if (isActive) setTotal(0);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchExpenses();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Expense</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <Text style={styles.total}>₹ {total}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  total: {
    fontSize: 32,
    color: "#2196F3",
    fontWeight: "bold",
  },
});