import { colors, fontSize, fontWeight, gradients, radius, shadows, spacing } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface HeroCardProps {
  totalSpent: number;
  monthLabel: string;
}

// Animates the headline number counting up to the current total whenever it
// changes (mount, or a refetch after a new expense is added), rather than
// just popping in. Reanimated's Text doesn't support animating string
// content directly, so the shared-value progress is mirrored into React
// state via useAnimatedReaction, only re-rendering when the rounded value
// actually changes.
function useCountUp(target: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(target, { duration, easing: Easing.out(Easing.cubic) });
  }, [target, duration, progress]);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplay)(current);
      }
    },
    []
  );

  return display;
}

export function HeroCard({ totalSpent, monthLabel }: HeroCardProps) {
  const displayValue = useCountUp(totalSpent);

  return (
    <LinearGradient colors={gradients.primary} style={styles.card}>
      <Text style={styles.label}>Spent in {monthLabel}</Text>
      <Text style={styles.amount}>₹{displayValue.toLocaleString()}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...shadows.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.primaryMuted,
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
});
