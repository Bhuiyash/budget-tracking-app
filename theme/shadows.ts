import { Platform } from "react-native";

function elevation(height: number, opacity: number, radiusPx: number) {
  return Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height },
      shadowOpacity: opacity,
      shadowRadius: radiusPx,
    },
    android: {
      elevation: height * 2,
    },
    default: {},
  });
}

// sm: subtle card lift, md: standard card, lg: modals/floating elements.
export const shadows = {
  sm: elevation(2, 0.1, 4),
  md: elevation(8, 0.2, 12),
  lg: elevation(12, 0.3, 20),
} as const;
