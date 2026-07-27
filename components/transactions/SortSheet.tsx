import { BottomSheet } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type SortOption = "date" | "amount" | "name";

interface SortSheetProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSelect: (option: SortOption) => void;
}

const OPTIONS: { key: SortOption; label: string; icon: string }[] = [
  { key: "date", label: "Date (Latest First)", icon: "calendar-outline" },
  { key: "amount", label: "Amount (Highest First)", icon: "cash-outline" },
  { key: "name", label: "Name (A-Z)", icon: "text-outline" },
];

// Sort-by picker for the All Expenses screen, migrated onto the shared
// BottomSheet primitive (previously a hand-rolled Modal).
export function SortSheet({ visible, onClose, sortBy, onSelect }: SortSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Sort Expenses">
      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const selected = sortBy === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => {
                onSelect(option.key);
                onClose();
              }}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={selected ? colors.primary : colors.textSubtle}
              />
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
              {selected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.borderMuted,
  },
  optionSelected: {
    backgroundColor: colors.primaryMutedBg,
    borderWidth: 1,
    borderColor: colors.primaryMutedBorder,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textSubtle,
    marginLeft: spacing.md,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});
