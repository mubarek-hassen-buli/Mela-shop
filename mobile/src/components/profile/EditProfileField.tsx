import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface EditProfileFieldProps {
  /** Section label rendered above the field */
  label: string;
  /** Leading icon */
  icon: IoniconsName;
  /** Controlled value */
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** When true no editing is possible (e.g. email linked to OAuth) */
  readOnly?: boolean;
  /** Optional inline error */
  error?: string;
}

/**
 * A labelled text field for the Edit Profile form.
 * Shows a section label above a rounded card-style input with a
 * leading icon and a focus indicator border.
 */
export const EditProfileField: React.FC<EditProfileFieldProps> = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  readOnly = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.fieldRow,
          isFocused && styles.fieldRowFocused,
          !!error && styles.fieldRowError,
          readOnly && styles.fieldRowReadOnly,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            readOnly
              ? COLORS.text.tertiary
              : isFocused
              ? COLORS.black
              : COLORS.text.secondary
          }
          style={styles.icon}
        />

        <TextInput
          style={[styles.input, readOnly && styles.inputReadOnly]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={!readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {readOnly && (
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color={COLORS.text.tertiary}
          />
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fieldRowFocused: {
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldRowError: {
    borderColor: COLORS.error,
  },
  fieldRowReadOnly: {
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.7,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    padding: 0,
  },
  inputReadOnly: {
    color: COLORS.text.secondary,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },
});
