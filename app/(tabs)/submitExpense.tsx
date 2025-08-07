import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { sheet_api_url } from "../../constants/api";

export default function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!expense || !amount || isNaN(Number(amount))) {
      Alert.alert("Validation Error", "Please enter valid expense and amount.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    setLoading(true);
    const expenseObj = {
      date: formattedDate,
      expense: expense.trim(),
      amount: amount.trim(),
    };

    try {
      const res = await fetch(sheet_api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseObj),
      });

      setLoading(false);
      setAmount("");
      setExpense("");
      Alert.alert("Success", "Expense saved to your Google Sheet!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save expense.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>💰 Budget Tracker</Text>
        <Text style={styles.subtitle}>Built for Bhuiyash Kumar</Text>

        <Text style={styles.label}>Select Date:</Text>
        <Button title={date.toDateString()} onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Expense Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Groceries"
          value={expense}
          onChangeText={setExpense}
        />

        <Text style={styles.label}>Amount (₹):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 500"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} disabled={loading} color="#007AFF" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f7",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  spinner: {
    marginTop: 20,
  },
});
