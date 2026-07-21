import { Button, Dialog } from "@/components/ui";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

interface EditBudgetDialogProps {
  visible: boolean;
  currentBudget: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

// Edit-budget modal, migrated off a hand-rolled Modal onto the shared
// Dialog primitive. Validation matches what budget.tsx previously enforced
// (valid number > 0) but surfaces inline instead of via Alert.alert, so
// there's no extra dismiss on top of the dialog itself for the common
// mistyped-input case.
export function EditBudgetDialog({ visible, currentBudget, onClose, onSave }: EditBudgetDialogProps) {
  const [input, setInput] = useState(currentBudget);
  const [error, setError] = useState<string | null>(null);

  // Reset to the live value each time the dialog opens, so a previous
  // invalid attempt doesn't linger the next time it's reopened.
  useEffect(() => {
    if (visible) {
      setInput(currentBudget);
      setError(null);
    }
  }, [visible, currentBudget]);

  const handleSave = () => {
    const parsed = parseFloat(input);
    if (!input || Number.isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid budget amount greater than 0");
      return;
    }
    onSave(String(parsed));
  };

  return (
    <Dialog visible={visible} onClose={onClose} title="Set Monthly Budget">
      <Text style={styles.label}>Budget Amount (₹)</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={input}
        onChangeText={(text) => {
          setInput(text);
          if (error) setError(null);
        }}
        placeholder="Enter your monthly budget"
        placeholderTextColor={colors.textSubtle}
        keyboardType="numeric"
        autoFocus
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button label="Save Budget" onPress={handleSave} style={styles.saveButton} />
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
  saveButton: {
    marginTop: spacing.xxl,
  },
});
