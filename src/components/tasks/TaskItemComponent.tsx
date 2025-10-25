/**
 * TaskItemComponent.tsx
 * Reusable task item component for displaying individual tasks
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Task, TaskStatus, Priority } from '../../types';
import { COLORS } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

export interface TaskItemComponentProps {
  task: Task;
  onPress?: () => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskItemComponent: React.FC<TaskItemComponentProps> = ({
  task,
  onPress,
  onStatusChange,
}) => {
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
        return 'None';
    }
  };

  const isOverdue =
    task.due_date &&
    task.status !== TaskStatus.COMPLETED &&
    new Date(task.due_date) < new Date();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.taskItem,
        pressed && styles.taskItemPressed,
        task.status === TaskStatus.COMPLETED && styles.taskItemCompleted,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (onStatusChange && task.status !== TaskStatus.COMPLETED) {
            onStatusChange(task.id, TaskStatus.COMPLETED);
          } else if (onStatusChange && task.status === TaskStatus.COMPLETED) {
            onStatusChange(task.id, TaskStatus.PENDING);
          }
        }}
        style={styles.statusButton}
      >
        <MaterialCommunityIcons
          name={getStatusIcon(task.status)}
          size={24}
          color={getStatusColor(task.status)}
        />
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            task.status === TaskStatus.COMPLETED && styles.completedText,
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text
            style={styles.taskDescription}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        )}
        <View style={styles.taskMeta}>
          {task.due_date && (
            <View style={[styles.badge, isOverdue && styles.overdueBadge]}>
              <MaterialCommunityIcons
                name={isOverdue ? 'alert-circle' : 'calendar'}
                size={12}
                color={isOverdue ? COLORS.DANGER : COLORS.GRAY}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.badgeText,
                  isOverdue && styles.overdueBadgeText,
                ]}
              >
                {format(new Date(task.due_date), 'MMM dd')}
              </Text>
            </View>
          )}
          {task.priority && (
            <View
              style={[
                styles.badge,
                { backgroundColor: getPriorityColor(task.priority) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: getPriorityColor(task.priority) },
                ]}
              >
                {getPriorityLabel(task.priority)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={COLORS.TEXT_SECONDARY}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  taskItemPressed: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  statusButton: {
    marginRight: 12,
    padding: 4,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
  },
  taskDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 4,
  },
  overdueBadge: {
    backgroundColor: COLORS.DANGER + '20',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  overdueBadgeText: {
    color: COLORS.DANGER,
    fontWeight: '600',
  },
});
