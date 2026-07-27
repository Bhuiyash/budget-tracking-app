import { getCategoryMeta } from "@/constants/categories";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/theme";
import type { Expense } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeInDown, FadeOutRight } from "react-native-reanimated";

interface TransactionCardProps {
  expense: Expense;
  index: number;
  onDelete: (rowIndex: number) => void;
}

// Caps the stagger delay so a long list finishes revealing in a reasonable
// time instead of item 30 waiting nearly two seconds for its turn.
const MAX_STAGGER_INDEX = 12;
const STAGGER_STEP_MS = 40;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

// Rich transaction row: category icon chip, name, date, category tag, and a
// right-aligned amount. Wrapped in gesture-handler's Reanimated Swipeable so
// swiping left reveals a delete action — the swipe only reveals the action,
// an explicit tap + Alert confirmation is required before anything is
// actually deleted.
export function TransactionCard({ expense, index, onDelete }: TransactionCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const meta = getCategoryMeta(expense.category);

  const confirmDelete = () => {
    Alert.alert(
      "Delete Expense",
      `Delete "${expense.expense}"? This can't be undone.`,
      [
        { text: "Cancel", style: "cancel", onPress: () => swipeableRef.current?.close() },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (expense.originalIndex != null) {
              onDelete(expense.originalIndex);
            }
          },
        },
      ],
      { cancelable: true, onDismiss: () => swipeableRef.current?.close() }
    );
  };

  const renderRightActions = () => (
    <Pressable style={styles.deleteAction} onPress={confirmDelete}>
      <Ionicons name="trash-outline" size={20} color={colors.textPrimary} />
      <Text style={styles.deleteActionText}>Delete</Text>
    </Pressable>
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS).duration(350)}
      exiting={FadeOutRight.duration(250)}
      style={styles.wrapper}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        rightThreshold={40}
        friction={1.5}
        onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={styles.card}>
          <View style={[styles.iconChip, { backgroundColor: `${meta.color}26` }]}>
            <Ionicons name={meta.icon as any} size={22} color={meta.color} />
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {expense.expense}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.date}>{formatDate(expense.date)}</Text>
              <View style={[styles.tag, { backgroundColor: `${meta.color}1A` }]}>
                <Text style={[styles.tagText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.amount}>₹{Math.round(expense.amount).toLocaleString()}</Text>
        </View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textOnSurface,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  amount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.textOnSurface,
  },
  deleteAction: {
    flex: 1,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  deleteActionText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});
