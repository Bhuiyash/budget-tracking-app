import { colors } from "@/theme";

export type BudgetStatus = "success" | "warning" | "caution" | "danger";

export interface BudgetStatusResult {
  status: BudgetStatus;
  color: string;
  percentage: number; // unclamped spent/budget * 100, 0 when budget is unset
}

// Single source of truth for the budget-usage thresholds — previously only
// duplicated inline in budget.tsx (getWarningInfo / the useEffect warning
// check). Kept in sync with that screen: >=100 danger, >=90 caution,
// >=75 warning, else success.
export function getBudgetStatus(spent: number, budget: number): BudgetStatusResult {
  if (!budget || budget <= 0) {
    return { status: "success", color: colors.success, percentage: 0 };
  }

  const percentage = (spent / budget) * 100;

  let status: BudgetStatus = "success";
  if (percentage >= 100) status = "danger";
  else if (percentage >= 90) status = "caution";
  else if (percentage >= 75) status = "warning";

  const colorByStatus: Record<BudgetStatus, string> = {
    success: colors.success,
    warning: colors.warning,
    caution: colors.caution,
    danger: colors.danger,
  };

  return { status, color: colorByStatus[status], percentage };
}
