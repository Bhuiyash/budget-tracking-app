import { CategoryChips } from "@/components/expense-form/CategoryChips";
import { DateField } from "@/components/expense-form/DateField";
import { SuccessOverlay } from "@/components/expense-form/SuccessOverlay";
import { useShake } from "@/components/expense-form/useShake";
import { Button, Card, FloatingLabelInput, Screen } from "@/components/ui";
import { CATEGORIES } from "@/constants/categories";
import { useAddExpense } from "@/hooks/useExpenses";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import type { CategoryId, NewExpenseInput } from "@/types/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { Alert, StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { z } from "zod";

// Staggered fade/slide-in used once per mount for the sections below —
// matches the exact convention in dashboard.tsx / budget.tsx / the
// transactions screen, so entrances read consistently across tabs.
function stagger(index: number) {
  return FadeInDown.delay(index * 70).duration(400).springify().damping(16);
}

// Derived from CATEGORIES (constants/categories.ts) rather than a second
// hardcoded id list — this app already had one real bug from a category
// list drifting out of sync (a picker option with no color-map entry), so
// validation must not become a second place that can go stale when a
// category is added or removed.
const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

const expenseFormSchema = z.object({
  date: z.date(),
  expense: z.string().trim().min(1, "Enter what you spent on"),
  amount: z
    .string()
    .trim()
    .min(1, "Enter an amount")
    .refine((v) => !Number.isNaN(Number(v)), { message: "Enter a valid number" })
    .refine((v) => Number(v) > 0, { message: "Amount must be greater than 0" }),
  category: z
    .union([z.enum(CATEGORY_IDS), z.literal("")])
    .refine((v): v is CategoryId => v !== "", { message: "Select a category" }),
});

type ExpenseFormInput = z.input<typeof expenseFormSchema>;
type ExpenseFormOutput = z.output<typeof expenseFormSchema>;

const DEFAULT_VALUES: ExpenseFormInput = {
  date: new Date(),
  expense: "",
  amount: "",
  category: "",
};

const SUCCESS_VISIBLE_MS = 1600;

export default function SubmitExpenseScreen() {
  const { mutate, isPending } = useAddExpense();
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<ExpenseFormInput, unknown, ExpenseFormOutput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Drives the submit button's disabled state the same way the old ad hoc
  // `!expense || !amount || !category` check did, without duplicating a
  // second copy of the form state — this is RHF's own controlled values.
  const watchedValues = useWatch({ control });
  const isFormFilled = Boolean(watchedValues.expense) && Boolean(watchedValues.amount) && Boolean(watchedValues.category);

  const expenseShake = useShake();
  const amountShake = useShake();
  const categoryShake = useShake();

  useEffect(() => {
    return () => {
      if (successTimeout.current) clearTimeout(successTimeout.current);
    };
  }, []);

  const onValid = (data: ExpenseFormOutput) => {
    const input: NewExpenseInput = {
      date: data.date.toISOString().split("T")[0],
      expense: data.expense,
      amount: data.amount,
      category: data.category,
    };

    mutate(input, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        reset(DEFAULT_VALUES);
        setShowSuccess(true);
        if (successTimeout.current) clearTimeout(successTimeout.current);
        successTimeout.current = setTimeout(() => setShowSuccess(false), SUCCESS_VISIBLE_MS);
      },
      onError: () => {
        Alert.alert("Couldn't save expense", "Please check your connection and try again.");
      },
    });
  };

  // Errors on submit get a shake instead of a blocking Alert — this fires
  // once per submit attempt, so it won't nag while the user is still typing.
  const onInvalid = (formErrors: FieldErrors<ExpenseFormInput>) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (formErrors.expense) expenseShake.shake();
    if (formErrors.amount) amountShake.shake();
    if (formErrors.category) categoryShake.shake();
  };

  return (
    <Screen scroll>
      <Animated.View entering={stagger(0)}>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Log a purchase in a couple of taps</Text>
      </Animated.View>

      <Animated.View entering={stagger(1)}>
        <Card variant="surface" style={styles.card}>
          {showSuccess && <SuccessOverlay />}

          <Animated.View style={styles.field}>
            <Controller
              control={control}
              name="date"
              render={({ field: { value, onChange } }) => <DateField value={value} onChange={onChange} />}
            />
          </Animated.View>

          <Animated.View style={[styles.field, expenseShake.style]}>
            <Controller
              control={control}
              name="expense"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FloatingLabelInput
                  label="What did you spend on?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="sentences"
                  error={error?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View style={[styles.field, amountShake.style]}>
            <Controller
              control={control}
              name="amount"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FloatingLabelInput
                  label="Amount (₹)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  error={error?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View style={[styles.field, categoryShake.style]}>
            <Text style={styles.label}>Category</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <>
                  <CategoryChips value={value} onChange={onChange} />
                  {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
                </>
              )}
            />
          </Animated.View>

          <Button
            label="Save Expense"
            onPress={handleSubmit(onValid, onInvalid)}
            loading={isPending}
            disabled={!isFormFilled}
            style={styles.submit}
          />
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  card: {
    position: "relative",
    overflow: "hidden",
  },
  field: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
