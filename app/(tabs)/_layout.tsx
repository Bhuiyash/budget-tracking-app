import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="submitExpense" options={{ title: "Add Expense" }} />
      <Tabs.Screen name="tableExpense" options={{ title: "All Expenses" }} />
    </Tabs>
  );
}
