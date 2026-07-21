import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";

// Brief, non-blocking confirmation shown over the form after a successful
// save — replaces the old `Alert.alert("Success", ...)` modal, which forced
// a dismiss tap for something that happens constantly (adding one expense
// after another is the core repeated action of this screen). The parent
// mounts this for ~1.6s, then unmounts it and resets the form.
export function SuccessOverlay() {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(220)}
      style={styles.overlay}
      pointerEvents="none"
    >
      <Animated.View entering={ZoomIn.springify().damping(11).duration(400)} style={styles.iconCircle}>
        <Ionicons name="checkmark" size={40} color={colors.textPrimary} />
      </Animated.View>
      <Animated.Text entering={FadeIn.delay(120).duration(250)} style={styles.text}>
        Expense added
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    zIndex: 10,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
});
