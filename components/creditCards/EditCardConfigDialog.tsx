import { Button, Dialog } from "@/components/ui";
import type { CardConfig } from "@/hooks/useCreditCardConfig";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

interface EditCardConfigDialogProps {
  visible: boolean;
  cardName: string;
  config: CardConfig;
  onClose: () => void;
  onSave: (patch: Partial<CardConfig>) => void;
}

interface FieldErrors {
  limit?: string;
  billing?: string;
  due?: string;
}

function parseOptionalDay(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return parseInt(trimmed, 10);
}

function isValidDay(day: number | null): boolean {
  return day === null || (Number.isInteger(day) && day >= 1 && day <= 31);
}

// Local-only config editor — Credit Limit, Billing Day, Due Day — all
// independently optional (a user might only know their due date and not
// their billing cycle yet, per the "configure later" requirement). Mirrors
// EditBudgetDialog.tsx's structure, extended for three fields instead of one.
export function EditCardConfigDialog({ visible, cardName, config, onClose, onSave }: EditCardConfigDialogProps) {
  const [limitInput, setLimitInput] = useState("");
  const [billingInput, setBillingInput] = useState("");
  const [dueInput, setDueInput] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (visible) {
      setLimitInput(config.creditLimit ? String(config.creditLimit) : "");
      setBillingInput(config.billingDay ? String(config.billingDay) : "");
      setDueInput(config.dueDay ? String(config.dueDay) : "");
      setErrors({});
    }
  }, [visible, config]);

  const handleSave = () => {
    const nextErrors: FieldErrors = {};

    const trimmedLimit = limitInput.trim();
    let creditLimit: number | null = null;
    if (trimmedLimit) {
      const parsed = parseFloat(trimmedLimit);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        nextErrors.limit = "Enter a valid amount greater than 0";
      } else {
        creditLimit = parsed;
      }
    }

    const billingDay = parseOptionalDay(billingInput);
    if (!isValidDay(billingDay)) nextErrors.billing = "Enter a day between 1 and 31";

    const dueDay = parseOptionalDay(dueInput);
    if (!isValidDay(dueDay)) nextErrors.due = "Enter a day between 1 and 31";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({ creditLimit, billingDay, dueDay });
  };

  return (
    <Dialog visible={visible} onClose={onClose} title={`${cardName} Settings`}>
      <Text style={styles.label}>Credit Limit (₹)</Text>
      <TextInput
        style={[styles.input, errors.limit ? styles.inputError : null]}
        value={limitInput}
        onChangeText={(text) => {
          setLimitInput(text);
          if (errors.limit) setErrors((e) => ({ ...e, limit: undefined }));
        }}
        placeholder="e.g. 80000"
        placeholderTextColor={colors.textSubtle}
        keyboardType="numeric"
      />
      {errors.limit && <Text style={styles.errorText}>{errors.limit}</Text>}

      <Text style={[styles.label, styles.labelSpaced]}>Billing Day (1-31)</Text>
      <TextInput
        style={[styles.input, errors.billing ? styles.inputError : null]}
        value={billingInput}
        onChangeText={(text) => {
          setBillingInput(text);
          if (errors.billing) setErrors((e) => ({ ...e, billing: undefined }));
        }}
        placeholder="e.g. 5"
        placeholderTextColor={colors.textSubtle}
        keyboardType="numeric"
      />
      {errors.billing && <Text style={styles.errorText}>{errors.billing}</Text>}

      <Text style={[styles.label, styles.labelSpaced]}>Due Day (1-31)</Text>
      <TextInput
        style={[styles.input, errors.due ? styles.inputError : null]}
        value={dueInput}
        onChangeText={(text) => {
          setDueInput(text);
          if (errors.due) setErrors((e) => ({ ...e, due: undefined }));
        }}
        placeholder="e.g. 20"
        placeholderTextColor={colors.textSubtle}
        keyboardType="numeric"
      />
      {errors.due && <Text style={styles.errorText}>{errors.due}</Text>}

      <Text style={styles.hint}>Leave a field blank to keep it unconfigured.</Text>

      <Button label="Save" onPress={handleSave} style={styles.saveButton} />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textOnSurface,
    marginBottom: spacing.sm,
  },
  labelSpaced: {
    marginTop: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textOnSurface,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
    marginTop: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.xxl,
  },
});
