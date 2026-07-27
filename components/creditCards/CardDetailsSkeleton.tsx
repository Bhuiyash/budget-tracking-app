import { Skeleton } from "@/components/ui";
import { radius, spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

// Loading placeholder for the Card Details screen — shaped like the real
// layout (visual, ring, banner, two charts), same shimmer primitive as
// CreditCardSkeleton / BudgetSkeleton.
export function CardDetailsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.visual} />
      <Skeleton style={styles.card} />
      <Skeleton style={styles.banner} />
      <Skeleton style={styles.chart} />
      <Skeleton style={styles.chart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  visual: {
    height: 150,
    borderRadius: radius.xl,
  },
  card: {
    height: 190,
  },
  banner: {
    height: 60,
  },
  chart: {
    height: 170,
  },
});
