// Category ids are the literal strings already persisted in the Google
// Sheet (Title Case, some with spaces) — keep them exact or old rows
// stop matching a known category.
export type CategoryId =
  | "Food"
  | "Grocery"
  | "Transport"
  | "Entertainment"
  | "Travel"
  | "Rent"
  | "Online Shopping"
  | "Health"
  | "Maintenance"
  | "Bill Payments"
  | "Miscellaneous"
  | "ICICI Coral"
  | "Amazon Pay ICICI"
  | "Others";

export interface Expense {
  date: string; // ISO yyyy-mm-dd
  expense: string;
  amount: number;
  category?: string; // free-form: legacy rows may not match a known CategoryId
  originalIndex?: number; // 1-based sheet row (present once fetched)
}

// Raw shape returned by the Apps Script endpoint, before normalization.
export interface RawExpense {
  date: string;
  expense: string;
  amount: string | number;
  category?: string;
}

export interface NewExpenseInput {
  date: string;
  expense: string;
  amount: string;
  category: CategoryId;
}
