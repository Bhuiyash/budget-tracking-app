import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface InsightsListProps {
  insights: string[];
}

// Renders the strings from generateCardInsights() (utils/creditCardStats.ts)
// as a staggered list — each row's entrance is self-contained by index,
// following the same pattern as PieChart's legend rows.
export function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) return null;

  return (
    <Card variant="surface">
      <Text style={styles.title}>Smart Insights</Text>
      <View style={styles.list}>
        {insights.map((insight, index) => (
          <Animated.View
            key={insight}
            entering={FadeInDown.delay(index * 80).duration(350)}
            style={styles.row}
          >
            <View style={styles.iconChip}>
              <Ionicons name="sparkles" size={14} color={colors.primary} />
            </View>
            <Text style={styles.text}>{insight}</Text>
          </Animated.View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconChip: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMutedBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
