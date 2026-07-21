import { colors, spacing } from "@/theme";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}

// Standardizes the background + padding boilerplate every screen redeclared.
export function Screen({ children, scroll = false, style }: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView
        style={styles.base}
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.base, styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
});
