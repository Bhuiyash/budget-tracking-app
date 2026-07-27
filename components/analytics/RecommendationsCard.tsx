import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const RECOMMENDATIONS = [
  "Track daily expenses to identify spending patterns",
  "Set category-wise budget limits",
  "Review weekly expenses to avoid overspending",
  "Consider using the 50/30/20 rule for budgeting",
];

// Static content, unchanged from the original screen — restyled onto the
// shared Card primitive with theme tokens and an Ionicons title icon instead
// of the emoji it used to carry inline.
export function RecommendationsCard() {
  return (
    <Card variant="surface">
      <View style={styles.header}>
        <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
        <Text style={styles.title}>Recommendations</Text>
      </View>

      <View style={styles.list}>
        {RECOMMENDATIONS.map((tip) => (
          <View key={tip} style={styles.row}>
            <Ionicons name="ellipse" size={6} color={colors.textMuted} style={styles.bullet} />
            <Text style={styles.text}>{tip}</Text>
          </View>
        ))}
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
  bullet: {
    marginTop: 8,
  },
  text: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
