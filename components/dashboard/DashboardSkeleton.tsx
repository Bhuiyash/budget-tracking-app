import { Skeleton } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

// Mirrors the shape of the real dashboard (hero + ring/goal row + list
// cards) so the layout doesn't jump once data arrives. Shimmer animation
// lives in the shared `Skeleton` primitive.
export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.hero} />
      <View style={styles.row}>
        <Skeleton style={styles.halfCard} />
        <Skeleton style={styles.halfCard} />
      </View>
      <Skeleton style={styles.card} />
      <Skeleton style={styles.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  hero: {
    height: 150,
  },
  row: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  halfCard: {
    flex: 1,
    height: 180,
  },
  card: {
    height: 150,
  },
});
