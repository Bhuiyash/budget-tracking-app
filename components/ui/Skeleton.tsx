import { colors, radius } from "@/theme";
import { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  style?: ViewStyle;
}

// Shared shimmering placeholder block used by loading skeletons across
// screens (Dashboard, All Expenses, ...) — extracted from the shimmer
// technique that originated in DashboardSkeleton so screen-specific
// skeletons only need to describe their own layout, not reimplement the
// animation.
export function Skeleton({ style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.block, animatedStyle, style]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
  },
});
