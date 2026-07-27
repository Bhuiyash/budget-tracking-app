import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { getDueDateInfo } from "@/utils/creditCardStats";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DueDateBannerProps {
  cardName: string;
  dueDay: number | null;
  onConfigure?: () => void;
}

// "Due Date Reminder" — the day-of-month is turned into an actual next
// occurrence by getDueDateInfo (never a hardcoded date), so the message
// stays correct no matter when the app is opened.
export function DueDateBanner({ cardName, dueDay, onConfigure }: DueDateBannerProps) {
  const dueInfo = getDueDateInfo(dueDay);

  if (!dueInfo) {
    return (
      <Pressable onPress={onConfigure} disabled={!onConfigure}>
        <Card variant="surface" style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
            <Text style={styles.mutedText}>Configure Due Date</Text>
          </View>
        </Card>
      </Pressable>
    );
  }

  const overdue = dueInfo.daysUntilDue < 0;
  const urgent = dueInfo.daysUntilDue <= 3;
  const color = overdue ? colors.danger : urgent ? colors.caution : colors.textPrimary;

  return (
    <Pressable onPress={onConfigure} disabled={!onConfigure}>
      <Card
        variant="surface"
        style={[styles.card, urgent ? { borderColor: color, borderWidth: 1 } : null]}
      >
        <View style={styles.row}>
          <Ionicons name={overdue ? "alert-circle" : "calendar"} size={20} color={color} />
          <Text style={[styles.text, { color }]}>
            {cardName} payment {dueInfo.label}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  mutedText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
  },
});
