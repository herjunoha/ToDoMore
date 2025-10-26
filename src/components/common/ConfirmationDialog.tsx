/**
 * ConfirmationDialog.tsx
 * Modal dialog for user confirmations
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS, SHADOWS, BUTTON_STYLES } from '../../theme';

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onCancel} />

        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              style={[
                isDangerous ? styles.dangerButton : styles.confirmButton,
                loading && styles.loadingButton,
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text
                style={
                  isDangerous
                    ? styles.dangerButtonText
                    : styles.confirmButtonText
                }
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.OVERLAY_MEDIUM,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.LG,
    marginHorizontal: SPACING.LG,
    width: '85%',
    maxWidth: 400,
    ...SHADOWS.LARGE,
  },
  title: {
    ...TEXT_STYLES.H5,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  message: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.MD,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  cancelButtonText: {
    ...TEXT_STYLES.LABEL_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.PRIMARY,
  },
  confirmButtonText: {
    ...TEXT_STYLES.LABEL_MEDIUM,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  dangerButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.DANGER,
  },
  dangerButtonText: {
    ...TEXT_STYLES.LABEL_MEDIUM,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  loadingButton: {
    opacity: 0.6,
  },
});
