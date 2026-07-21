import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { Insight } from "./insights";

interface InsightsCardProps {
  insights: Insight[];
}

const TONE_COLOR: Record<"default" | "warning" | "success", string> = {
  default: colors.primary,
  warning: colors.warning,
  success: colors.success,
};

// Renders the generated Insight[] as icon + text rows — one Ionicons glyph
// per row (colored by tone) instead of the emoji the original copy embedded
// directly in each string.
export function InsightsCard({ insights }: InsightsCardProps) {
  if (insights.length === 0) return null;

  return (
    <Card variant="surface">
      <View style={styles.header}>
        <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
        <Text style={styles.title}>Smart Insights</Text>
      </View>

      <View style={styles.list}>
        {insights.map((insight, index) => {
          const color = TONE_COLOR[insight.tone ?? "default"];
          return (
            <View key={index} style={styles.row}>
              <View style={[styles.iconChip, { backgroundColor: `${color}26` }]}>
                <Ionicons name={insight.icon as any} size={16} color={color} />
              </View>
              <Text style={styles.text}>{insight.text}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
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
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 3,
  },
});
