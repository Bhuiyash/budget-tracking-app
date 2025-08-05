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
} from "react-native";

export default function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [loading,setLoading]=useState(false);

    const handleSubmit = async () => {
    if (!expense || !amount || isNaN(Number(amount))) {
      Alert.alert("Validation Error", "Please enter valid expense and amount.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    setLoading(true);
    const expenseObj={
          date: formattedDate,
          expense: expense.trim(),
          amount: amount.trim(),
        };
    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbw7411FrzL256DaqqWZZkrpEWQYga23S_XzWKDNHOtBbrFMnz1_XrgSteq_-5GLTCSj/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseObj),
      });
      // const text = await res.text();
      // console.log(text);
      setLoading(false);
      setAmount("");
      setExpense("");
      Alert.alert("Success", "Expense saved to your google sheet!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save expense.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Tracker</Text>

      <Text>Date:</Text>
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

      <Text>Expense:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Groceries"
        value={expense}
        onChangeText={setExpense}
      />

      <Text>Amount:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 500"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} disabled={loading} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
});
