/**
 * GoalFormScreen.tsx
 * Screen for creating or editing goals with SMART framework
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { GoalStackParamList } from '../../navigation/GoalStackNavigator';
import { AppDispatch, AppRootState } from '../../redux/store/configureStore';
import { createGoal, updateGoal } from '../../redux/thunks/goalThunks';
import { selectGoalById, selectAllGoals } from '../../redux/selectors/goalsSelectors';
import { selectCurrentUserId } from '../../redux/selectors/authSelectors';
import { GoalStatus, GoalFormValues } from '../../types';
import { COLORS, VALIDATION_RULES } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<GoalStackParamList, 'GoalForm'>;

interface FormErrors {
  specific?: string;
  measurable?: string;
  achievable?: string;
  relevant?: string;
  timeBound?: string;
}

export const GoalFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { goalId, parentGoalId: initialParentGoalId } = route.params || {};
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectCurrentUserId);
  const currentGoal = useSelector((state: AppRootState) =>
    goalId ? selectGoalById(state, goalId) : undefined
  );
  const allGoals = useSelector(selectAllGoals);
  const [loading, setLoading] = useState(false);
  const [showParentGoalPicker, setShowParentGoalPicker] = useState(false);
  const [autoGenerateTitle, setAutoGenerateTitle] = useState(!goalId);

  // Form state
  const [formValues, setFormValues] = useState<GoalFormValues>({
    title: '',
    description: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    status: GoalStatus.NOT_STARTED,
    parentGoalId: initialParentGoalId,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load existing goal data if editing
  useEffect(() => {
    if (currentGoal && goalId) {
      setFormValues({
        title: currentGoal.title || '',
        description: currentGoal.description || '',
        specific: currentGoal.specific,
        measurable: currentGoal.measurable,
        achievable: currentGoal.achievable,
        relevant: currentGoal.relevant,
        timeBound: currentGoal.time_bound,
        status: currentGoal.status,
        parentGoalId: currentGoal.parent_goal_id,
      });
      setAutoGenerateTitle(false);
      navigation.setOptions({
        title: 'Edit Goal',
      });
    } else {
      navigation.setOptions({
        title: 'Create Goal',
      });
    }
  }, [currentGoal, goalId, navigation]);

  // Auto-generate title from SMART fields if enabled
  useEffect(() => {
    if (autoGenerateTitle && formValues.specific) {
      setFormValues((prev) => ({
        ...prev,
        title: prev.specific.substring(0, 100),
      }));
    }
  }, [autoGenerateTitle, formValues.specific]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate SMART fields
    if (!formValues.specific || formValues.specific.trim() === '') {
      newErrors.specific = 'Specific goal details are required';
    } else if (formValues.specific.length > 500) {
      newErrors.specific = 'Specific field must be less than 500 characters';
    }

    if (!formValues.measurable || formValues.measurable.trim() === '') {
      newErrors.measurable = 'Measurable criteria are required';
    } else if (formValues.measurable.length > 500) {
      newErrors.measurable = 'Measurable field must be less than 500 characters';
    }

    if (!formValues.achievable || formValues.achievable.trim() === '') {
      newErrors.achievable = 'Achievability assessment is required';
    } else if (formValues.achievable.length > 500) {
      newErrors.achievable = 'Achievable field must be less than 500 characters';
    }

    if (!formValues.relevant || formValues.relevant.trim() === '') {
      newErrors.relevant = 'Relevance explanation is required';
    } else if (formValues.relevant.length > 500) {
      newErrors.relevant = 'Relevant field must be less than 500 characters';
    }

    if (!formValues.timeBound || formValues.timeBound.trim() === '') {
      newErrors.timeBound = 'Time-bound deadline is required';
    } else if (formValues.timeBound.length > 500) {
      newErrors.timeBound = 'Time-bound field must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    setLoading(true);
    try {
      if (goalId && currentGoal) {
        // Update existing goal
        await dispatch(
          updateGoal({
            goalId,
            updates: {
              title: formValues.title || formValues.specific.substring(0, 100),
              description: formValues.description,
              specific: formValues.specific,
              measurable: formValues.measurable,
              achievable: formValues.achievable,
              relevant: formValues.relevant,
              timeBound: formValues.timeBound,
              status: formValues.status as GoalStatus | undefined,
              parentGoalId: formValues.parentGoalId,
            },
          })
        );
        Alert.alert('Success', 'Goal updated successfully');
      } else {
        // Create new goal
        await dispatch(
          createGoal({
            userId,
            title: formValues.title || formValues.specific.substring(0, 100),
            description: formValues.description,
            specific: formValues.specific,
            measurable: formValues.measurable,
            achievable: formValues.achievable,
            relevant: formValues.relevant,
            timeBound: formValues.timeBound,
            status: GoalStatus.NOT_STARTED,
            parentGoalId: formValues.parentGoalId,
          })
        );
        Alert.alert('Success', 'Goal created successfully');
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: GoalStatus) => {
    setFormValues({
      ...formValues,
      status,
    });
  };

  const handleParentGoalSelect = (parentGoalId: string) => {
    setFormValues({
      ...formValues,
      parentGoalId,
    });
    setShowParentGoalPicker(false);
  };

  const handleParentGoalRemove = () => {
    setFormValues({
      ...formValues,
      parentGoalId: undefined,
    });
  };

  const selectedParentGoal = formValues.parentGoalId
    ? allGoals.find((g) => g.id === formValues.parentGoalId)
    : null;
  const filterGoals = allGoals.filter((g) => g.id !== goalId); // Exclude current goal

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.section}>
          <View style={styles.titleHeader}>
            <Text style={styles.label}>Goal Title</Text>
            <TouchableOpacity
              onPress={() => setAutoGenerateTitle(!autoGenerateTitle)}
              disabled={loading}
            >
              <Text style={[styles.autoGenerateText, autoGenerateTitle && styles.autoGenerateTextActive]}>
                {autoGenerateTitle ? '🔄 Auto' : 'Manual'}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input]}
            placeholder="Enter goal title or leave empty to auto-generate"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={formValues.title || ''}
            onChangeText={(text) => {
              setFormValues({ ...formValues, title: text });
              if (text) setAutoGenerateTitle(false);
            }}
            editable={!loading}
            maxLength={VALIDATION_RULES.GOAL_TITLE_MAX_LENGTH}
          />
          <Text style={styles.charCount}>
            {(formValues.title || '').length}/{VALIDATION_RULES.GOAL_TITLE_MAX_LENGTH}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add additional context or notes"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={formValues.description || ''}
            onChangeText={(text) =>
              setFormValues({ ...formValues, description: text })
            }
            editable={!loading}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* SMART Framework Section */}
        <View style={styles.smartSection}>
          <Text style={styles.sectionTitle}>SMART Framework</Text>
          <Text style={styles.sectionSubtitle}>
            Define your goal using the SMART criteria
          </Text>

          {/* Specific */}
          <View style={styles.smartField}>
            <View style={styles.smartFieldHeader}>
              <MaterialCommunityIcons
                name="target"
                size={18}
                color={COLORS.PRIMARY}
                style={{ marginRight: 8 }}
              />
              <View>
                <Text style={styles.smartLabel}>Specific</Text>
                <Text style={styles.smartDescription}>What exactly do you want to achieve?</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.smartInput, errors.specific && styles.inputError]}
              placeholder="Be clear and specific about your goal"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formValues.specific}
              onChangeText={(text) =>
                setFormValues({ ...formValues, specific: text })
              }
              editable={!loading}
              multiline
              numberOfLines={3}
            />
            {errors.specific && <Text style={styles.errorText}>{errors.specific}</Text>}
            <Text style={styles.charCount}>
              {formValues.specific.length}/500
            </Text>
          </View>

          {/* Measurable */}
          <View style={styles.smartField}>
            <View style={styles.smartFieldHeader}>
              <MaterialCommunityIcons
                name="ruler"
                size={18}
                color={COLORS.PRIMARY}
                style={{ marginRight: 8 }}
              />
              <View>
                <Text style={styles.smartLabel}>Measurable</Text>
                <Text style={styles.smartDescription}>How will you measure progress?</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.smartInput, errors.measurable && styles.inputError]}
              placeholder="Define metrics or milestones"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formValues.measurable}
              onChangeText={(text) =>
                setFormValues({ ...formValues, measurable: text })
              }
              editable={!loading}
              multiline
              numberOfLines={3}
            />
            {errors.measurable && <Text style={styles.errorText}>{errors.measurable}</Text>}
            <Text style={styles.charCount}>
              {formValues.measurable.length}/500
            </Text>
          </View>

          {/* Achievable */}
          <View style={styles.smartField}>
            <View style={styles.smartFieldHeader}>
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={COLORS.SUCCESS}
                style={{ marginRight: 8 }}
              />
              <View>
                <Text style={styles.smartLabel}>Achievable</Text>
                <Text style={styles.smartDescription}>Is this goal realistic and attainable?</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.smartInput, errors.achievable && styles.inputError]}
              placeholder="Explain why this goal is achievable"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formValues.achievable}
              onChangeText={(text) =>
                setFormValues({ ...formValues, achievable: text })
              }
              editable={!loading}
              multiline
              numberOfLines={3}
            />
            {errors.achievable && <Text style={styles.errorText}>{errors.achievable}</Text>}
            <Text style={styles.charCount}>
              {formValues.achievable.length}/500
            </Text>
          </View>

          {/* Relevant */}
          <View style={styles.smartField}>
            <View style={styles.smartFieldHeader}>
              <MaterialCommunityIcons
                name="lightbulb"
                size={18}
                color={COLORS.WARNING}
                style={{ marginRight: 8 }}
              />
              <View>
                <Text style={styles.smartLabel}>Relevant</Text>
                <Text style={styles.smartDescription}>Why is this goal important to you?</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.smartInput, errors.relevant && styles.inputError]}
              placeholder="Explain the relevance and importance"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formValues.relevant}
              onChangeText={(text) =>
                setFormValues({ ...formValues, relevant: text })
              }
              editable={!loading}
              multiline
              numberOfLines={3}
            />
            {errors.relevant && <Text style={styles.errorText}>{errors.relevant}</Text>}
            <Text style={styles.charCount}>
              {formValues.relevant.length}/500
            </Text>
          </View>

          {/* Time-bound */}
          <View style={styles.smartField}>
            <View style={styles.smartFieldHeader}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={18}
                color={COLORS.DANGER}
                style={{ marginRight: 8 }}
              />
              <View>
                <Text style={styles.smartLabel}>Time-bound</Text>
                <Text style={styles.smartDescription}>When should this goal be completed?</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.smartInput, errors.timeBound && styles.inputError]}
              placeholder="Set a deadline or timeframe"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formValues.timeBound}
              onChangeText={(text) =>
                setFormValues({ ...formValues, timeBound: text })
              }
              editable={!loading}
              multiline
              numberOfLines={2}
            />
            {errors.timeBound && <Text style={styles.errorText}>{errors.timeBound}</Text>}
            <Text style={styles.charCount}>
              {formValues.timeBound.length}/500
            </Text>
          </View>
        </View>

        {/* Status Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Goal Status</Text>
          <View style={styles.statusGrid}>
            {(Object.values(GoalStatus) as GoalStatus[]).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  formValues.status === status && styles.statusButtonActive,
                ]}
                onPress={() => handleStatusChange(status)}
                disabled={loading}
              >
                <MaterialCommunityIcons
                  name={getStatusIcon(status)}
                  size={20}
                  color={formValues.status === status ? COLORS.PRIMARY : COLORS.GRAY}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.statusButtonText,
                    formValues.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Parent Goal Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Link to Parent Goal (Sub-goal)</Text>
          {selectedParentGoal ? (
            <View style={styles.selectedGoalCard}>
              <View style={styles.selectedGoalContent}>
                <MaterialCommunityIcons
                  name="bullseye"
                  size={20}
                  color={COLORS.PRIMARY}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedGoalTitle}>
                    {selectedParentGoal.title || selectedParentGoal.specific}
                  </Text>
                  <Text style={styles.selectedGoalSubtitle} numberOfLines={1}>
                    {selectedParentGoal.measurable}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleParentGoalRemove}
                disabled={loading}
              >
                <MaterialCommunityIcons name="close" size={20} color={COLORS.DANGER} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.goalButton}
              onPress={() => setShowParentGoalPicker(!showParentGoalPicker)}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={COLORS.PRIMARY}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.goalButtonText}>
                {filterGoals.length > 0 ? 'Select parent goal' : 'No parent goals available'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Parent Goal Picker */}
          {showParentGoalPicker && filterGoals.length > 0 && !selectedParentGoal && (
            <View style={styles.goalPickerContainer}>
              <FlatList
                data={filterGoals}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.goalOption}
                    onPress={() => handleParentGoalSelect(item.id)}
                  >
                    <Text style={styles.goalOptionTitle}>
                      {item.title || item.specific}
                    </Text>
                    <Text style={styles.goalOptionSubtitle} numberOfLines={1}>
                      {item.measurable}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color="#ffffff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitButtonText}>
                  {goalId ? 'Update Goal' : 'Create Goal'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStatusIcon = (status: GoalStatus): string => {
  switch (status) {
    case GoalStatus.ACHIEVED:
      return 'check-circle';
    case GoalStatus.IN_PROGRESS:
      return 'progress-clock';
    case GoalStatus.FAILED:
      return 'close-circle';
    case GoalStatus.NOT_STARTED:
      return 'circle-outline';
    default:
      return 'circle';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  autoGenerateText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  autoGenerateTextActive: {
    color: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '15',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputError: {
    borderColor: COLORS.DANGER,
    borderWidth: 2,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.DANGER,
    marginTop: 4,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    textAlign: 'right',
  },
  smartSection: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  smartField: {
    marginBottom: 16,
  },
  smartFieldHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  smartLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  smartDescription: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  smartInput: {
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: COLORS.LIGHT_GRAY + '50',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusButton: {
    flex: 1,
    minWidth: '47%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonActive: {
    backgroundColor: COLORS.PRIMARY + '15',
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  statusButtonText: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusButtonTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  selectedGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '30',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: 12,
  },
  selectedGoalContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  selectedGoalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  selectedGoalSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '40',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  goalButtonText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  goalPickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 250,
  },
  goalOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  goalOptionSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.TEXT_SECONDARY,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
