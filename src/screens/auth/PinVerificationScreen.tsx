import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { VALIDATION_RULES, ERROR_MESSAGES, COLORS } from '../../constants';

interface PinVerificationScreenProps {
  title?: string;
  subtitle?: string;
  onVerificationSuccess: (pin: string) => void;
  onCancel: () => void;
}

/**
 * PIN Verification Screen
 * Used for verifying a PIN in security-sensitive operations (e.g., changing PIN, confirming payment)
 */
export const PinVerificationScreen: React.FC<PinVerificationScreenProps> = ({
  title = 'Verify PIN',
  subtitle = 'Enter your PIN to continue',
  onVerificationSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinError, setPinError] = useState('');

  const validatePin = (value: string): boolean => {
    if (!value) {
      setPinError('PIN is required');
      return false;
    }
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(value)) {
      setPinError(ERROR_MESSAGES.INVALID_PIN);
      return false;
    }
    setPinError('');
    return true;
  };

  const handleVerify = async () => {
    setError('');

    if (!validatePin(pin)) {
      return;
    }

    setLoading(true);
    try {
      // Simulate a brief delay for security (prevent brute force)
      await new Promise<void>((resolve) => setTimeout(resolve, 300));
      
      setPin('');
      onVerificationSuccess(pin);
    } catch (err) {
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text h2 style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="PIN (4 digits)"
            value={pin}
            onChangeText={(text) => {
              // Only allow digits and limit to 4 characters
              const numericValue = text.replace(/[^0-9]/g, '').slice(0, 4);
              setPin(numericValue);
              if (numericValue) validatePin(numericValue);
            }}
            onBlur={() => validatePin(pin)}
            errorMessage={pinError}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholderTextColor={COLORS.GRAY}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            editable={!loading}
          />

          {error && (
            <Text style={styles.errorMessage}>{error}</Text>
          )}

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            disabled={loading || !pin}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.verifyButton}
            titleStyle={styles.buttonTitle}
          />

          <Button
            title="Cancel"
            onPress={onCancel}
            disabled={loading}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonTitle}
            type="outline"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  input: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 8,
  },
  errorMessage: {
    color: COLORS.DANGER,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  verifyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: COLORS.GRAY,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
