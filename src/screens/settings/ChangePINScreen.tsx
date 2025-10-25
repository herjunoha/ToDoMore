/**
 * ChangePINScreen.tsx
 * Screen for changing user PIN
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants';

export const ChangePINScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Change PIN Screen</Text>
        <Text style={styles.subtitle}>Update your security PIN</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
