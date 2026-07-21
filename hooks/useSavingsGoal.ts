import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const SAVINGS_GOAL_KEY = "savingsGoal";

// Small, dashboard-local concern (not a full "goals" subsystem): persists a
// single target amount under its own AsyncStorage key, mirroring the existing
// "monthlyBudget" pattern used in budget.tsx.
export function useSavingsGoal() {
  const [goal, setGoalState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SAVINGS_GOAL_KEY);
        if (mounted) {
          const parsed = saved ? parseFloat(saved) : NaN;
          setGoalState(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
        }
      } catch (error) {
        console.error("Failed to load savings goal:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setGoal = useCallback(async (value: string): Promise<boolean> => {
    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return false;

    try {
      await AsyncStorage.setItem(SAVINGS_GOAL_KEY, String(parsed));
      setGoalState(parsed);
      return true;
    } catch (error) {
      console.error("Failed to save savings goal:", error);
      return false;
    }
  }, []);

  return { goal, loading, setGoal };
}
