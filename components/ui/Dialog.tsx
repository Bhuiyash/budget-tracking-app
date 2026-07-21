import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  showCloseButton?: boolean;
}

// Centered overlay dialog — replaces the hand-rolled "edit budget" and
// "budget warning" modals, which both reimplemented this same shape.
export function Dialog({ visible, onClose, title, children, showCloseButton = true }: DialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={24} color={colors.textSubtle} />
              </TouchableOpacity>
            )}
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    width: "90%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textOnSurface,
  },
});
