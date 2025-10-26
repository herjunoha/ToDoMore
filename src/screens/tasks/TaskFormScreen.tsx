/**
 * TaskFormScreen.tsx
 * Screen for creating or editing tasks with full form validation
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
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { TaskStackParamList } from '../../navigation/TaskStackNavigator';
import { AppDispatch, AppRootState } from '../../redux/store/configureStore';
import { createTask, updateTask } from '../../redux/thunks/taskThunks';
import { selectTaskById } from '../../redux/selectors/tasksSelectors';
import { selectAllGoals } from '../../redux/selectors/goalsSelectors';
import { selectCurrentUserId } from '../../redux/selectors/authSelectors';
import { TaskStatus, Priority, TaskFormValues } from '../../types';
import { COLORS, VALIDATION_RULES } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, addDays } from 'date-fns';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskForm'>;

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  goalId?: string;
}

export const TaskFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId, goalId: initialGoalId } = route.params || {};
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectCurrentUserId);
  const currentTask = useSelector((state: AppRootState) =>
    taskId ? selectTaskById(state, taskId) : undefined
  );
  const allGoals = useSelector(selectAllGoals);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  // Form state
  const [formValues, setFormValues] = useState<TaskFormValues>({
    title: '',
    description: '',
    dueDate: undefined,
    priority: Priority.MEDIUM,
    status: TaskStatus.PENDING,
    goalId: initialGoalId,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load existing task data if editing
  useEffect(() => {
    if (currentTask && taskId) {
      setFormValues({
        title: currentTask.title,
        description: currentTask.description,
        dueDate: currentTask.due_date,
        priority: currentTask.priority,
        status: currentTask.status,
        goalId: currentTask.goal_id,
      });
      navigation.setOptions({
        title: 'Edit Task',
      });
    } else {
      navigation.setOptions({
        title: 'Create Task',
      });
    }
  }, [currentTask, taskId, navigation]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    if (!formValues.title || formValues.title.trim() === '') {
      newErrors.title = 'Task title is required';
    } else if (formValues.title.length > VALIDATION_RULES.TASK_TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be less than ${VALIDATION_RULES.TASK_TITLE_MAX_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    setLoading(true);
    try {
      if (taskId && currentTask) {
        // Update existing task
        await dispatch(
          updateTask({
            taskId,
            updates: {
              title: formValues.title,
              description: formValues.description,
              dueDate: formValues.dueDate,
              priority: formValues.priority as Priority | undefined,
              status: formValues.status as TaskStatus | undefined,
              goalId: formValues.goalId,
            },
          })
        );
        Alert.alert('Success', 'Task updated successfully');
      } else {
        // Create new task
        await dispatch(
          createTask({
            userId,
            title: formValues.title,
            description: formValues.description,
            dueDate: formValues.dueDate,
            priority: formValues.priority as Priority | undefined,
            status: TaskStatus.PENDING,
            goalId: formValues.goalId,
          })
        );
        Alert.alert('Success', 'Task created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    setFormValues({
      ...formValues,
      dueDate: selectedDate.toISOString(),
    });
    setShowDatePicker(false);
  };

  const handlePriorityChange = (priority: Priority) => {
    setFormValues({
      ...formValues,
      priority,
    });
  };

  const handleStatusChange = (status: TaskStatus) => {
    setFormValues({
      ...formValues,
      status,
    });
  };

  const handleGoalSelect = (goalId: string) => {
    setFormValues({
      ...formValues,
      goalId,
    });
    setShowGoalPicker(false);
  };

  const handleGoalRemove = () => {
    setFormValues({
      ...formValues,
      goalId: undefined,
    });
  };

  const selectedGoal = formValues.goalId ? allGoals.find((g) => g.id === formValues.goalId) : null;
  const dueDate = formValues.dueDate ? new Date(formValues.dueDate) : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Enter task title"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={formValues.title}
            onChangeText={(text) =>
              setFormValues({ ...formValues, title: text })
            }
            editable={!loading}
            maxLength={VALIDATION_RULES.TASK_TITLE_MAX_LENGTH}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={styles.charCount}>
            {formValues.title.length}/{VALIDATION_RULES.TASK_TITLE_MAX_LENGTH}
          </Text>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            placeholder="Enter task description (optional)"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={formValues.description || ''}
            onChangeText={(text) =>
              setFormValues({ ...formValues, description: text })
            }
            editable={!loading}
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Priority Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.buttonGroup}>
            {(Object.values(Priority) as Priority[]).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  formValues.priority === priority && styles.priorityButtonActive,
                  { backgroundColor: getPriorityColor(priority) + '20' },
                ]}
                onPress={() => handlePriorityChange(priority)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    formValues.priority === priority && styles.priorityButtonTextActive,
                    { color: getPriorityColor(priority) },
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusGrid}>
            {(Object.values(TaskStatus) as TaskStatus[]).map((status) => (
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

        {/* Due Date Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={COLORS.PRIMARY}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dateButtonText}>
              {dueDate ? format(dueDate, 'MMMM dd, yyyy') : 'Select due date'}
            </Text>
            {dueDate && (
              <TouchableOpacity
                onPress={() => setFormValues({ ...formValues, dueDate: undefined })}
                style={styles.clearDateButton}
              >
                <MaterialCommunityIcons name="close" size={16} color={COLORS.DANGER} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Goal Linking */}
        <View style={styles.section}>
          <Text style={styles.label}>Link to Goal</Text>
          {selectedGoal ? (
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
                    {selectedGoal.title || selectedGoal.specific}
                  </Text>
                  <Text style={styles.selectedGoalSubtitle} numberOfLines={1}>
                    {selectedGoal.measurable}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleGoalRemove}
                disabled={loading}
              >
                <MaterialCommunityIcons name="close" size={20} color={COLORS.DANGER} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.goalButton}
              onPress={() => setShowGoalPicker(!showGoalPicker)}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={COLORS.PRIMARY}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.goalButtonText}>
                {allGoals.length > 0 ? 'Select a goal' : 'No goals available'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Goal Picker Dropdown */}
          {showGoalPicker && allGoals.length > 0 && !selectedGoal && (
            <View style={styles.goalPickerContainer}>
              <FlatList
                data={allGoals}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.goalOption}
                    onPress={() => handleGoalSelect(item.id)}
                  >
                    <View style={styles.goalOptionContent}>
                      <MaterialCommunityIcons
                        name="bullseye"
                        size={18}
                        color={COLORS.PRIMARY}
                        style={{ marginRight: 8 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.goalOptionTitle}>
                          {item.title || item.specific}
                        </Text>
                        <Text style={styles.goalOptionSubtitle} numberOfLines={1}>
                          {item.measurable}
                        </Text>
                        <Text style={styles.goalOptionProgress}>
                          {item.progress || 0}% complete
                        </Text>
                      </View>
                    </View>
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
                  {taskId ? 'Update Task' : 'Create Task'}
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

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContent}>
              <Text style={styles.datePresetLabel}>Quick Select</Text>
              <View style={styles.datePickerButtons}>
                {[0, 1, 3, 7].map((days) => {
                  const date = days === 0 ? new Date() : addDays(new Date(), days);
                  const isSelected =
                    dueDate && format(dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                  return (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.datePresetButton,
                        isSelected && styles.datePresetButtonActive,
                      ]}
                      onPress={() => handleDateChange(date)}
                    >
                      <Text
                        style={[
                          styles.datePresetText,
                          isSelected && styles.datePresetTextActive,
                        ]}
                      >
                        {days === 0 ? 'Today' : `+${days}d`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const getPriorityColor = (priority?: Priority): string => {
  switch (priority) {
    case Priority.HIGH:
      return COLORS.DANGER;
    case Priority.MEDIUM:
      return COLORS.WARNING;
    case Priority.LOW:
      return COLORS.SUCCESS;
    default:
      return COLORS.GRAY;
  }
};

const getStatusIcon = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return 'check-circle';
    case TaskStatus.IN_PROGRESS:
      return 'progress-clock';
    case TaskStatus.PENDING:
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
    minHeight: 100,
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: COLORS.PRIMARY,
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityButtonTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  clearDateButton: {
    padding: 4,
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
  goalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  goalOptionProgress: {
    fontSize: 11,
    color: COLORS.PRIMARY,
    marginTop: 4,
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  modalConfirmText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  datePickerContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  datePresetLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  datePickerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  datePresetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  datePresetButtonActive: {
    backgroundColor: COLORS.PRIMARY + '20',
    borderColor: COLORS.PRIMARY,
  },
  datePresetText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  datePresetTextActive: {
    color: COLORS.PRIMARY,
  },
});
