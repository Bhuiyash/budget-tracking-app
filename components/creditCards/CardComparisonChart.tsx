import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { CardComparisonItem } from "@/utils/creditCardStats";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface CardComparisonChartProps {
  items: CardComparisonItem[];
}

function ComparisonRow({ item, max, index }: { item: CardComparisonItem; max: number; index: number }) {
  const widthPct = useSharedValue(0);
  const target = max > 0 ? (item.total / max) * 100 : 0;

  useEffect(() => {
    widthPct.value = withDelay(
      index * 100,
      withTiming(target, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [target, index, widthPct]);

  const animatedStyle = useAnimatedStyle(() => ({ width: `${widthPct.value}%` }));

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowLabel}>{item.name}</Text>
        <Text style={styles.rowValue}>₹{Math.round(item.total).toLocaleString()}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: item.accentColor }, animatedStyle]} />
      </View>
    </View>
  );
}

// "Spending comparison between both cards" — lifetime totals, horizontal
// bars scaled against whichever card spent the most.
export function CardComparisonChart({ items }: CardComparisonChartProps) {
  const max = Math.max(...items.map((i) => i.total), 1);

  return (
    <Card variant="surface">
      <Text style={styles.title}>Card Comparison</Text>
      {items.map((item, index) => (
        <ComparisonRow key={item.cardId} item={item} max={max} index={index} />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  row: {
    marginBottom: spacing.lg,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  rowLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
  },
  track: {
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.full,
  },
});
