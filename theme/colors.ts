// Base palette extracted from the existing screens (already a de-facto
// slate/blue/emerald/red/amber scale) — do not use these raw values
// directly in components, go through `colors` below instead.
const palette = {
  white: "#ffffff",
  black: "#000000",

  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",

  blue100: "#dbeafe",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  blue700: "#1e40af",

  emerald50: "#ecfdf5",
  emerald500: "#10b981",
  emerald600: "#059669",

  amber50: "#fffbeb",
  amber500: "#f59e0b",

  orange50: "#fff7ed",
  orange500: "#f97316",

  red50: "#fef2f2",
  red100: "#fecaca",
  red500: "#ef4444",
} as const;

export const colors = {
  background: palette.slate900,
  surface: palette.slate800,
  surfaceElevated: palette.white,
  border: palette.slate700,
  borderMuted: palette.slate200,
  overlay: "rgba(0, 0, 0, 0.5)",

  textPrimary: palette.white,
  textOnSurface: palette.slate800,
  textMuted: palette.slate400,
  textSubtle: palette.slate500,

  primary: palette.blue500,
  primaryDark: palette.blue600,
  primaryDeep: palette.blue700,
  primaryMuted: palette.blue100,
  primaryMutedBg: "rgba(59, 130, 246, 0.1)",
  primaryMutedBorder: "rgba(59, 130, 246, 0.3)",

  success: palette.emerald500,
  successDark: palette.emerald600,
  successMuted: palette.emerald50,

  warning: palette.amber500,
  warningMuted: palette.amber50,

  caution: palette.orange500,
  cautionMuted: palette.orange50,

  danger: palette.red500,
  dangerMuted: palette.red50,
  dangerBorder: palette.red100,
} as const;

export type ColorToken = keyof typeof colors;
