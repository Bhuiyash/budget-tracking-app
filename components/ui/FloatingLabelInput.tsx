import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { forwardRef, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface FloatingLabelInputProps extends Omit<TextInputProps, "placeholder" | "placeholderTextColor"> {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const FOCUS_DURATION = 150;

// Generic floating-label text field: the label doubles as placeholder text
// centered in the field when empty/unfocused, then animates up into a small
// caption above the value once focused or filled. No expense-specific
// knowledge lives here, so unlike CategoryChips this belongs in the shared
// ui/ kit alongside Button/Card.
export const FloatingLabelInput = forwardRef<TextInput, FloatingLabelInputProps>(
  ({ label, error, containerStyle, value, onFocus, onBlur, style, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!value;
    const floated = useSharedValue(hasValue ? 1 : 0);

    useEffect(() => {
      floated.value = withTiming(isFocused || hasValue ? 1 : 0, { duration: FOCUS_DURATION });
    }, [isFocused, hasValue, floated]);

    const labelStyle = useAnimatedStyle(() => ({
      top: interpolate(floated.value, [0, 1], [18, 7]),
      fontSize: interpolate(floated.value, [0, 1], [fontSize.md, fontSize.xs]),
      color: interpolateColor(
        floated.value,
        [0, 1],
        [colors.textSubtle, error ? colors.danger : isFocused ? colors.primary : colors.textMuted]
      ),
    }));

    const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;

    return (
      <View style={containerStyle}>
        <View style={[styles.box, { borderColor }]}>
          <Animated.Text style={[styles.label, labelStyle]} pointerEvents="none" numberOfLines={1}>
            {label}
          </Animated.Text>
          <TextInput
            ref={ref}
            value={value}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            placeholder=""
            style={[styles.input, style]}
            selectionColor={colors.primary}
            {...rest}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    justifyContent: "center",
    minHeight: 58,
  },
  label: {
    position: "absolute",
    left: spacing.lg,
    fontWeight: fontWeight.semibold,
  },
  input: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingTop: 22,
    paddingBottom: 8,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
