import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

/** Basic email format check */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Sign Up screen.
 *
 * UI-only — no auth integration yet. Validates the form locally and
 * navigates to sign-in on success. Backend integration (Clerk) will
 * replace the handleSignUp body in a later phase.
 */
export default function SignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ── Validation ── */
  const validate = useCallback((): boolean => {
    let valid = true;

    if (!fullName.trim()) {
      setFullNameError('Full name is required.');
      valid = false;
    } else if (fullName.trim().length < 2) {
      setFullNameError('Name must be at least 2 characters.');
      valid = false;
    } else {
      setFullNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  }, [fullName, email, password, confirmPassword]);

  /* ── Handlers ── */
  const handleSignUp = useCallback(() => {
    if (!validate()) return;

    setLoading(true);
    // TODO: replace with Clerk sign-up call
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/sign-in');
    }, 1200);
  }, [validate, router]);

  const handleGoogleSignUp = useCallback(() => {
    setGoogleLoading(true);
    // TODO: replace with Clerk Google OAuth flow
    setTimeout(() => {
      setGoogleLoading(false);
      router.replace('/(user)');
    }, 1200);
  }, [router]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back button ── */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
          </TouchableOpacity>

          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello there 👋</Text>
            <Text style={styles.title}>Create your{'\n'}account</Text>
            <Text style={styles.subtitle}>
              Fill in the details below to get started.
            </Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            <AuthInput
              icon="person-outline"
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              error={fullNameError}
            />

            <AuthInput
              icon="mail-outline"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              style={styles.fieldSpacing}
            />

            <AuthInput
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={passwordError}
              style={styles.fieldSpacing}
            />

            <AuthInput
              icon="lock-closed-outline"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={confirmPasswordError}
              style={styles.fieldSpacing}
            />

            {/* Terms notice */}
            <Text style={styles.termsText}>
              By signing up you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              style={styles.primaryButton}
            />
          </View>

          {/* ── Divider ── */}
          <View style={styles.dividerWrapper}>
            <AuthDivider />
          </View>

          {/* ── Google OAuth ── */}
          <GoogleButton onPress={handleGoogleSignUp} loading={googleLoading} />

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(auth)/sign-in')}
            >
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },

  /* ── Back ── */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  /* ── Header ── */
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.black,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },

  /* ── Form ── */
  form: {
    width: '100%',
    marginBottom: 28,
  },
  fieldSpacing: {
    marginTop: 14,
  },
  termsText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  termsLink: {
    fontWeight: '700',
    color: COLORS.black,
  },
  primaryButton: {
    marginTop: 0,
  },

  /* ── Divider ── */
  dividerWrapper: {
    marginBottom: 20,
  },

  /* ── Footer ── */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
  },
});
