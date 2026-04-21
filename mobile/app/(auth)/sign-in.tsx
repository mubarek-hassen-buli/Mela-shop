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
 * Sign In screen.
 *
 * UI-only — no auth integration yet. Validates the form locally and
 * navigates to the user home on success. Backend integration (Clerk)
 * will replace the handleSignIn body in a later phase.
 */
export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ── Validation ── */
  const validate = useCallback((): boolean => {
    let valid = true;

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  }, [email, password]);

  /* ── Handlers ── */
  const handleSignIn = useCallback(() => {
    if (!validate()) return;

    setLoading(true);
    // TODO: replace with Clerk sign-in call
    setTimeout(() => {
      setLoading(false);
      router.replace('/(user)');
    }, 1200);
  }, [validate, router]);

  const handleGoogleSignIn = useCallback(() => {
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
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.title}>Sign in to your{'\n'}account</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to access your account.
            </Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            <AuthInput
              icon="mail-outline"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
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

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotWrapper}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              style={styles.primaryButton}
            />
          </View>

          {/* ── Divider ── */}
          <View style={styles.dividerWrapper}>
            <AuthDivider />
          </View>

          {/* ── Google OAuth ── */}
          <GoogleButton onPress={handleGoogleSignIn} loading={googleLoading} />

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={styles.footerLink}>Sign up</Text>
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
    marginBottom: 36,
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
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
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
