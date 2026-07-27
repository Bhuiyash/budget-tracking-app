import { sheet_api_url } from "@/constants/env";
import type { Expense, NewExpenseInput, RawExpense } from "@/types/expense";

function normalize(raw: RawExpense, index: number): Expense {
  return {
    date: raw.date,
    expense: raw.expense,
    amount: Number(raw.amount) || 0,
    category: raw.category?.trim() || undefined,
    originalIndex: index + 2, // sheet rows start at 2 (row 1 is the header)
  };
}

// Replaces the fetch-and-parse logic that was duplicated in budget.tsx,
// tableExpense.tsx, and analytics.tsx.
export async function fetchExpenses(): Promise<Expense[]> {
  const res = await fetch(sheet_api_url);
  if (!res.ok) {
    throw new Error(`Failed to fetch expenses (${res.status})`);
  }
  const raw: RawExpense[] = await res.json();
  return raw.map(normalize);
}

export async function addExpense(input: NewExpenseInput): Promise<void> {
  const res = await fetch(sheet_api_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to save expense (${res.status})`);
  }
}

export async function deleteExpense(rowIndex: number): Promise<void> {
  const res = await fetch(sheet_api_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", rowIndex }),
  });
  if (!res.ok) {
    throw new Error(`Failed to delete expense (${res.status})`);
  }
}
