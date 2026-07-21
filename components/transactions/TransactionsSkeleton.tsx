import { Skeleton } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

// Loading placeholder for the All Expenses screen — mirrors the real layout
// (summary card, sort controls row, list of cards) using the shared
// shimmer primitive so the shimmer animation isn't duplicated per screen.
export function TransactionsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.summary} />
      <Skeleton style={styles.controls} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} style={styles.card} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  summary: {
    height: 96,
  },
  controls: {
    height: 44,
    width: "60%",
  },
  card: {
    height: 84,
  },
});
