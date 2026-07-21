import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

// Small reusable "shake to flag invalid input" animation: a brief
// horizontal oscillation applied to a field's wrapper. Used on submit
// failure in place of a blocking Alert — call `shake()` from the submit
// handler for whichever fields failed validation, and spread `style` onto
// the Animated.View wrapping that field.
export function useShake() {
  const offset = useSharedValue(0);

  const shake = () => {
    offset.value = withSequence(
      withTiming(-8, { duration: 45 }),
      withTiming(8, { duration: 90 }),
      withTiming(-6, { duration: 90 }),
      withTiming(6, { duration: 90 }),
      withTiming(0, { duration: 60 })
    );
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return { shake, style };
}
