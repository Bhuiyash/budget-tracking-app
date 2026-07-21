import type { CategoryTotal } from "@/utils/expenseStats";

export interface Insight {
  icon: string; // Ionicons name
  text: string;
  tone?: "warning" | "success";
}

// Same "smart insights" heuristics as the original screen, decoupled from
// React state and emoji-free — each insight carries an Ionicons name
// (rendered by InsightsCard) instead of an emoji baked into the string.
export function generateInsights(
  categoryTotals: CategoryTotal[],
  total: number,
  expenseCount: number,
  monthTotal: number
): Insight[] {
  const insights: Insight[] = [];

  if (categoryTotals.length === 0 || expenseCount === 0) {
    return insights;
  }

  const topCategory = categoryTotals[0];
  insights.push({
    icon: "bulb-outline",
    text: `You spend most on ${topCategory.category} (${topCategory.percentage}% of total)`,
  });

  const avgExpense = total / expenseCount;
  insights.push({
    icon: "stats-chart-outline",
    text: `Your average expense is ₹${avgExpense.toFixed(0)}`,
  });

  if (categoryTotals.length >= 3) {
    const top3 = categoryTotals.slice(0, 3);
    const top3Percentage = top3.reduce((sum, cat) => sum + cat.percentage, 0);
    insights.push({
      icon: "trophy-outline",
      text: `Top 3 categories: ${top3.map((cat) => cat.category).join(", ")} account for ${top3Percentage}% of spending`,
    });
  }

  if (topCategory.percentage > 50) {
    insights.push({
      icon: "warning-outline",
      tone: "warning",
      text: `Consider diversifying your spending - ${topCategory.category} takes more than half your budget`,
    });
  }

  insights.push({
    icon: "calendar-outline",
    text: `This month's total: ₹${monthTotal.toLocaleString()}`,
  });

  const categoriesWithData = categoryTotals.filter((cat) => cat.total > 0).length;
  insights.push({
    icon: "trending-up-outline",
    text: `You're spending across ${categoriesWithData} different categories`,
  });

  if (monthTotal > 15000) {
    insights.push({
      icon: "cash-outline",
      tone: "warning",
      text: "High spending this month! Consider setting a monthly budget limit",
    });
  } else if (monthTotal < 5000) {
    insights.push({
      icon: "checkmark-circle-outline",
      tone: "success",
      text: "Great job staying within budget this month!",
    });
  }

  const foodExpense = categoryTotals.find(
    (cat) => cat.category.toLowerCase().includes("food") || cat.category.toLowerCase().includes("grocery")
  );
  if (foodExpense && foodExpense.percentage > 30) {
    insights.push({
      icon: "fast-food-outline",
      text: `Food expenses are ${foodExpense.percentage}% of your budget - consider meal planning`,
    });
  }

  const transportExpense = categoryTotals.find((cat) => cat.category.toLowerCase().includes("transport"));
  if (transportExpense && transportExpense.percentage > 20) {
    insights.push({
      icon: "car-outline",
      text: `Transport costs ${transportExpense.percentage}% of budget - consider carpooling or public transport`,
    });
  }

  return insights;
}
