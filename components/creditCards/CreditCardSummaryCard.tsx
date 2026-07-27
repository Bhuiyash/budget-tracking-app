import { Card } from "@/components/ui";
import type { CreditCardMeta } from "@/constants/creditCards";
import type { CardConfig } from "@/hooks/useCreditCardConfig";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import type { CardSummary } from "@/utils/creditCardStats";
import { formatDayOfMonth } from "@/utils/creditCardStats";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CreditCardVisual } from "./CreditCardVisual";
import { EditCardConfigDialog } from "./EditCardConfigDialog";

interface CreditCardSummaryCardProps {
  card: CreditCardMeta;
  config: CardConfig;
  summary: CardSummary;
  onPress: () => void;
  onSaveConfig: (patch: Partial<CardConfig>) => void;
}

function StatTile({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, valueColor ? { color: valueColor } : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

// The per-card block on the Credit Cards dashboard: visual + a 2-column
// stat grid (outstanding/limit/available/utilization/billing/due) + a link
// into the details screen. All values are derived from getCardSummary —
// nothing here is calculated locally.
export function CreditCardSummaryCard({
  card,
  config,
  summary,
  onPress,
  onSaveConfig,
}: CreditCardSummaryCardProps) {
  const [editVisible, setEditVisible] = useState(false);

  const utilizationColor =
    summary.utilizationPercentage == null
      ? colors.textMuted
      : summary.utilizationPercentage >= 90
        ? colors.danger
        : summary.utilizationPercentage >= 75
          ? colors.caution
          : colors.success;

  return (
    <Card variant="surface">
      <CreditCardVisual
        card={card}
        subtitle={`₹${Math.round(summary.monthlySpent).toLocaleString()} this month`}
        onPress={onPress}
      />

      <View style={styles.grid}>
        <StatTile
          label="Outstanding This Month"
          value={`₹${Math.round(summary.monthlySpent).toLocaleString()}`}
        />
        <StatTile
          label="Credit Limit"
          value={config.creditLimit ? `₹${Math.round(config.creditLimit).toLocaleString()}` : "Not set"}
        />
        <StatTile
          label="Available Credit"
          value={
            summary.availableCredit != null
              ? `₹${Math.round(summary.availableCredit).toLocaleString()}`
              : "Calculated automatically"
          }
        />
        <StatTile
          label="Utilization"
          value={summary.utilizationPercentage != null ? `${summary.utilizationPercentage}%` : "—"}
          valueColor={utilizationColor}
        />
        <StatTile label="Billing Date" value={formatDayOfMonth(config.billingDay)} />
        <StatTile label="Due Date" value={formatDayOfMonth(config.dueDay)} />
      </View>

      <View style={styles.actionsRow}>
        <Pressable onPress={() => setEditVisible(true)} style={styles.editLink} hitSlop={8}>
          <Ionicons name="settings-outline" size={14} color={colors.textMuted} />
          <Text style={styles.editLinkText}>Edit Settings</Text>
        </Pressable>

        <Pressable onPress={onPress} style={styles.viewLink} hitSlop={8}>
          <Text style={styles.viewLinkText}>View Transactions</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <EditCardConfigDialog
        visible={editVisible}
        cardName={card.name}
        config={config}
        onClose={() => setEditVisible(false)}
        onSave={(patch) => {
          onSaveConfig(patch);
          setEditVisible(false);
        }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.xl,
    marginHorizontal: -spacing.sm,
  },
  tile: {
    width: "50%",
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  tileLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  tileValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  editLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  editLinkText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
  },
  viewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  viewLinkText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
