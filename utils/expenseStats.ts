import type { Expense } from "@/types/expense";

// Consolidates the current-month filter that was duplicated in
// budget.tsx (fetchCurrentMonthExpenses) and analytics.tsx (getCurrentMonthTotal).
export function isSameMonth(dateStr: string, reference: Date = new Date()): boolean {
  const date = new Date(dateStr);
  return (
    date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear()
  );
}

export function filterCurrentMonth(expenses: Expense[], reference: Date = new Date()): Expense[] {
  return expenses.filter((expense) => isSameMonth(expense.date, reference));
}

export function sumAmounts(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

// Consolidates the category-map building logic that lived only in analytics.tsx.
export function groupByCategory(expenses: Expense[]): CategoryTotal[] {
  const total = sumAmounts(expenses);
  const totalsByCategory = new Map<string, number>();

  for (const expense of expenses) {
    const key = expense.category?.trim() || "Others";
    totalsByCategory.set(key, (totalsByCategory.get(key) ?? 0) + expense.amount);
  }

  return Array.from(totalsByCategory.entries())
    .map(([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      percentage: total > 0 ? Math.round((categoryTotal / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
