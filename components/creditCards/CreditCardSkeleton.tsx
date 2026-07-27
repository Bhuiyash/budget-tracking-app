import { Skeleton } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

// Loading placeholder for the Credit Cards dashboard — mirrors
// BudgetSkeleton.tsx's approach of shimmer blocks shaped like the real
// layout (a header, then one block per card).
export function CreditCardSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.header} />
      <Skeleton style={styles.card} />
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
    height: 360,
  },
});
