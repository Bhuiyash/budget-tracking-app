import type { CategoryId } from "@/types/expense";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string; // Ionicons name
  color: string;
}

// Single source of truth for category metadata. Previously the picker list
// (submitExpense.tsx) and the color map (analytics.tsx) drifted independently
// — "Bill Payments" existed in the picker but had no color, so it silently
// rendered gray in the pie chart. Anything added here is automatically
// available everywhere: the picker, the pie chart, and transaction chips.
export const CATEGORIES: CategoryMeta[] = [
  { id: "Food", label: "Food", icon: "fast-food-outline", color: "#FB923C" },
  { id: "Grocery", label: "Grocery", icon: "cart-outline", color: "#2DD4BF" },
  { id: "Transport", label: "Transport", icon: "car-outline", color: "#818CF8" },
  { id: "Entertainment", label: "Entertainment", icon: "film-outline", color: "#F472B6" },
  { id: "Travel", label: "Travel", icon: "airplane-outline", color: "#A78BFA" },
  { id: "Rent", label: "Rent", icon: "home-outline", color: "#FBBF24" },
  { id: "Online Shopping", label: "Online Shopping", icon: "bag-handle-outline", color: "#38BDF8" },
  { id: "Health", label: "Health", icon: "medkit-outline", color: "#4ADE80" },
  { id: "Maintenance", label: "Maintenance", icon: "construct-outline", color: "#94A3B8" },
  { id: "Bill Payments", label: "Bill Payments", icon: "receipt-outline", color: "#FB7185" },
  { id: "Miscellaneous", label: "Miscellaneous", icon: "cube-outline", color: "#C084FC" },
  { id: "ICICI Coral", label: "ICICI Coral", icon: "card-outline", color: "#FF6F61" },
  { id: "Amazon Pay ICICI", label: "Amazon Pay ICICI", icon: "card-outline", color: "#00A8E8" },
];

const FALLBACK: CategoryMeta = {
  id: "Others",
  label: "Others",
  icon: "ellipsis-horizontal-outline",
  color: "#64748B",
};

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryMeta(id?: string): CategoryMeta {
  if (!id) return FALLBACK;
  return CATEGORY_MAP.get(id as CategoryId) ?? FALLBACK;
}
