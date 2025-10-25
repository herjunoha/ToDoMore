/**
 * TaskDetailScreen.tsx
 * Screen for displaying task details with linked goal information and subtasks
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SectionList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { TaskStackParamList } from '../../navigation/TaskStackNavigator';
import { AppDispatch, AppRootState } from '../../redux/store/configureStore';
import { selectTaskById, selectSubtasks } from '../../redux/selectors/tasksSelectors';
import { selectGoalById } from '../../redux/selectors/goalsSelectors';
import { Task, TaskStatus, Priority, Goal } from '../../types';
import { COLORS } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, formatDistanceToNow } from 'date-fns';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  
  const task = useSelector((state: AppRootState) => selectTaskById(state, taskId));
  const subtasks = useSelector((state: AppRootState) => selectSubtasks(state, taskId));
  const linkedGoal = useSelector((state: AppRootState) =>
    task?.goal_id ? selectGoalById(state, task.goal_id) : undefined
  );

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
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

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'Completed';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.PENDING:
        return 'Pending';
      default:
        return 'Unknown';
    }
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

  const getPriorityLabel = (priority?: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return 'High';
      case Priority.MEDIUM:
        return 'Medium';
      case Priority.LOW:
        return 'Low';
      default:
        return 'No Priority';
    }
  };

  const isOverdue =
    task &&
    task.due_date &&
    task.status !== TaskStatus.COMPLETED &&
    new Date(task.due_date) < new Date();

  const getDueDateText = (): string => {
    if (!task?.due_date) return 'No due date';
    return format(new Date(task.due_date), 'MMMM dd, yyyy');
  };

  const getDueDateRelative = (): string => {
    if (!task?.due_date) return '';
    return formatDistanceToNow(new Date(task.due_date), { addSuffix: true });
  };

  const handleEditTask = () => {
    navigation.navigate('TaskForm', { taskId });
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            // TODO: Implement delete task dispatch
            // dispatch(deleteTask(taskId));
            navigation.goBack();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleStatusChange = () => {
    const nextStatus =
      task?.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    
    // TODO: Implement status change dispatch
    // dispatch(updateTaskStatusAsync({ taskId, status: nextStatus }));
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={[styles.text, { marginTop: 16 }]}>Loading task...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Status Section */}
      <View style={styles.section}>
        <View style={styles.statusHeader}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}
            onPress={handleStatusChange}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={getStatusColor(task.status)}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {getStatusLabel(task.status)}
            </Text>
          </TouchableOpacity>

          {task.priority && (
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {getPriorityLabel(task.priority)} Priority
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.section}>
        <Text style={[styles.title, task.status === TaskStatus.COMPLETED && styles.completedText]}>
          {task.title}
        </Text>
      </View>

      {/* Description Section */}
      {task.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}

      {/* Due Date Section */}
      {task.due_date && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Due Date</Text>
          <View style={[styles.dueDateContainer, isOverdue && styles.overdueContainer]}>
            <MaterialCommunityIcons
              name={isOverdue ? 'alert-circle' : 'calendar'}
              size={18}
              color={isOverdue ? COLORS.DANGER : COLORS.GRAY}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.dueDateText}>{getDueDateText()}</Text>
              <Text
                style={[
                  styles.dueDateRelative,
                  isOverdue && { color: COLORS.DANGER, fontWeight: '600' },
                ]}
              >
                {isOverdue ? 'Overdue ' : ''}{getDueDateRelative()}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Linked Goal Section */}
      {linkedGoal && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Goal</Text>
          <TouchableOpacity
            style={styles.linkedGoalCard}
            onPress={() => {
              // TODO: Navigate to goal detail screen
              // navigation.navigate('GoalDetail', { goalId: linkedGoal.id });
            }}
          >
            <View style={styles.linkedGoalContent}>
              <MaterialCommunityIcons
                name="bullseye"
                size={20}
                color={COLORS.PRIMARY}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.linkedGoalTitle}>
                  {linkedGoal.title || linkedGoal.specific}
                </Text>
                <Text style={styles.linkedGoalDescription} numberOfLines={1}>
                  {linkedGoal.measurable}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Subtasks Section */}
      {subtasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subtasks ({subtasks.length})</Text>
          {subtasks.map((subtask) => (
            <View key={subtask.id} style={styles.subtaskItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={getStatusColor(subtask.status)}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.subtaskTitle,
                  subtask.status === TaskStatus.COMPLETED && styles.completedText,
                ]}
                numberOfLines={1}
              >
                {subtask.title}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Metadata Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Created</Text>
          <Text style={styles.metadataValue}>
            {format(new Date(task.created_at), 'MMM dd, yyyy')}
          </Text>
        </View>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Last Updated</Text>
          <Text style={styles.metadataValue}>
            {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
          </Text>
        </View>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditTask}>
          <MaterialCommunityIcons name="pencil" size={18} color="#ffffff" />
          <Text style={styles.editButtonText}>Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTask}>
          <MaterialCommunityIcons name="trash-can" size={18} color="#ffffff" />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
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
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priorityText: {
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
  dueDateContainer: {
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
  dueDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  dueDateRelative: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  linkedGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '30',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  linkedGoalContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  linkedGoalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  linkedGoalDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  subtaskTitle: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    flex: 1,
  },
  metadataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metadataLabel: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
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
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  text: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
});
