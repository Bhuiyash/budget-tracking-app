import { addExpense, deleteExpense, fetchExpenses } from "@/services/expenses";
import type { Expense, NewExpenseInput } from "@/types/expense";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXPENSES_QUERY_KEY = ["expenses"] as const;

// Replaces the three independent fetch-on-focus effects in budget.tsx,
// tableExpense.tsx, and analytics.tsx with one shared, cached query —
// switching tabs no longer re-hits the network for data already in cache.
export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_QUERY_KEY,
    queryFn: fetchExpenses,
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewExpenseInput) => addExpense(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
    },
  });
}

interface DeleteContext {
  previous?: Expense[];
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, DeleteContext>({
    mutationFn: (rowIndex: number) => deleteExpense(rowIndex),
    onMutate: async (rowIndex) => {
      await queryClient.cancelQueries({ queryKey: EXPENSES_QUERY_KEY });
      const previous = queryClient.getQueryData<Expense[]>(EXPENSES_QUERY_KEY);
      queryClient.setQueryData<Expense[]>(EXPENSES_QUERY_KEY, (old) =>
        old?.filter((item) => item.originalIndex !== rowIndex)
      );
      return { previous };
    },
    onError: (_error, _rowIndex, context) => {
      if (context?.previous) {
        queryClient.setQueryData(EXPENSES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
    },
  });
}
