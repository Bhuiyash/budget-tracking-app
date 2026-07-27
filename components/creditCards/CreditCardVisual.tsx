import type { CreditCardMeta } from "@/constants/creditCards";
import { fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface CreditCardVisualProps {
  card: CreditCardMeta;
  subtitle?: string;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// The "physical card" visual — a gradient plate reused on both the
// dashboard list and the details screen header. Press feedback is a small
// scale-down via Reanimated rather than opacity, closer to how CRED/Google
// Wallet cards respond to touch.
export function CreditCardVisual({ card, subtitle, onPress }: CreditCardVisualProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: 120 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
  }, [scale]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      style={animatedStyle}
    >
      <LinearGradient
        colors={card.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.chip}>
            <Ionicons name="card" size={18} color="rgba(255,255,255,0.9)" />
          </View>
          <Ionicons
            name="wifi-outline"
            size={20}
            color="rgba(255,255,255,0.65)"
            style={styles.contactless}
          />
        </View>

        <Text style={styles.dots}>•••• •••• •••• ••••</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.name} numberOfLines={1}>
            {card.name}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 150,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chip: {
    width: 34,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactless: {
    transform: [{ rotate: "90deg" }],
  },
  dots: {
    fontSize: fontSize.lg,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 2,
    marginVertical: spacing.lg,
  },
  bottomRow: {
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.8)",
    fontWeight: fontWeight.medium,
  },
});
