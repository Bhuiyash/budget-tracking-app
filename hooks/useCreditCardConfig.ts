import type { CreditCardId } from "@/constants/creditCards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const CREDIT_CARD_CONFIG_KEY = "creditCardConfig";

export interface CardConfig {
  creditLimit: number | null;
  billingDay: number | null; // day-of-month (1-31), not a fixed date
  dueDay: number | null; // day-of-month (1-31), not a fixed date
}

type CreditCardConfigMap = Partial<Record<CreditCardId, CardConfig>>;

const EMPTY_CONFIG: CardConfig = { creditLimit: null, billingDay: null, dueDay: null };

// Local-only config (limit / billing day / due day) that has no business in
// the shared Google Sheet. Mirrors useSavingsGoal.ts's load/save/loading
// shape, but keyed per card and stored as one JSON blob under a single key
// rather than one AsyncStorage key per field.
export function useCreditCardConfig() {
  const [configs, setConfigs] = useState<CreditCardConfigMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(CREDIT_CARD_CONFIG_KEY);
        if (mounted && saved) {
          setConfigs(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load credit card config:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getConfig = useCallback(
    (cardId: CreditCardId): CardConfig => configs[cardId] ?? EMPTY_CONFIG,
    [configs]
  );

  const saveConfig = useCallback(
    async (cardId: CreditCardId, patch: Partial<CardConfig>): Promise<boolean> => {
      const next: CreditCardConfigMap = {
        ...configs,
        [cardId]: { ...EMPTY_CONFIG, ...configs[cardId], ...patch },
      };
      try {
        await AsyncStorage.setItem(CREDIT_CARD_CONFIG_KEY, JSON.stringify(next));
        setConfigs(next);
        return true;
      } catch (error) {
        console.error("Failed to save credit card config:", error);
        return false;
      }
    },
    [configs]
  );

  return { loading, getConfig, saveConfig };
}
