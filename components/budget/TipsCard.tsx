import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { StyleSheet, Text } from "react-native";

const TIPS = [
  "Track expenses daily for better control",
  "Set aside 20% for savings",
  "Review and adjust budget monthly",
  "Use the 50/30/20 rule (needs/wants/savings)",
];

// Static content, unchanged from the original screen — just restyled onto
// the shared Card primitive with theme tokens instead of hardcoded colors.
export function TipsCard() {
  return (
    <Card variant="surface">
      <Text style={styles.title}>Budget Tips</Text>
      {TIPS.map((tip) => (
        <Text key={tip} style={styles.tip}>
          • {tip}
        </Text>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tip: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
