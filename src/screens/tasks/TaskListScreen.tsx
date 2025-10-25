/**
 * TaskListScreen.tsx
 * Screen for displaying list of tasks
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

export const TaskListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task List Screen</Text>
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
