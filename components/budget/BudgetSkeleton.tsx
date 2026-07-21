import { Skeleton } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

// Loading placeholder for the Budget screen — mirrors the real layout
// (budget amount card, ring/progress card, tips card) using the shared
// shimmer primitive, matching how DashboardSkeleton / TransactionsSkeleton
// compose it for their own screens.
export function BudgetSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.header} />
      <Skeleton style={styles.card} />
      <Skeleton style={styles.ring} />
      <Skeleton style={styles.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    height: 56,
  },
  card: {
    height: 120,
  },
  ring: {
    height: 190,
  },
});
