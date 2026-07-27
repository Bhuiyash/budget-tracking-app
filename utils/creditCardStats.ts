import { CREDIT_CARDS, type CreditCardId, getCardMeta } from "@/constants/creditCards";
import { classifyPurchase } from "@/constants/purchaseTags";
import type { CardConfig } from "@/hooks/useCreditCardConfig";
import type { Expense } from "@/types/expense";
import { filterCurrentMonth, sumAmounts } from "./expenseStats";

export function getExpensesForCard(expenses: Expense[], cardId: CreditCardId): Expense[] {
  const { categoryId } = getCardMeta(cardId);
  return expenses.filter((e) => e.category === categoryId);
}

export function getAllCardExpenses(expenses: Expense[]): Expense[] {
  const cardCategories = new Set(CREDIT_CARDS.map((c) => c.categoryId));
  return expenses.filter((e) => e.category && cardCategories.has(e.category as never));
}

export interface CardSummary {
  totalSpent: number;
  monthlySpent: number;
  transactionCount: number;
  avgTransaction: number;
  largestTransaction: number;
  utilizationPercentage: number | null; // null when no limit configured
  availableCredit: number | null; // null when no limit configured
}

// "Outstanding This Month" is treated as the current calendar month's spend
// on the card — there's no statement/payment tracking in the sheet, so this
// is the closest honest approximation of "what you currently owe."
export function getCardSummary(
  expenses: Expense[],
  cardId: CreditCardId,
  config: CardConfig
): CardSummary {
  const cardExpenses = getExpensesForCard(expenses, cardId);
  const totalSpent = sumAmounts(cardExpenses);
  const monthlySpent = sumAmounts(filterCurrentMonth(cardExpenses));
  const transactionCount = cardExpenses.length;
  const avgTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;
  const largestTransaction = cardExpenses.reduce((max, e) => Math.max(max, e.amount), 0);

  const hasLimit = !!config.creditLimit && config.creditLimit > 0;
  const utilizationPercentage = hasLimit
    ? Math.round((monthlySpent / config.creditLimit!) * 100)
    : null;
  const availableCredit = hasLimit ? Math.max(config.creditLimit! - monthlySpent, 0) : null;

  return {
    totalSpent,
    monthlySpent,
    transactionCount,
    avgTransaction,
    largestTransaction,
    utilizationPercentage,
    availableCredit,
  };
}

export interface MonthlyTrendPoint {
  key: string; // yyyy-mm
  label: string; // "Jan"
  total: number;
}

export function getMonthlyTrend(
  expenses: Expense[],
  cardId: CreditCardId,
  monthsBack = 6
): MonthlyTrendPoint[] {
  const cardExpenses = getExpensesForCard(expenses, cardId);
  const now = new Date();
  const points: MonthlyTrendPoint[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = sumAmounts(
      cardExpenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === monthDate.getFullYear() && d.getMonth() === monthDate.getMonth();
      })
    );
    points.push({
      key: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`,
      label: monthDate.toLocaleDateString("en-US", { month: "short" }),
      total,
    });
  }

  return points;
}

export interface WeeklySpendPoint {
  key: string;
  label: string;
  total: number;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

// Rolling 7-day buckets ending today, rather than calendar weeks — avoids
// any ambiguity about which day a week "starts" on.
export function getWeeklySpending(
  expenses: Expense[],
  cardId: CreditCardId,
  weeksBack = 6
): WeeklySpendPoint[] {
  const cardExpenses = getExpensesForCard(expenses, cardId);
  const now = new Date();
  const points: WeeklySpendPoint[] = [];

  for (let i = weeksBack - 1; i >= 0; i--) {
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const startBound = startOfDay(start);
    const endBound = endOfDay(end);

    const total = sumAmounts(
      cardExpenses.filter((e) => {
        const d = new Date(e.date);
        return d >= startBound && d <= endBound;
      })
    );

    points.push({
      key: startBound.toISOString().slice(0, 10),
      label: i === 0 ? "This week" : start.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      total,
    });
  }

  return points;
}

export interface PurchaseBreakdownItem {
  tagId: string;
  label: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
}

// Category-wise spending derived from the free-text expense description
// (see constants/purchaseTags.ts) since the sheet's `category` column is
// already spent on identifying the card itself.
export function getCardPurchaseBreakdown(
  expenses: Expense[],
  cardId: CreditCardId
): PurchaseBreakdownItem[] {
  const cardExpenses = getExpensesForCard(expenses, cardId);
  const total = sumAmounts(cardExpenses);
  const totalsByTag = new Map<string, { label: string; icon: string; color: string; amount: number }>();

  for (const expense of cardExpenses) {
    const tag = classifyPurchase(expense.expense);
    const existing = totalsByTag.get(tag.id);
    totalsByTag.set(tag.id, {
      label: tag.label,
      icon: tag.icon,
      color: tag.color,
      amount: (existing?.amount ?? 0) + expense.amount,
    });
  }

  return Array.from(totalsByTag.entries())
    .map(([tagId, { label, icon, color, amount }]) => ({
      tagId,
      label,
      icon,
      color,
      total: amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export interface CardComparisonItem {
  cardId: CreditCardId;
  name: string;
  accentColor: string;
  total: number;
  monthlyTotal: number;
}

export function getCardComparison(expenses: Expense[]): CardComparisonItem[] {
  return CREDIT_CARDS.map((card) => {
    const cardExpenses = getExpensesForCard(expenses, card.id);
    return {
      cardId: card.id,
      name: card.name,
      accentColor: card.accentColor,
      total: sumAmounts(cardExpenses),
      monthlyTotal: sumAmounts(filterCurrentMonth(cardExpenses)),
    };
  });
}

function ordinal(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = day % 100;
  return `${day}${suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0]}`;
}

export function formatDayOfMonth(day: number | null): string {
  return day ? `${ordinal(day)} of every month` : "Not Configured";
}

export interface AggregateCardStats {
  totalSpend: number;
  thisMonthSpend: number;
  avgTransaction: number;
  largestTransaction: number;
  transactionCount: number;
  highestCard: { name: string; total: number } | null;
  trendPercentage: number | null; // null when there's no prior-month data to compare against
  trendDirection: "up" | "down" | "flat";
}

// Powers the "Beautiful Analytics" tiles — these are cross-card aggregates
// (e.g. "Highest Card Spend" only makes sense comparing across cards), so
// this lives on the Dashboard rather than a single card's details screen.
export function getAggregateCardStats(expenses: Expense[]): AggregateCardStats {
  const cardExpenses = getAllCardExpenses(expenses);
  const totalSpend = sumAmounts(cardExpenses);
  const thisMonthSpend = sumAmounts(filterCurrentMonth(cardExpenses));
  const transactionCount = cardExpenses.length;
  const avgTransaction = transactionCount > 0 ? totalSpend / transactionCount : 0;
  const largestTransaction = cardExpenses.reduce((max, e) => Math.max(max, e.amount), 0);

  const comparison = getCardComparison(expenses);
  const highest = comparison.reduce<CardComparisonItem | null>(
    (best, item) => (!best || item.total > best.total ? item : best),
    null
  );
  const highestCard = highest && highest.total > 0 ? { name: highest.name, total: highest.total } : null;

  const now = new Date();
  const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthSpend = sumAmounts(filterCurrentMonth(cardExpenses, lastMonthRef));

  let trendPercentage: number | null = null;
  let trendDirection: AggregateCardStats["trendDirection"] = "flat";
  if (lastMonthSpend > 0) {
    trendPercentage = Math.round(((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100);
    trendDirection = trendPercentage > 0 ? "up" : trendPercentage < 0 ? "down" : "flat";
  }

  return {
    totalSpend,
    thisMonthSpend,
    avgTransaction,
    largestTransaction,
    transactionCount,
    highestCard,
    trendPercentage,
    trendDirection,
  };
}

export interface DueDateInfo {
  daysUntilDue: number; // 0 = due today, negative = overdue
  nextDueDate: Date;
  label: string; // e.g. "due in 5 days", "due today", "overdue by 2 days"
}

function dateForDayInMonth(year: number, month: number, day: number): Date {
  const d = new Date(year, month, day);
  // `day` overflowed past the end of `month` (e.g. day=31 in a 30-day
  // month) and the Date constructor silently rolled into the next month —
  // clamp to that month's real last day instead of rolling forward.
  if (d.getMonth() !== ((month % 12) + 12) % 12) {
    return new Date(year, month + 1, 0);
  }
  return d;
}

// Computes the next real occurrence of a day-of-month due date relative to
// `reference` (defaults to now) — never a hardcoded date, since the user
// hasn't fixed a billing cycle yet and may configure this at any time.
export function getDueDateInfo(dueDay: number | null, reference: Date = new Date()): DueDateInfo | null {
  if (!dueDay || dueDay < 1 || dueDay > 31) return null;

  const today = startOfDay(reference);
  let candidate = dateForDayInMonth(today.getFullYear(), today.getMonth(), dueDay);
  if (candidate < today) {
    candidate = dateForDayInMonth(today.getFullYear(), today.getMonth() + 1, dueDay);
  }

  const daysUntilDue = Math.round((candidate.getTime() - today.getTime()) / 86_400_000);
  const label =
    daysUntilDue === 0
      ? "due today"
      : daysUntilDue > 0
        ? `due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`
        : `overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? "" : "s"}`;

  return { daysUntilDue, nextDueDate: candidate, label };
}

// Generates the "Smart Insights" strings for a card. Only includes an
// insight when there's enough signal for it to be meaningful (e.g. skips
// the month-over-month comparison when there's no prior-month data).
export function generateCardInsights(
  allExpenses: Expense[],
  cardId: CreditCardId,
  config: CardConfig
): string[] {
  const card = getCardMeta(cardId);
  const cardExpenses = getExpensesForCard(allExpenses, cardId);
  if (cardExpenses.length === 0) return [];

  const insights: string[] = [];

  const breakdown = getCardPurchaseBreakdown(allExpenses, cardId);
  if (breakdown.length > 0 && breakdown[0].percentage >= 20) {
    insights.push(
      `${breakdown[0].label} accounts for ${breakdown[0].percentage}% of your ${card.name} spending.`
    );
  }

  const now = new Date();
  const thisMonth = sumAmounts(filterCurrentMonth(cardExpenses, now));
  const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = sumAmounts(filterCurrentMonth(cardExpenses, lastMonthRef));
  if (lastMonth > 0 && thisMonth !== lastMonth) {
    const diff = Math.round(Math.abs(thisMonth - lastMonth));
    insights.push(
      thisMonth > lastMonth
        ? `You spent ₹${diff.toLocaleString()} more this month compared to last month on ${card.name}.`
        : `You spent ₹${diff.toLocaleString()} less this month compared to last month on ${card.name}.`
    );
  }

  insights.push(
    `${card.name} was used for ${cardExpenses.length} purchase${cardExpenses.length === 1 ? "" : "s"}.`
  );

  if (config.creditLimit && config.creditLimit > 0) {
    const utilization = Math.round((thisMonth / config.creditLimit) * 100);
    insights.push(`You have utilized ${utilization}% of your ${card.name} credit limit.`);
  }

  return insights;
}
