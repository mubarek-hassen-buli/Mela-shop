import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AvatarPicker } from '@/components/profile/AvatarPicker';
import { EditProfileField } from '@/components/profile/EditProfileField';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

/* ──────────────────────────────────────────────────────────── */
/*  Types                                                        */
/* ──────────────────────────────────────────────────────────── */

interface ProfileForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  phone?: string;
}

/* ──────────────────────────────────────────────────────────── */
/*  Helpers                                                      */
/* ──────────────────────────────────────────────────────────── */

const INITIAL_FORM: ProfileForm = {
  fullName: 'Andrew Ainsley',
  username: 'andrew_ainsley',
  email: 'andrew.ainsley@email.com',
  phone: '+1 111 467 378 399',
};

const AVATAR_URL =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face';

function validateForm(form: ProfileForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  if (!form.username.trim()) {
    errors.username = 'Username is required.';
  } else if (!/^[a-z0-9_]{3,20}$/.test(form.username)) {
    errors.username = 'Lowercase letters, numbers and underscores only (3–20 chars).';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  }

  return errors;
}

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Edit Profile screen.
 *
 * Lets the user update their avatar, full name, username, and phone.
 * Email is read-only (managed by the auth provider).
 *
 * UI-only — form is validated locally and a success alert is shown.
 * Clerk + backend integration will replace the handleSave body later.
 */
export default function EditProfileScreen() {
  const router = useRouter();

  const [avatarUri, setAvatarUri] = useState<string>(AVATAR_URL);
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  /* Generic field updater */
  const setField = useCallback(
    (key: keyof ProfileForm) => (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      // Clear the error for this field as the user types
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  /* Save handler */
  const handleSave = useCallback(() => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // TODO: PATCH /users/me via Clerk + backend
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1200);
  }, [form, router]);

  /* Discard changes guard */
  const handleBack = useCallback(() => {
    Alert.alert(
      'Discard Changes?',
      'You have unsaved changes. Are you sure you want to go back?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ],
    );
  }, [router]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── Navigation header ── */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
          </TouchableOpacity>

          <Text style={styles.navTitle}>Edit Profile</Text>

          {/* Invisible spacer — keeps the title perfectly centred */}
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Avatar ── */}
          <View style={styles.avatarSection}>
            <AvatarPicker
              uri={avatarUri}
              onImagePicked={setAvatarUri}
            />
            <Text style={styles.changePhotoHint}>Tap to change photo</Text>
          </View>

          {/* ── Divider ── */}
          <View style={styles.sectionDivider}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          {/* ── Form fields ── */}
          <View style={styles.formSection}>
            <EditProfileField
              label="Full Name"
              icon="person-outline"
              value={form.fullName}
              onChangeText={setField('fullName')}
              placeholder="Your full name"
              autoCapitalize="words"
              error={errors.fullName}
            />

            <EditProfileField
              label="Username"
              icon="at-outline"
              value={form.username}
              onChangeText={setField('username')}
              placeholder="your_username"
              autoCapitalize="none"
              error={errors.username}
            />

            <EditProfileField
              label="Email Address"
              icon="mail-outline"
              value={form.email}
              onChangeText={setField('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              readOnly
            />

            <EditProfileField
              label="Phone Number"
              icon="call-outline"
              value={form.phone}
              onChangeText={setField('phone')}
              keyboardType="phone-pad"
              autoCapitalize="none"
              error={errors.phone}
            />
          </View>

          {/* ── Save button ── */}
          <View style={styles.saveButtonWrapper}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  Styles                                                       */
/* ──────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },

  /* ── Navigation bar ── */
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navSpacer: {
    width: 44,
    height: 44,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },

  /* ── Avatar section ── */
  avatarSection: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 8,
  },
  changePhotoHint: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginTop: 10,
    fontWeight: '500',
  },

  /* ── Section divider ── */
  sectionDivider: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  /* ── Form ── */
  formSection: {
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* ── Save button ── */
  saveButtonWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
