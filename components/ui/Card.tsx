import { colors, radius, shadows, spacing } from "@/theme";
import { StyleSheet, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "surface" | "elevated";
}

// "surface" = dark card on the app's navy background (default screens).
// "elevated" = white card, for content that sits directly on a light area.
export function Card({ variant = "surface", style, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: variant === "surface" ? colors.surface : colors.surfaceElevated },
        shadows.md,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
  },
});
