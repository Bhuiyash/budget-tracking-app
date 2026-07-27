import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { getBudgetStatus } from "@/utils/budgetStatus";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 128;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface UtilizationRingProps {
  spent: number;
  creditLimit: number | null;
}

// Credit utilization is structurally identical to budget utilization
// (spent / limit), so this follows components/budget/BudgetRing.tsx's exact
// SVG + Reanimated pattern and reuses its color-threshold logic
// (getBudgetStatus) rather than duplicating it — only the copy differs.
export function UtilizationRing({ spent, creditLimit }: UtilizationRingProps) {
  const { color, percentage } = getBudgetStatus(spent, creditLimit ?? 0);
  const clamped = creditLimit ? Math.min(Math.max(percentage, 0), 100) : 0;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [clamped, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value / 100),
  }));

  const available = creditLimit ? Math.max(creditLimit - spent, 0) : 0;

  return (
    <Card variant="surface" style={styles.card}>
      <Text style={styles.title}>Credit Utilization</Text>

      {creditLimit ? (
        <View style={styles.body}>
          <View style={styles.ringWrap}>
            <Svg width={SIZE} height={SIZE}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={colors.border}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <AnimatedCircle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={color}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                animatedProps={animatedProps}
                strokeLinecap="round"
                rotation={-90}
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
            </Svg>
            <View style={styles.ringCenter} pointerEvents="none">
              <Text style={[styles.percentText, { color }]}>{Math.round(percentage)}%</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoLabel}>Spent this month</Text>
            <Text style={styles.infoValue}>₹{Math.round(spent).toLocaleString()}</Text>
            <Text style={styles.infoMuted}>of ₹{creditLimit.toLocaleString()} limit</Text>
            <Text style={[styles.remaining, { color }]}>
              ₹{Math.round(available).toLocaleString()} available
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="card-outline" size={22} color={colors.textMuted} />
          <Text style={styles.emptyText}>
            Set a credit limit for this card to track utilization here.
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  info: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  infoMuted: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  remaining: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
  },
});
