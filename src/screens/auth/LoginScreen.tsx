import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { authService } from '../../services/auth';
import { VALIDATION_RULES, ERROR_MESSAGES, SUCCESS_MESSAGES, COLORS } from '../../constants';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [pinError, setPinError] = useState('');

  const validateUsername = (value: string): boolean => {
    if (!value) {
      setUsernameError('Username is required');
      return false;
    }
    if (value.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      setUsernameError(ERROR_MESSAGES.INVALID_USERNAME);
      return false;
    }
    if (value.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
      setUsernameError(ERROR_MESSAGES.INVALID_USERNAME);
      return false;
    }
    setUsernameError('');
    return true;
  };

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

  const handleLogin = async () => {
    setError('');
    
    // Validate inputs
    const isUsernameValid = validateUsername(username);
    const isPinValid = validatePin(pin);

    if (!isUsernameValid || !isPinValid) {
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(username, pin);
      
      if (result.success) {
        setUsername('');
        setPin('');
        onLoginSuccess();
      } else {
        setError(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text h1 style={styles.title}>
            To Do: More
          </Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text) validateUsername(text);
            }}
            onBlur={() => validateUsername(username)}
            errorMessage={usernameError}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholderTextColor={COLORS.GRAY}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />

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
            title="Login"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !username || !pin}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
          />

          <View style={styles.divider} />

          <Text style={styles.registerPrompt}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={onNavigateToRegister}
            disabled={loading}
          >
            <Text style={styles.registerLink}>Create one now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
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
    marginBottom: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginVertical: 24,
  },
  registerPrompt: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
  },
});
