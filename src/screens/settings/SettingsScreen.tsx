/**
 * SettingsScreen.tsx
 * Screen for user settings and account management
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants';

export const SettingsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Settings Screen</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
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
