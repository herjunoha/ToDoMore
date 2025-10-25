/**
 * TaskListScreen.tsx
 * Screen for displaying list of tasks with filtering and status indicators
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppRootState } from '../../redux/store/configureStore';
import { fetchTasks } from '../../redux/thunks/taskThunks';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
  selectCompletedTasks,
  selectPendingTasks,
  selectInProgressTasks,
} from '../../redux/selectors/tasksSelectors';
import { selectCurrentUserId } from '../../redux/selectors/authSelectors';
import { Task, TaskStatus, Priority } from '../../types';
import { COLORS } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed';

interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onStatusChange }) => {
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

export const TaskListScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectCurrentUserId);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const allTasks = useSelector(selectAllTasks);
  const completedTasks = useSelector(selectCompletedTasks);
  const pendingTasks = useSelector(selectPendingTasks);
  const inProgressTasks = useSelector(selectInProgressTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [userId, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await dispatch(fetchTasks(userId));
    }
    setRefreshing(false);
  };

  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'completed':
        return completedTasks;
      case 'pending':
        return pendingTasks;
      case 'in_progress':
        return inProgressTasks;
      case 'all':
      default:
        return allTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const handleTaskPress = (taskId: string) => {
    navigation?.navigate('TaskDetails', { taskId });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // TODO: Implement status change thunk dispatch
    // dispatch(updateTaskStatusAsync({ taskId, status: newStatus }));
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="checkbox-marked-circle-outline"
        size={64}
        color={COLORS.LIGHT_GRAY}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.emptyTitle}>No tasks found</Text>
      <Text style={styles.emptyText}>
        {filter === 'all'
          ? 'Create a task to get started!'
          : `No ${filter.replace('_', ' ')} tasks.`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={64}
        color={COLORS.DANGER}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.emptyTitle}>Error loading tasks</Text>
      <Text style={styles.emptyText}>{error}</Text>
    </View>
  );

  if (loading && !refreshing && filteredTasks.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'pending', 'in_progress', 'completed'] as FilterType[]).map(
            (filterType) => (
              <TouchableOpacity
                key={filterType}
                style={[
                  styles.filterButton,
                  filter === filterType && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(filterType)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === filterType && styles.filterButtonTextActive,
                  ]}
                >
                  {filterType === 'in_progress'
                    ? 'In Progress'
                    : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Task count */}
      {filteredTasks.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
      )}

      {/* Tasks list or empty/error state */}
      {error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onPress={() => handleTaskPress(item.id)}
              onStatusChange={handleStatusChange}
            />
          )}
          ListEmptyComponent={renderEmpty()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            filteredTasks.length === 0 && styles.listContentEmpty,
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
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
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

// Note: ScrollView is imported at the top with other React Native components
