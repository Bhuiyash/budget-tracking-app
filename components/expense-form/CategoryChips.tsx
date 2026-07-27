import { CATEGORIES } from "@/constants/categories";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { CategoryId } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface CategoryChipsProps {
  value: CategoryId | "";
  onChange: (id: CategoryId) => void;
}

interface ChipProps {
  label: string;
  icon: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

function Chip({ label, icon, color, selected, onPress }: ChipProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.05 : 1, { damping: 12, stiffness: 220 });
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? `${color}26` : colors.surface,
            borderColor: selected ? color : colors.border,
          },
        ]}
      >
        <Ionicons name={icon as any} size={16} color={selected ? color : colors.textMuted} />
        <Text style={[styles.label, { color: selected ? color : colors.textMuted }]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// Inline, single-tap category picker — replaces the old full-screen modal
// that required opening a sheet just to choose one option. Each chip is
// tinted with the category's own color from constants/categories.ts: a low
// opacity fill + muted icon/label when unselected, full color border/icon
// when selected.
export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <View style={styles.wrap}>
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.label}
          icon={cat.icon}
          color={cat.color}
          selected={value === cat.id}
          onPress={() => {
            Haptics.selectionAsync();
            onChange(cat.id);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
