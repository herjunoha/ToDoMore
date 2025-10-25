/**
 * TaskDetailScreen.tsx
 * Screen for displaying task details
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TaskStackParamList } from '../../navigation/TaskStackNavigator';
import { COLORS } from '../../constants';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route }) => {
  const { taskId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task Detail Screen - ID: {taskId}</Text>
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
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
});
