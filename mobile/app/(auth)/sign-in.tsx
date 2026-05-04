import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/expo/legacy';
import { useSSO } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

// Required for web browser OAuth flow to close properly
WebBrowser.maybeCompleteAuthSession();

/** Basic email format check */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Sign In screen — wired to Clerk.
 *
 * Supports:
 * - Email + password sign-in via useSignIn()
 * - Google OAuth sign-in via useSSO()
 */
export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

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

  /* ── Email + Password Sign-In ── */
  const handleSignIn = useCallback(async () => {
    if (!validate() || !isSignInLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // index.tsx will detect isSignedIn and route accordingly
      } else {
        // Handle other statuses (MFA, etc.) if needed in the future
        console.log('Sign-in status:', result.status);
      }
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        'Sign-in failed. Please try again.';
      Alert.alert('Sign In Failed', message);
    } finally {
      setLoading(false);
    }
  }, [validate, isSignInLoaded, signIn, email, password, setActive]);

  /* ── Google OAuth Sign-In ── */
  const handleGoogleSignIn = useCallback(async () => {
    if (googleLoading) return;

    setGoogleLoading(true);
    try {
      const { createdSessionId, setActive: ssoSetActive } =
        await startSSOFlow({ strategy: 'oauth_google' });

      if (createdSessionId) {
        await ssoSetActive!({ session: createdSessionId });
        // index.tsx will detect isSignedIn and route accordingly
      }
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.longMessage ||
        'Google sign-in failed. Please try again.';
      Alert.alert('Google Sign In Failed', message);
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLoading, startSSOFlow]);

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
  screen: { flex: 1, backgroundColor: COLORS.white },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },

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

  header: { marginBottom: 36 },
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
  subtitle: { fontSize: 14, color: COLORS.text.secondary, lineHeight: 20 },

  form: { width: '100%', marginBottom: 28 },
  fieldSpacing: { marginTop: 14 },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 24,
  },
  forgotText: { fontSize: 14, fontWeight: '600', color: COLORS.black },
  primaryButton: { marginTop: 0 },

  dividerWrapper: { marginBottom: 20 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: { fontSize: 14, color: COLORS.text.secondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: COLORS.black },
});
