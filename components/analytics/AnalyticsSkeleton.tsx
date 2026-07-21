import { Skeleton } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

// Loading placeholder for the Analytics screen — mirrors the real layout
// (overview card, pie chart card, insights card, recommendations card)
// using the shared shimmer primitive, matching how BudgetSkeleton /
// TransactionsSkeleton compose it for their own screens.
export function AnalyticsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.overview} />
      <Skeleton style={styles.chart} />
      <Skeleton style={styles.card} />
      <Skeleton style={styles.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  overview: {
    height: 116,
  },
  chart: {
    height: 360,
  },
  card: {
    height: 160,
  },
});
