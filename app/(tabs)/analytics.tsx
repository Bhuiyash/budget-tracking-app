import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { sheet_api_url } from "../constants/api";

const { width } = Dimensions.get("window");

type ExpenseItem = {
  date: string;
  expense: string;
  amount: string | number;
};

type CategoryData = {
  category: string;
  total: number;
  percentage: number;
  color: string;
};

export default function AnalyticsScreen() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  // Simple category classification
  const categorizeExpense = (expense: string): string => {
    const lowerExpense = expense.toLowerCase();
    if (lowerExpense.includes("food") || lowerExpense.includes("grocery") || lowerExpense.includes("restaurant")) return "Food";
    if (lowerExpense.includes("transport") || lowerExpense.includes("fuel") || lowerExpense.includes("taxi")) return "Transport";
    if (lowerExpense.includes("entertainment") || lowerExpense.includes("movie") || lowerExpense.includes("game")) return "Entertainment";
    if (lowerExpense.includes("health") || lowerExpense.includes("medical") || lowerExpense.includes("doctor")) return "Health";
    if (lowerExpense.includes("shopping") || lowerExpense.includes("clothes") || lowerExpense.includes("shoe")) return "Shopping";
    return "Others";
  };

  const generateInsights = (data: CategoryData[], total: number, expenseCount: number) => {
    const insights: string[] = [];
    
    if (data.length > 0) {
      const topCategory = data[0];
      insights.push(`💡 You spend most on ${topCategory.category} (${topCategory.percentage}% of total)`);
      
      const avgExpense = total / expenseCount;
      insights.push(`📊 Your average expense is ₹${avgExpense.toFixed(0)}`);
      
      if (topCategory.percentage > 50) {
        insights.push(`⚠️ Consider diversifying your spending - ${topCategory.category} takes more than half your budget`);
      }
      
      const thisMonth = new Date().getMonth() + 1;
      insights.push(`📅 This month's total: ₹${total}`);
      
      if (total > 10000) {
        insights.push(`💰 High spending detected! Consider setting a monthly budget limit`);
      }
    }
    
    return insights;
  };

  const fetchAndAnalyzeExpenses = async () => {
    try {
      const res = await fetch(sheet_api_url);
      const data = await res.json();
      setExpenses(data);
      
      // Calculate total expense
      const total = data.reduce((sum: number, item: ExpenseItem) => 
        sum + (Number(item.amount) || 0), 0
      );
      setTotalExpense(total);
      
      // Categorize expenses
      const categoryMap = new Map<string, number>();
      data.forEach((item: ExpenseItem) => {
        const category = categorizeExpense(item.expense);
        const amount = Number(item.amount) || 0;
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      });
      
      // Convert to array and calculate percentages
      const categoryArray: CategoryData[] = Array.from(categoryMap.entries())
        .map(([category, amount], index) => ({
          category,
          total: amount,
          percentage: Math.round((amount / total) * 100),
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.total - a.total);
      
      setCategoryData(categoryArray);
      
      // Generate AI-like insights
      const generatedInsights = generateInsights(categoryArray, total, data.length);
      setInsights(generatedInsights);
      
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndAnalyzeExpenses();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Analyzing your expenses...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Expense Analytics</Text>
      
      {/* Total Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Total Expenses</Text>
        <Text style={styles.overviewAmount}>₹{totalExpense}</Text>
        <Text style={styles.overviewSubtext}>{expenses.length} transactions</Text>
      </View>

      {/* Simple Pie Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        <View style={styles.pieChart}>
          {categoryData.map((item, index) => (
            <View key={item.category} style={styles.pieSlice}>
              <View 
                style={[styles.colorBox, { backgroundColor: item.color }]} 
              />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryAmount}>₹{item.total} ({item.percentage}%)</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* AI Insights */}
      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>🤖 Smart Insights</Text>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>💡 Recommendations</Text>
        <Text style={styles.recommendationText}>• Track daily expenses to identify spending patterns</Text>
        <Text style={styles.recommendationText}>• Set category-wise budget limits</Text>
        <Text style={styles.recommendationText}>• Review weekly expenses to avoid overspending</Text>
        <Text style={styles.recommendationText}>• Consider using the 50/30/20 rule for budgeting</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  overviewCard: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  overviewTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  overviewAmount: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  overviewSubtext: {
    color: "#ecf0f1",
    fontSize: 14,
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2c3e50",
  },
  pieChart: {
    gap: 12,
  },
  pieSlice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  categoryAmount: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  insightsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c3e50",
  },
  insightItem: {
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: "#2c3e50",
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c3e50",
  },
  recommendationText: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 8,
    lineHeight: 20,
  },
});
