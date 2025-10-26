/**
 * GoalDetailScreen.tsx
 * Screen for displaying goal details with SMART framework fields, linked tasks, and sub-goals
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { GoalStackParamList } from '../../navigation/GoalStackNavigator';
import { AppDispatch, AppRootState } from '../../redux/store/configureStore';
import { selectGoalById, selectSubGoals } from '../../redux/selectors/goalsSelectors';
import { selectTasksByGoalId } from '../../redux/selectors/tasksSelectors';
import { deleteGoalWithSubGoals, updateGoalStatus, calculateGoalProgress } from '../../redux/thunks/goalThunks';
import { GoalStatus, TaskStatus } from '../../types';
import { COLORS } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, formatDistanceToNow } from 'date-fns';

type Props = NativeStackScreenProps<GoalStackParamList, 'GoalDetail'>;

const SmartFieldCard: React.FC<{
  icon: string;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <View style={styles.smartCard}>
    <View style={[styles.smartIcon, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <View style={styles.smartContent}>
      <Text style={styles.smartLabel}>{label}</Text>
      <Text style={styles.smartValue} numberOfLines={2}>{value}</Text>
    </View>
  </View>
);

const TaskItemInGoal: React.FC<{ taskId: string; onTaskPress: (taskId: string) => void }> = ({ taskId, onTaskPress }) => {
  const task = useSelector((state: AppRootState) =>
    state.tasks.items.find((t) => t.id === taskId)
  );

  if (!task) return null;

  const getStatusColor = (): string => {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        return COLORS.SUCCESS;
      case TaskStatus.IN_PROGRESS:
        return COLORS.WARNING;
      case TaskStatus.PENDING:
        return COLORS.GRAY;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const getStatusIcon = (): string => {
    switch (task.status) {
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

  return (
    <TouchableOpacity
      style={styles.taskItemInGoal}
      onPress={() => onTaskPress(taskId)}
    >
      <MaterialCommunityIcons
        name={getStatusIcon()}
        size={18}
        color={getStatusColor()}
        style={{ marginRight: 8 }}
      />
      <Text
        style={[
          styles.taskItemText,
          task.status === TaskStatus.COMPLETED && styles.completedText,
        ]}
        numberOfLines={1}
      >
        {task.title}
      </Text>
      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={COLORS.TEXT_SECONDARY}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};

export const GoalDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { goalId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const goal = useSelector((state: AppRootState) => selectGoalById(state, goalId));
  const linkedTasks = useSelector((state: AppRootState) => selectTasksByGoalId(state, goalId));
  const subGoals = useSelector((state: AppRootState) => selectSubGoals(state, goalId));

  const getStatusColor = (): string => {
    if (!goal) return COLORS.GRAY;
    if (goal.status === GoalStatus.ACHIEVED) return COLORS.SUCCESS;
    if (goal.status === GoalStatus.IN_PROGRESS) return COLORS.PRIMARY;
    return COLORS.GRAY;
  };

  const getStatusLabel = (): string => {
    if (!goal) return 'Unknown';
    switch (goal.status) {
      case GoalStatus.ACHIEVED:
        return 'Achieved';
      case GoalStatus.IN_PROGRESS:
        return 'In Progress';
      case GoalStatus.NOT_STARTED:
        return 'Not Started';
      case GoalStatus.FAILED:
        return 'Failed';
    }
  };

  const getDaysRemaining = (): number | null => {
    if (!goal?.time_bound) return null;
    return Math.ceil(
      (new Date(goal.time_bound).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const daysRemaining = getDaysRemaining();
  const isOverdue = daysRemaining !== null && daysRemaining < 0;
  const completedTasks = linkedTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;

  const handleEditGoal = () => {
    navigation.navigate('GoalForm', { goalId });
  };

  const handleDeleteGoal = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? Sub-goals will also be deleted. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              await dispatch(deleteGoalWithSubGoals(goalId)).unwrap();
              Alert.alert('Success', 'Goal deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleStatusChange = async () => {
    if (!goal) return;

    const nextStatus =
      goal.status === GoalStatus.ACHIEVED ? GoalStatus.IN_PROGRESS : GoalStatus.ACHIEVED;

    setLoading(true);
    try {
      await dispatch(updateGoalStatus({ goalId, status: nextStatus })).unwrap();
      Alert.alert('Success', `Goal marked as ${getStatusLabel()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateProgress = async () => {
    setLoading(true);
    try {
      await dispatch(calculateGoalProgress(goalId)).unwrap();
      Alert.alert('Success', 'Goal progress updated based on linked tasks');
    } catch (error) {
      Alert.alert('Error', 'Failed to recalculate progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskPress = (taskId: string) => {
    // Navigate to task detail screen using the task stack
    navigation.getParent()?.navigate('Tasks', {
      screen: 'TaskDetail',
      params: { taskId },
    });
  };

  if (!goal) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={[styles.text, { marginTop: 16 }]}>Loading goal...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  const progress = goal.progress || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Status Section */}
      <View style={styles.section}>
        <View style={styles.statusHeader}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}
            onPress={handleStatusChange}
          >
            <MaterialCommunityIcons
              name={progress >= 100 ? 'check-circle' : 'target'}
              size={20}
              color={getStatusColor()}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusLabel()}
            </Text>
          </TouchableOpacity>

          <View style={[styles.progressBadge, { backgroundColor: COLORS.PRIMARY + '20' }]}>
            <Text style={[styles.progressBadgeText, { color: COLORS.PRIMARY }]}>
              {progress}% Complete
            </Text>
          </View>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.section}>
        <Text style={[styles.title, goal.status === GoalStatus.ACHIEVED && styles.completedText]}>
          {goal.title || goal.specific}
        </Text>
      </View>

      {/* Description Section */}
      {goal.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{goal.description}</Text>
        </View>
      )}

      {/* SMART Framework Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SMART Framework</Text>
        <SmartFieldCard
          icon="target"
          label="Specific"
          value={goal.specific}
          color="#4CAF50"
        />
        <SmartFieldCard
          icon="chart-line"
          label="Measurable"
          value={goal.measurable}
          color="#2196F3"
        />
        <SmartFieldCard
          icon="check-circle"
          label="Achievable"
          value={goal.achievable}
          color="#FF9800"
        />
        <SmartFieldCard
          icon="bookmark"
          label="Relevant"
          value={goal.relevant}
          color="#9C27B0"
        />
        <SmartFieldCard
          icon="calendar"
          label="Time-bound"
          value={goal.time_bound ? format(new Date(goal.time_bound), 'MMMM dd, yyyy') : 'Not set'}
          color="#F44336"
        />
      </View>

      {/* Deadline Section */}
      {goal.time_bound && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deadline</Text>
          <View style={[styles.deadlineContainer, isOverdue && styles.overdueContainer]}>
            <MaterialCommunityIcons
              name={isOverdue ? 'alert-circle' : 'calendar'}
              size={18}
              color={isOverdue ? COLORS.DANGER : COLORS.GRAY}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.deadlineText}>{format(new Date(goal.time_bound), 'MMMM dd, yyyy')}</Text>
              <Text
                style={[
                  styles.deadlineRelative,
                  isOverdue && { color: COLORS.DANGER, fontWeight: '600' },
                ]}
              >
                {isOverdue ? `${Math.abs(daysRemaining!)} days overdue` : `${daysRemaining} days left`}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Progress Bar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: COLORS.LIGHT_GRAY }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: progress >= 100 ? COLORS.SUCCESS : COLORS.PRIMARY,
                },
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>
      </View>

      {/* Linked Tasks */}
      {linkedTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Linked Tasks ({completedTasks}/{linkedTasks.length})
          </Text>
          <View style={styles.tasksContainer}>
            {linkedTasks.map((task) => (
              <TaskItemInGoal key={task.id} taskId={task.id} onTaskPress={handleTaskPress} />
            ))}
          </View>
        </View>
      )}

      {/* Sub-Goals */}
      {subGoals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sub-Goals ({subGoals.length})</Text>
          <View style={styles.subGoalsContainer}>
            {subGoals.map((subGoal) => (
              <TouchableOpacity
                key={subGoal.id}
                style={styles.subGoalItem}
                onPress={() => navigation.navigate('GoalDetail', { goalId: subGoal.id })}
              >
                <View style={styles.subGoalContent}>
                  <View style={styles.subGoalIcon}>
                    <MaterialCommunityIcons
                      name={subGoal.status === GoalStatus.ACHIEVED ? 'check-circle' : 'target'}
                      size={16}
                      color={subGoal.status === GoalStatus.ACHIEVED ? COLORS.SUCCESS : COLORS.PRIMARY}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.subGoalTitle,
                        subGoal.status === GoalStatus.ACHIEVED && styles.completedText,
                      ]}
                      numberOfLines={1}
                    >
                      {subGoal.title || subGoal.specific}
                    </Text>
                    <View style={styles.subGoalProgress}>
                      <Text style={styles.subGoalProgressText}>{subGoal.progress || 0}%</Text>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={COLORS.TEXT_SECONDARY}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Metadata Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Created</Text>
          <Text style={styles.metadataValue}>{format(new Date(goal.created_at), 'MMM dd, yyyy')}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Last Updated</Text>
          <Text style={styles.metadataValue}>
            {formatDistanceToNow(new Date(goal.updated_at), { addSuffix: true })}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.editButton, loading && styles.buttonDisabled]}
          onPress={handleEditGoal}
          disabled={loading}
        >
          <MaterialCommunityIcons name="pencil" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Edit Goal</Text>
        </TouchableOpacity>

        {linkedTasks.length > 0 && (
          <TouchableOpacity
            style={[styles.updateProgressButton, loading && styles.buttonDisabled]}
            onPress={handleRecalculateProgress}
            disabled={loading}
          >
            <MaterialCommunityIcons name="refresh" size={18} color="#ffffff" />
            <Text style={styles.buttonText}>Update Progress</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.deleteButton, loading && styles.buttonDisabled]}
          onPress={handleDeleteGoal}
          disabled={loading}
        >
          <MaterialCommunityIcons name="trash-can" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Delete Goal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  smartCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  smartIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  smartContent: {
    flex: 1,
  },
  smartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  smartValue: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  overdueContainer: {
    backgroundColor: COLORS.DANGER + '10',
    borderColor: COLORS.DANGER + '30',
  },
  deadlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  deadlineRelative: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    minWidth: 35,
  },
  tasksContainer: {
    gap: 8,
  },
  taskItemInGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  taskItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  subGoalsContainer: {
    gap: 8,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  subGoalContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subGoalIcon: {
    marginRight: 12,
  },
  subGoalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subGoalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subGoalProgressText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  metadataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metadataLabel: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  metadataValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
  },
  updateProgressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WARNING,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.DANGER,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
});
