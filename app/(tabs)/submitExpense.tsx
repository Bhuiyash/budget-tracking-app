import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BudgetLogo from "../../components/BudgetLogo";
import { sheet_api_url } from "../constants/api";

export default function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "transport", label: "🚗 Transport", icon: "🚗" },
    { id: "grocery", label: "🛒 Grocery", icon: "🛒" },
    { id: "miscellaneous", label: "📦 Miscellaneous", icon: "📦" },
    { id: "travel", label: "✈️ Travel", icon: "✈️" },
  ];

  const handleSubmit = async () => {
    if (!expense || !amount || !category || isNaN(Number(amount))) {
      Alert.alert("Validation Error", "Please fill all fields with valid data.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    setLoading(true);
    const expenseObj = {
      date: formattedDate,
      expense: expense.trim(),
      amount: amount.trim(),
      category: category,
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
      setCategory("");
      Alert.alert("Success", "Expense saved to your Google Sheet!");
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Error", "Failed to save expense.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BudgetLogo size="large" showText={true} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Add New Expense</Text>
            <Text style={styles.subtitle}>Track your spending easily</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📅 Select Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
            </TouchableOpacity>
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lunch at restaurant"
              value={expense}
              onChangeText={setExpense}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>💰 Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🏷️ Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    category === cat.id && styles.categorySelected,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <View style={styles.radioButton}>
                    {category === cat.id && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.categoryText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Saving expense...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, (!expense || !amount || !category) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading || !expense || !amount || !category}
            >
              <Text style={styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 30,
  },
  headerText: {
    alignItems: "center",
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 8,
    textShadowColor: "rgba(59, 130, 246, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 28,
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
  inputGroup: {
    marginBottom: 26,
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButton: {
    backgroundColor: "#6366f1",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  dateButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoryContainer: {
    gap: 14,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categorySelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#94a3b8",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.2,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    marginTop: 10,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 17,
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  submitButton: {
    backgroundColor: "#10b981",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0,
    elevation: 0,
    borderColor: "transparent",
  },
  submitButtonText: {
    color: "white",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
