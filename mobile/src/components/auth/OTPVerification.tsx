import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

interface OTPVerificationProps {
  /** Email address the OTP was sent to */
  email: string;
  /** Called when the user submits the 6-digit code */
  onVerify: (code: string) => void;
  /** Called when the user taps "Resend code" */
  onResend: () => void;
  /** Whether the verification request is in progress */
  loading?: boolean;
  /** Error message from a failed verification attempt */
  error?: string;
}

const CODE_LENGTH = 6;

/**
 * OTP verification component — 6-digit code input shown during
 * sign-up email verification. Clean iOS-style design.
 */
export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  loading = false,
  error,
}) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  /** Auto-submit when all digits are filled */
  useEffect(() => {
    const full = code.join('');
    if (full.length === CODE_LENGTH && code.every((c) => c !== '')) {
      onVerify(full);
    }
  }, [code, onVerify]);

  const handleChange = (text: string, index: number) => {
    // Only accept digits
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Move to next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Move to previous input on backspace
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconBadge}>
        <Ionicons name="mail-open-outline" size={28} color={COLORS.white} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to{'\n'}
        <Text style={styles.emailText}>{email}</Text>
      </Text>

      {/* OTP inputs */}
      <View style={styles.codeRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : null,
              error ? styles.codeInputError : null,
            ]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            textContentType="oneTimeCode"
          />
        ))}
      </View>

      {/* Error */}
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Verify button */}
      <Button
        title="Verify Email"
        onPress={() => onVerify(code.join(''))}
        loading={loading}
        style={styles.verifyButton}
      />

      {/* Resend */}
      <TouchableOpacity
        style={styles.resendRow}
        onPress={onResend}
        activeOpacity={0.7}
      >
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <Text style={styles.resendLink}>Resend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 8,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  emailText: {
    fontWeight: '700',
    color: COLORS.text.primary,
  },

  codeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  codeInput: {
    width: 46,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundSecondary,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  codeInputFilled: {
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
  codeInputError: {
    borderColor: COLORS.error,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '500',
  },

  verifyButton: {
    width: '100%',
    marginTop: 8,
  },

  resendRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
  },
});
