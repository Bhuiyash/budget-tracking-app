import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { sheet_api_url } from "../constants/api";

interface ExpenseItem {
  date: string;
  expense: string;
  amount: string;
  category?: string;
}

export default function BudgetScreen() {
  const [monthlyBudget, setMonthlyBudget] = useState<string>("");
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningType, setWarningType] = useState<"warning" | "danger" | "exceeded">("warning");

  // Load saved budget on component mount
  const loadBudget = async () => {
    try {
      const savedBudget = await AsyncStorage.getItem("monthlyBudget");
      if (savedBudget) {
        setMonthlyBudget(savedBudget);
      }
    } catch (error) {
      console.error("Failed to load budget:", error);
    }
  };

  // Save budget to AsyncStorage
  const saveBudget = async (budget: string) => {
    try {
      await AsyncStorage.setItem("monthlyBudget", budget);
    } catch (error) {
      console.error("Failed to save budget:", error);
      Alert.alert("Error", "Failed to save budget");
    }
  };

  // Fetch current month expenses
  const fetchCurrentMonthExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(sheet_api_url);
      const expenses: ExpenseItem[] = await response.json();

      // Get current month expenses
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const thisMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      const total = thisMonthExpenses.reduce(
        (sum, expense) => sum + (parseFloat(expense.amount) || 0),
        0
      );

      setTotalSpent(total);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining budget and check warnings
  useEffect(() => {
    if (monthlyBudget) {
      const budget = parseFloat(monthlyBudget);
      const remaining = budget - totalSpent;
      setRemainingBudget(remaining);

      // Check for warnings
      const spentPercentage = (totalSpent / budget) * 100;
      
      if (spentPercentage >= 100) {
        setWarningType("exceeded");
        setShowWarningModal(true);
      } else if (spentPercentage >= 90) {
        setWarningType("danger");
        setShowWarningModal(true);
      } else if (spentPercentage >= 75) {
        setWarningType("warning");
        setShowWarningModal(true);
      }
    }
  }, [monthlyBudget, totalSpent]);

  // Handle budget edit
  const handleEditBudget = () => {
    setTempBudget(monthlyBudget);
    setIsEditing(true);
  };

  const handleSaveBudget = () => {
    if (!tempBudget || isNaN(parseFloat(tempBudget)) || parseFloat(tempBudget) <= 0) {
      Alert.alert("Invalid Budget", "Please enter a valid budget amount");
      return;
    }

    setMonthlyBudget(tempBudget);
    saveBudget(tempBudget);
    setIsEditing(false);
    Alert.alert("Success", "Monthly budget updated successfully!");
  };

  const handleCancelEdit = () => {
    setTempBudget("");
    setIsEditing(false);
  };

  // Get warning color and message
  const getWarningInfo = () => {
    if (!monthlyBudget) return null;
    
    const budget = parseFloat(monthlyBudget);
    const spentPercentage = (totalSpent / budget) * 100;
    
    if (spentPercentage >= 100) {
      return {
        color: "#ef4444",
        bgColor: "#fef2f2",
        icon: "warning",
        message: "Budget Exceeded!",
        description: `You've exceeded your budget by ₹${Math.abs(remainingBudget).toLocaleString()}`
      };
    } else if (spentPercentage >= 90) {
      return {
        color: "#f97316",
        bgColor: "#fff7ed",
        icon: "alert-circle",
        message: "Danger Zone!",
        description: `Only ₹${remainingBudget.toLocaleString()} left (${(100 - spentPercentage).toFixed(1)}%)`
      };
    } else if (spentPercentage >= 75) {
      return {
        color: "#f59e0b",
        bgColor: "#fffbeb",
        icon: "alert",
        message: "Warning!",
        description: `75% of budget used. ₹${remainingBudget.toLocaleString()} remaining`
      };
    }
    
    return null;
  };

  const warningInfo = getWarningInfo();

  useFocusEffect(
    React.useCallback(() => {
      loadBudget();
      fetchCurrentMonthExpenses();
    }, [])
  );

  useEffect(() => {
    loadBudget();
  }, []);

  const currentMonth = new Date().toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });

  const spentPercentage = monthlyBudget ? (totalSpent / parseFloat(monthlyBudget)) * 100 : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading budget data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>💰 Budget Tracker</Text>
        <Text style={styles.subtitle}>{currentMonth}</Text>

        {/* Monthly Budget Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.cardTitle}>Monthly Budget</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditBudget}
            >
              <Ionicons name="pencil" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {monthlyBudget ? (
            <Text style={styles.budgetAmount}>₹{parseFloat(monthlyBudget).toLocaleString()}</Text>
          ) : (
            <TouchableOpacity
              style={styles.setBudgetButton}
              onPress={handleEditBudget}
            >
              <Text style={styles.setBudgetText}>Set Monthly Budget</Text>
            </TouchableOpacity>
          )}
        </View>

        {monthlyBudget && (
          <>
            {/* Spending Overview */}
            <View style={styles.overviewCard}>
              <Text style={styles.cardTitle}>Spending Overview</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(spentPercentage, 100)}%`,
                        backgroundColor: spentPercentage >= 90 ? "#ef4444" : 
                                       spentPercentage >= 75 ? "#f97316" :
                                       spentPercentage >= 50 ? "#f59e0b" : "#10b981"
                      }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {spentPercentage.toFixed(1)}% used
                </Text>
              </View>

              <View style={styles.amountRow}>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Spent</Text>
                  <Text style={[styles.amountValue, { color: "#ef4444" }]}>
                    ₹{totalSpent.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Remaining</Text>
                  <Text style={[
                    styles.amountValue, 
                    { color: remainingBudget >= 0 ? "#10b981" : "#ef4444" }
                  ]}>
                    ₹{Math.abs(remainingBudget).toLocaleString()}
                    {remainingBudget < 0 && " over"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Warning Card */}
            {warningInfo && (
              <View style={[styles.warningCard, { backgroundColor: warningInfo.bgColor }]}>
                <View style={styles.warningHeader}>
                  <Ionicons 
                    name={warningInfo.icon as any} 
                    size={24} 
                    color={warningInfo.color} 
                  />
                  <Text style={[styles.warningTitle, { color: warningInfo.color }]}>
                    {warningInfo.message}
                  </Text>
                </View>
                <Text style={styles.warningDescription}>
                  {warningInfo.description}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.cardTitle}>💡 Budget Tips</Text>
          <Text style={styles.tipText}>• Track expenses daily for better control</Text>
          <Text style={styles.tipText}>• Set aside 20% for savings</Text>
          <Text style={styles.tipText}>• Review and adjust budget monthly</Text>
          <Text style={styles.tipText}>• Use the 50/30/20 rule (needs/wants/savings)</Text>
        </View>
      </View>

      {/* Edit Budget Modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Monthly Budget</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Budget Amount (₹)</Text>
              <TextInput
                style={styles.budgetInput}
                value={tempBudget}
                onChangeText={setTempBudget}
                placeholder="Enter your monthly budget"
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveBudget}
              >
                <Text style={styles.saveButtonText}>Save Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Warning Modal */}
      <Modal
        visible={showWarningModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            {warningInfo && (
              <>
                <View style={styles.alertHeader}>
                  <Ionicons 
                    name={warningInfo.icon as any} 
                    size={48} 
                    color={warningInfo.color} 
                  />
                  <Text style={[styles.alertTitle, { color: warningInfo.color }]}>
                    {warningInfo.message}
                  </Text>
                  <Text style={styles.alertDescription}>
                    {warningInfo.description}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.alertButton, { backgroundColor: warningInfo.color }]}
                  onPress={() => setShowWarningModal(false)}
                >
                  <Text style={styles.alertButtonText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "#3b82f6",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },
  budgetCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  budgetAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: "#3b82f6",
    textAlign: "center",
  },
  setBudgetButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  setBudgetText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  overviewCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#334155",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  amountItem: {
    flex: 1,
    alignItems: "center",
  },
  amountLabel: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  warningCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
  warningDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  tipText: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  budgetInput: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    backgroundColor: "#f9fafb",
    color: "#1f2937",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  alertModal: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    width: "85%",
    maxWidth: 350,
    alignItems: "center",
  },
  alertHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  alertDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  alertButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  alertButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
