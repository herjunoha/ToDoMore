/**
 * GoalDetailScreen.tsx
 * Screen for displaying goal details
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GoalStackParamList } from '../../navigation/GoalStackNavigator';
import { COLORS } from '../../constants';

type Props = NativeStackScreenProps<GoalStackParamList, 'GoalDetail'>;

export const GoalDetailScreen: React.FC<Props> = ({ route }) => {
  const { goalId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Goal Detail Screen - ID: {goalId}</Text>
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
