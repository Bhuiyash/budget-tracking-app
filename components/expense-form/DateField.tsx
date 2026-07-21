import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface DateFieldProps {
  value: Date;
  onChange: (date: Date) => void;
}

// Restyled trigger for the native date picker. The picker itself keeps its
// existing behavior unchanged (native spinner on iOS, native dialog on
// Android) — only the trigger button now uses theme tokens instead of the
// old hardcoded indigo button, plus a light haptic when it opens.
export function DateField({ value, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const openPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPicker(true);
  };

  return (
    <View>
      <Text style={styles.label}>Date</Text>
      <Pressable style={styles.trigger} onPress={openPicker}>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
        <Text style={styles.triggerText}>
          {value.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
        </Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  triggerText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});
