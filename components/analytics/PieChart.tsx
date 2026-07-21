import { getCategoryMeta } from "@/constants/categories";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";

export interface PieChartData {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  centerText?: string;
  centerValue?: string;
}

const { width } = Dimensions.get("window");
// Sized to comfortably fit inside a Card (which itself sits inside Screen's
// padding) rather than the old width * 0.8 that assumed a full-bleed,
// padding-less container.
const DEFAULT_SIZE = Math.min(width - 140, 260);

// Donut chart + legend for the Analytics screen. Rewritten onto
// react-native-reanimated (see components/budget/BudgetRing.tsx for the
// established SVG + Reanimated pattern this follows) instead of the legacy
// `Animated` API from react-native.
//
// The previous implementation kept one `Animated.Value` per legend row in a
// `useRef(data.map(() => new Animated.Value(0)))` array sized to
// `data.length` *at mount only*. If the category count grew on a later
// data refresh (a brand-new category appearing), rows beyond the original
// array length had no matching animated value and the legend animation
// silently broke for the new rows. Using `entering={FadeInRight...}`
// directly on each row removes the shared indexed array entirely — every
// row's entrance animation is self-contained, computed fresh from its own
// `index` on every render, so there is nothing that can go stale as the
// data set grows. This is structural, not a patch for today's data shape.
export default function PieChart({
  data,
  size = DEFAULT_SIZE,
  centerText = "Total Expenses",
  centerValue = "",
}: PieChartProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const centerFade = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.2)) });
    rotation.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) });
    centerFade.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) })
    );
  }, [data, scale, rotation, centerFade]);

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value * 360}deg` }],
  }));

  const centerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: centerFade.value,
    transform: [{ scale: centerFade.value }],
  }));

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const outerRadius = size / 2 - 30;
  const centerX = size / 2;
  const centerY = size / 2;
  const innerRadius = outerRadius * 0.6; // donut hole

  const createPath = (startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1Outer = centerX + outerRadius * Math.cos(startAngleRad);
    const y1Outer = centerY + outerRadius * Math.sin(startAngleRad);
    const x2Outer = centerX + outerRadius * Math.cos(endAngleRad);
    const y2Outer = centerY + outerRadius * Math.sin(endAngleRad);

    const x1Inner = centerX + innerRadius * Math.cos(endAngleRad);
    const y1Inner = centerY + innerRadius * Math.sin(endAngleRad);
    const x2Inner = centerX + innerRadius * Math.cos(startAngleRad);
    const y2Inner = centerY + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1Outer} ${y1Outer}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
      L ${x1Inner} ${y1Inner}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}
      Z
    `;
  };

  let currentAngle = 0;
  const visibleLegendData = data.filter((item) => item.percentage >= 1);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Animated.View style={[styles.chartWrapper, chartAnimatedStyle]}>
          <Svg width={size} height={size}>
            <G>
              {data.map((item, index) => {
                if (item.percentage < 1) return null;
                const sliceAngle = (item.percentage / 100) * 360;
                const path = createPath(currentAngle, currentAngle + sliceAngle);
                currentAngle += sliceAngle;

                return (
                  <Path
                    key={`slice-${item.category}-${index}`}
                    d={path}
                    fill={item.color}
                    stroke={colors.surface}
                    strokeWidth={3}
                    opacity={0.95}
                  />
                );
              })}
            </G>
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.centerContent,
            {
              width: innerRadius * 1.8,
              height: innerRadius * 1.8,
              borderRadius: innerRadius * 0.9,
              top: centerY - innerRadius * 0.9,
              left: centerX - innerRadius * 0.9,
            },
            centerAnimatedStyle,
          ]}
        >
          <Text style={styles.centerText} numberOfLines={1}>
            {centerText}
          </Text>
          {!!centerValue && (
            <Text style={styles.centerValue} numberOfLines={1}>
              {centerValue}
            </Text>
          )}
        </Animated.View>
      </View>

      <View style={styles.legend}>
        {visibleLegendData.map((item, index) => {
          const meta = getCategoryMeta(item.category);
          return (
            <Animated.View
              key={item.category}
              entering={FadeInRight.delay(index * 60).duration(400).springify().damping(16)}
              style={styles.legendItem}
            >
              <View style={[styles.legendIconChip, { backgroundColor: `${item.color}26` }]}>
                <Ionicons name={meta.icon as any} size={16} color={item.color} />
              </View>
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendCategory} numberOfLines={1}>
                  {item.category}
                </Text>
                <Text style={styles.legendAmount}>₹{item.total.toLocaleString()}</Text>
              </View>
              <Text style={styles.legendPercentage}>{item.percentage}%</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
  },
  centerText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  centerValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  legend: {
    width: "100%",
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  legendIconChip: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  legendTextContainer: {
    flex: 1,
  },
  legendCategory: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  legendPercentage: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    minWidth: 45,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});
