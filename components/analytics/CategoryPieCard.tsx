import { Card } from "@/components/ui";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { StyleSheet, Text } from "react-native";
import PieChart, { PieChartData } from "./PieChart";

interface CategoryPieCardProps {
  data: PieChartData[];
  total: number;
}

export function CategoryPieCard({ data, total }: CategoryPieCardProps) {
  return (
    <Card variant="surface">
      <Text style={styles.title}>Spending by Category</Text>
      <PieChart data={data} centerText="Total Expenses" centerValue={`₹${total.toLocaleString()}`} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
});
