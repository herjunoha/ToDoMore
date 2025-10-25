/**
 * GoalFormScreen.tsx
 * Screen for creating or editing goals
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GoalStackParamList } from '../../navigation/GoalStackNavigator';
import { COLORS } from '../../constants';

type Props = NativeStackScreenProps<GoalStackParamList, 'GoalForm'>;

export const GoalFormScreen: React.FC<Props> = ({ route }) => {
  const { goalId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Goal Form Screen - {goalId ? `Edit: ${goalId}` : 'Create New'}
      </Text>
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
