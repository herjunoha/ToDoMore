/**
 * TaskFormScreen.tsx
 * Screen for creating or editing tasks
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TaskStackParamList } from '../../navigation/TaskStackNavigator';
import { COLORS } from '../../constants';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskForm'>;

export const TaskFormScreen: React.FC<Props> = ({ route }) => {
  const { taskId, goalId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Task Form Screen - {taskId ? `Edit: ${taskId}` : 'Create New'}
      </Text>
      {goalId && <Text style={styles.text}>Goal ID: {goalId}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
});
