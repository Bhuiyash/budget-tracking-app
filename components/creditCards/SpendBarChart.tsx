import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export interface BarChartPoint {
  key: string;
  label: string;
  total: number;
}

interface SpendBarChartProps {
  title: string;
  data: BarChartPoint[];
  color?: string;
}

const TRACK_HEIGHT = 110;

function Bar({ point, max, color, index }: { point: BarChartPoint; max: number; color: string; index: number }) {
  const heightPct = useSharedValue(0);
  const targetPct = max > 0 ? Math.max((point.total / max) * 100, point.total > 0 ? 4 : 0) : 0;

  useEffect(() => {
    heightPct.value = withDelay(
      index * 45,
      withTiming(targetPct, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
  }, [targetPct, index, heightPct]);

  const animatedStyle = useAnimatedStyle(() => ({ height: `${heightPct.value}%` }));

  return (
    <View style={styles.barColumn}>
      {point.total > 0 && (
        <Text style={styles.barValue} numberOfLines={1}>
          ₹{Math.round(point.total).toLocaleString()}
        </Text>
      )}
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, animatedStyle]} />
      </View>
      <Text style={styles.barLabel} numberOfLines={1}>
        {point.label}
      </Text>
    </View>
  );
}

// Bar rectangles animate via plain Views + Reanimated (no SVG needed for a
// rectangle) — reused for both "Monthly spending trend" and "Weekly
// spending" rather than duplicating this chart twice with different data.
export function SpendBarChart({ title, data, color = colors.primary }: SpendBarChartProps) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const hasSpending = data.some((d) => d.total > 0);

  return (
    <Card variant="surface">
      <Text style={styles.title}>{title}</Text>
      {hasSpending ? (
        <View style={styles.chartRow}>
          {data.map((point, index) => (
            <Bar key={point.key} point={point} max={max} color={color} index={index} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No spending in this period yet.</Text>
      )}
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
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barValue: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  barTrack: {
    width: "70%",
    height: TRACK_HEIGHT,
    justifyContent: "flex-end",
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: radius.sm,
  },
  barLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
});
