import type { Expense } from "@/types/expense";

// Older rows recorded before category tracking existed have no `category`
// field at all. This heuristic guesses one from keywords in the expense
// name so old data still lands in a sensible bucket instead of a blanket
// "Others" — preserved as-is from the original analytics screen, just
// relocated here so it stays out of the shared groupByCategory contract
// (that function's simple "category ?? Others" semantics is depended on by
// the Dashboard already and shouldn't change).
export function inferCategory(expenseName: string): string {
  const name = expenseName.toLowerCase();

  if (
    name.includes("food") ||
    name.includes("swiggy") ||
    name.includes("restaurant") ||
    name.includes("zomato") ||
    name.includes("lunch")
  )
    return "Food";
  if (
    name.includes("milk") ||
    name.includes("bread") ||
    name.includes("groceries") ||
    name.includes("vegetables") ||
    name.includes("fruits")
  )
    return "Grocery";
  if (name.includes("transport") || name.includes("uber") || name.includes("taxi")) return "Transport";
  if (name.includes("entertainment") || name.includes("movie") || name.includes("spotify"))
    return "Entertainment";
  if (name.includes("health") || name.includes("medical") || name.includes("doctor")) return "Health";
  if (name.includes("rent") || name.includes("mortgage") || name.includes("house")) return "Rent";
  if (name.includes("intrcity") || name.includes("flight") || name.includes("hotel")) return "Travel";
  if (name.includes("online shopping") || name.includes("amazon") || name.includes("online"))
    return "Online Shopping";
  if (name.includes("miscellaneous") || name.includes("other") || name.includes("various"))
    return "Miscellaneous";

  return "Others";
}

// Fills in an inferred category for expenses missing one, before handing
// the result to the shared groupByCategory util.
export function withInferredCategories(expenses: Expense[]): Expense[] {
  return expenses.map((expense) =>
    expense.category && expense.category.trim()
      ? expense
      : { ...expense, category: inferCategory(expense.expense) }
  );
}
