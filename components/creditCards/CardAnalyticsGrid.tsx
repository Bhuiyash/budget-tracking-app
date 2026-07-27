import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { AggregateCardStats } from "@/utils/creditCardStats";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface CardAnalyticsGridProps {
  stats: AggregateCardStats;
}

interface Tile {
  key: string;
  icon: string;
  label: string;
  value: string;
  color: string;
}

// Cross-card "Beautiful Analytics" tiles for the Dashboard. Each tile is a
// self-contained mini Card with its own staggered entrance — matching the
// stagger convention used across the app (Dashboard sections, PieChart
// legend rows) rather than one shared animated-value array.
export function CardAnalyticsGrid({ stats }: CardAnalyticsGridProps) {
  const tiles: Tile[] = [
    {
      key: "total",
      icon: "wallet-outline",
      label: "Total Credit Card Spend",
      value: `₹${Math.round(stats.totalSpend).toLocaleString()}`,
      color: colors.primary,
    },
    {
      key: "highest",
      icon: "trophy-outline",
      label: "Highest Card Spend",
      value: stats.highestCard ? stats.highestCard.name : "—",
      color: colors.warning,
    },
    {
      key: "month",
      icon: "calendar-outline",
      label: "This Month Spend",
      value: `₹${Math.round(stats.thisMonthSpend).toLocaleString()}`,
      color: colors.success,
    },
    {
      key: "avg",
      icon: "swap-vertical-outline",
      label: "Average Transaction",
      value: `₹${Math.round(stats.avgTransaction).toLocaleString()}`,
      color: colors.caution,
    },
    {
      key: "largest",
      icon: "arrow-up-circle-outline",
      label: "Largest Transaction",
      value: `₹${Math.round(stats.largestTransaction).toLocaleString()}`,
      color: colors.danger,
    },
    {
      key: "count",
      icon: "receipt-outline",
      label: "Transaction Count",
      value: String(stats.transactionCount),
      color: colors.primary,
    },
  ];

  const trendColor =
    stats.trendDirection === "up" ? colors.danger : stats.trendDirection === "down" ? colors.success : colors.textMuted;
  const trendIcon =
    stats.trendDirection === "up" ? "trending-up" : stats.trendDirection === "down" ? "trending-down" : "remove-outline";

  return (
    <View>
      <View style={styles.grid}>
        {tiles.map((tile, index) => (
          <Animated.View
            key={tile.key}
            entering={FadeInDown.delay(index * 60).duration(350)}
            style={styles.tileWrap}
          >
            <Card variant="surface" style={styles.tile}>
              <View style={[styles.iconChip, { backgroundColor: `${tile.color}26` }]}>
                <Ionicons name={tile.icon as any} size={18} color={tile.color} />
              </View>
              <Text style={styles.tileValue} numberOfLines={1}>
                {tile.value}
              </Text>
              <Text style={styles.tileLabel} numberOfLines={2}>
                {tile.label}
              </Text>
            </Card>
          </Animated.View>
        ))}
      </View>

      {stats.trendPercentage != null && (
        <Animated.View entering={FadeInDown.delay(tiles.length * 60).duration(350)}>
          <Card variant="surface" style={styles.trendCard}>
            <Ionicons name={trendIcon as any} size={20} color={trendColor} />
            <Text style={styles.trendText}>
              Spending Trend: {stats.trendPercentage > 0 ? "+" : ""}
              {stats.trendPercentage}% vs last month
            </Text>
          </Card>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.sm,
  },
  tileWrap: {
    width: "50%",
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  tile: {
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  tileValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tileLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  trendCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  trendText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});
