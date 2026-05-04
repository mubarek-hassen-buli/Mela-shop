import React, { useState, useCallback, useEffect } from 'react';
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
import { useAuth } from '@clerk/expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AvatarPicker } from '@/components/profile/AvatarPicker';
import { EditProfileField } from '@/components/profile/EditProfileField';
import { Button } from '@/components/common/Button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { uploadAvatar, updateMe } from '@/api/users.api';
import { COLORS } from '@/constants/colors';
import type { AuthUser } from '@/store/auth.store';

/* ── Types ─────────────────────────────────────────────────── */

interface ProfileForm {
  fullName: string;
  username: string;
  phoneNumber: string;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
}

/* ── Validation ─────────────────────────────────────────────── */

function validateForm(form: ProfileForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  if (form.username && !/^[a-z0-9_]{3,20}$/.test(form.username)) {
    errors.username = 'Lowercase letters, numbers and underscores only (3–20 chars).';
  }

  if (form.phoneNumber && form.phoneNumber.trim().length < 5) {
    errors.phoneNumber = 'Enter a valid phone number.';
  }

  return errors;
}

/* ── Screen ─────────────────────────────────────────────────── */

/**
 * Edit Profile screen — fully wired to the backend.
 *
 * Flow:
 * 1. Pre-populates form from the Zustand auth store (instant, no flicker)
 * 2. If user picks a new avatar:
 *    a. Upload to Cloudinary via POST /api/upload/avatar
 *    b. Receive the Cloudinary URL
 * 3. On "Save Changes":
 *    a. Validate form
 *    b. PATCH /api/users/me with updated fields
 *    c. Invalidates the TanStack Query cache → profile refreshes
 */
export default function EditProfileScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  /* ── Local state ── */
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    username: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  /* ── Pre-populate form from store when user data is available ── */
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? '',
        username: user.username ?? '',
        phoneNumber: user.phoneNumber ?? '',
      });
      setAvatarUri(user.avatarUrl ?? null);
    }
  }, [user?.clerkId]); // Only re-run when the user identity changes

  /* ── Generic field updater ── */
  const setField = useCallback(
    (key: keyof ProfileForm) =>
      (value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      },
    [],
  );

  /* ── Avatar: pick → upload → store Cloudinary URL ── */
  const handleImagePicked = useCallback(
    async (uri: string, mimeType: string) => {
      setAvatarUri(uri); // Show preview immediately
      setAvatarUploading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error('No auth token');
        const cloudinaryUrl = await uploadAvatar(token, uri, mimeType);
        setPendingAvatarUrl(cloudinaryUrl);
      } catch (err) {
        Alert.alert('Upload Failed', 'Could not upload your photo. Please try again.');
        // Revert preview to the original
        setAvatarUri(user?.avatarUrl ?? null);
      } finally {
        setAvatarUploading(false);
      }
    },
    [getToken, user?.avatarUrl],
  );

  /* ── Save mutation ── */
  const { mutate: saveProfile, isPending: saving } = useMutation({
    mutationFn: async (payload: Partial<AuthUser>) => {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      return updateMe(token, {
        fullName: payload.fullName ?? undefined,
        username: payload.username ?? undefined,
        phoneNumber: payload.phoneNumber ?? undefined,
        avatarUrl: payload.avatarUrl ?? undefined,
      });
    },
    onSuccess: () => {
      // Invalidate the profile cache so useCurrentUser refetches
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      Alert.alert('Profile Updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ?? 'Could not save profile. Please try again.';
      Alert.alert('Save Failed', message);
    },
  });

  const handleSave = useCallback(() => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (avatarUploading) {
      Alert.alert('Please wait', 'Your photo is still uploading.');
      return;
    }

    saveProfile({
      fullName: form.fullName.trim() || undefined,
      username: form.username.trim() || undefined,
      phoneNumber: form.phoneNumber.trim() || undefined,
      avatarUrl: pendingAvatarUrl ?? user?.avatarUrl ?? undefined,
    });
  }, [form, avatarUploading, pendingAvatarUrl, user?.avatarUrl, saveProfile]);

  /* ── Discard guard ── */
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
              onImagePicked={handleImagePicked}
              uploading={avatarUploading}
            />
            <Text style={styles.changePhotoHint}>
              {avatarUploading ? 'Uploading photo…' : 'Tap to change photo'}
            </Text>
          </View>

          {/* ── Section heading ── */}
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
              placeholder="your_username (optional)"
              autoCapitalize="none"
              error={errors.username}
            />

            {/* Email is read-only — managed by Clerk */}
            <EditProfileField
              label="Email Address"
              icon="mail-outline"
              value={user?.email ?? ''}
              onChangeText={() => {}}
              keyboardType="email-address"
              autoCapitalize="none"
              readOnly
            />

            <EditProfileField
              label="Phone Number"
              icon="call-outline"
              value={form.phoneNumber}
              onChangeText={setField('phoneNumber')}
              placeholder="+1 234 567 8900 (optional)"
              keyboardType="phone-pad"
              autoCapitalize="none"
              error={errors.phoneNumber}
            />
          </View>

          {/* ── Save button ── */}
          <View style={styles.saveButtonWrapper}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={saving || avatarUploading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  flex: { flex: 1 },

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
  navSpacer: { width: 44, height: 44 },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },

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

  formSection: { paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 40 },
  saveButtonWrapper: { paddingHorizontal: 24, paddingTop: 16 },
});
