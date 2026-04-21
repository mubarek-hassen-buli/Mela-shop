import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  type KeyboardTypeOptions,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface AuthInputProps {
  /** Icon shown on the left side */
  icon: IoniconsName;
  /** Placeholder text */
  placeholder: string;
  /** Controlled value */
  value: string;
  /** Change handler */
  onChangeText: (text: string) => void;
  /** When true, the field is a password input with a show/hide toggle */
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Error message shown below the input */
  error?: string;
  style?: ViewStyle;
}

/**
 * Reusable auth text input.
 * Renders a rounded card-style field with a left icon, optional
 * show/hide password toggle, and an inline error message.
 */
export const AuthInput: React.FC<AuthInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  style,
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          !!error && styles.inputContainerError,
        ]}
      >
        {/* Left icon */}
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? COLORS.black : COLORS.text.tertiary}
          style={styles.leftIcon}
        />

        {/* Text field */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Show/hide toggle for password fields */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecure((prev) => !prev)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={COLORS.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Inline error */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  leftIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },
});
