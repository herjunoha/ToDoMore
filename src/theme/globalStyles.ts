/**
 * Global Reusable Styles
 * Common component styles and style utilities
 */

import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { TYPOGRAPHY, TEXT_STYLES } from './typography';
import { SPACING, PADDING, BORDER_RADIUS, SHADOWS, COMPONENT_SIZE, SCREEN, BORDER_WIDTH } from './spacing';

/**
 * Global screen and layout styles
 */
export const GLOBAL_STYLES = StyleSheet.create({
  // Container styles
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SCREEN.CONTENT_PADDING,
  },

  contentContainer: {
    paddingHorizontal: SCREEN.CONTENT_PADDING,
    paddingVertical: SPACING.LG,
  },

  // Flexbox utilities
  flex: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerVertical: {
    justifyContent: 'center',
  },

  centerHorizontal: {
    alignItems: 'center',
  },

  // Scrollable containers
  scrollContainer: {
    flexGrow: 1,
  },

  // Card styles
  card: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
    ...SHADOWS.SMALL,
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.BORDER,
  },

  cardCompact: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.MD,
    ...SHADOWS.SMALL,
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.BORDER,
  },

  // Divider styles
  divider: {
    height: BORDER_WIDTH.THIN,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.LG,
  },

  dividerSmall: {
    height: BORDER_WIDTH.THIN,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MD,
  },
});

/**
 * Text component styles
 */
export const TEXT_COMPONENT_STYLES = StyleSheet.create({
  // Headings
  h1: {
    ...TEXT_STYLES.H1,
    color: COLORS.TEXT_PRIMARY,
  },

  h2: {
    ...TEXT_STYLES.H2,
    color: COLORS.TEXT_PRIMARY,
  },

  h3: {
    ...TEXT_STYLES.H3,
    color: COLORS.TEXT_PRIMARY,
  },

  h4: {
    ...TEXT_STYLES.H4,
    color: COLORS.TEXT_PRIMARY,
  },

  h5: {
    ...TEXT_STYLES.H5,
    color: COLORS.TEXT_PRIMARY,
  },

  h6: {
    ...TEXT_STYLES.H6,
    color: COLORS.TEXT_PRIMARY,
  },

  // Body text
  bodyLarge: {
    ...TEXT_STYLES.BODY_LARGE,
    color: COLORS.TEXT_PRIMARY,
  },

  bodyMedium: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  bodySmall: {
    ...TEXT_STYLES.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
  },

  // Secondary text
  secondary: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },

  secondarySmall: {
    ...TEXT_STYLES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },

  // Labels
  labelLarge: {
    ...TEXT_STYLES.LABEL_LARGE,
    color: COLORS.TEXT_PRIMARY,
  },

  labelMedium: {
    ...TEXT_STYLES.LABEL_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  labelSmall: {
    ...TEXT_STYLES.LABEL_SMALL,
    color: COLORS.TEXT_PRIMARY,
  },

  // Captions
  caption: {
    ...TEXT_STYLES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },

  captionSmall: {
    ...TEXT_STYLES.CAPTION_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },

  // Disabled text
  disabled: {
    color: COLORS.TEXT_DISABLED,
  },

  // Error text
  error: {
    color: COLORS.DANGER,
    ...TEXT_STYLES.BODY_SMALL,
  },

  // Success text
  success: {
    color: COLORS.SUCCESS,
    ...TEXT_STYLES.BODY_SMALL,
  },

  // Warning text
  warning: {
    color: COLORS.WARNING,
    ...TEXT_STYLES.BODY_SMALL,
  },
});

/**
 * Button styles
 */
export const BUTTON_STYLES = StyleSheet.create({
  // Primary button
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    minHeight: COMPONENT_SIZE.BUTTON_MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },

  primaryButtonText: {
    ...TEXT_STYLES.LABEL_LARGE,
    color: COLORS.WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },

  // Secondary button
  secondaryButton: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    minHeight: COMPONENT_SIZE.BUTTON_MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButtonText: {
    ...TEXT_STYLES.LABEL_LARGE,
    color: COLORS.WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },

  // Danger button
  dangerButton: {
    backgroundColor: COLORS.DANGER,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    minHeight: COMPONENT_SIZE.BUTTON_MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },

  dangerButtonText: {
    ...TEXT_STYLES.LABEL_LARGE,
    color: COLORS.WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },

  // Disabled button
  disabledButton: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    minHeight: COMPONENT_SIZE.BUTTON_MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButtonText: {
    ...TEXT_STYLES.LABEL_LARGE,
    color: COLORS.TEXT_DISABLED,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },

  // Outline button
  outlineButton: {
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    minHeight: COMPONENT_SIZE.BUTTON_MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  outlineButtonText: {
    ...TEXT_STYLES.LABEL_LARGE,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
});

/**
 * Input field styles
 */
export const INPUT_STYLES = StyleSheet.create({
  inputContainer: {
    height: COMPONENT_SIZE.INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.BORDER,
    paddingHorizontal: COMPONENT_SIZE.INPUT_PADDING,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    marginBottom: SPACING.MD,
  },

  inputContainerFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: BORDER_WIDTH.MEDIUM,
  },

  inputContainerError: {
    borderColor: COLORS.DANGER,
    borderWidth: BORDER_WIDTH.MEDIUM,
  },

  inputText: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  inputPlaceholder: {
    color: COLORS.TEXT_TERTIARY,
  },

  errorText: {
    ...TEXT_STYLES.CAPTION_SMALL,
    color: COLORS.DANGER,
    marginTop: SPACING.SM,
  },

  helperText: {
    ...TEXT_STYLES.CAPTION_SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.SM,
  },

  label: {
    ...TEXT_STYLES.LABEL_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
});

/**
 * Badge and tag styles
 */
export const BADGE_STYLES = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.FULL,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.MD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgePrimary: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },

  badgeSuccess: {
    backgroundColor: COLORS.SUCCESS_LIGHT,
  },

  badgeWarning: {
    backgroundColor: COLORS.WARNING_LIGHT,
  },

  badgeDanger: {
    backgroundColor: COLORS.DANGER_LIGHT,
  },

  badgeText: {
    ...TEXT_STYLES.CAPTION_SMALL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },

  badgeTextPrimary: {
    color: COLORS.PRIMARY,
  },

  badgeTextSuccess: {
    color: COLORS.SUCCESS,
  },

  badgeTextWarning: {
    color: COLORS.WARNING,
  },

  badgeTextDanger: {
    color: COLORS.DANGER,
  },
});

/**
 * Status indicator styles
 */
export const STATUS_INDICATOR_STYLES = StyleSheet.create({
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.FULL,
  },

  statusCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },

  statusInProgress: {
    backgroundColor: COLORS.WARNING,
  },

  statusPending: {
    backgroundColor: COLORS.GRAY,
  },

  statusFailed: {
    backgroundColor: COLORS.DANGER,
  },
});

/**
 * List item styles
 */
export const LIST_ITEM_STYLES = StyleSheet.create({
  listItem: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderBottomWidth: BORDER_WIDTH.THIN,
    borderBottomColor: COLORS.BORDER,
    ...GLOBAL_STYLES.rowBetween,
  },

  listItemContainer: {
    flex: 1,
  },

  listItemTitle: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },

  listItemSubtitle: {
    ...TEXT_STYLES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },

  listItemChevron: {
    marginLeft: SPACING.MD,
    color: COLORS.TEXT_TERTIARY,
  },
});

/**
 * Modal and overlay styles
 */
export const MODAL_STYLES = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.OVERLAY_MEDIUM,
  },

  modal: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.EXTRA_LARGE,
    padding: SPACING.LG,
    marginHorizontal: SPACING.LG,
  },

  modalTitle: {
    ...TEXT_STYLES.H5,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },

  modalMessage: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.MD,
  },
});
