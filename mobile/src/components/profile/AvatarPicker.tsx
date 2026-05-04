import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface AvatarPickerProps {
  /** Current avatar URI — remote URL or local file:// URI */
  uri?: string | null;
  /** Called with the local file URI after the user picks an image */
  onImagePicked: (uri: string, mimeType: string) => void;
  /** Show a spinner overlay while an upload is in progress */
  uploading?: boolean;
}

/**
 * Circular avatar with a camera-badge overlay.
 *
 * On press, shows an action sheet with "Take Photo" / "Choose from Library".
 * Uses expo-image-picker — requests permissions automatically before launching.
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  uri,
  onImagePicked,
  uploading = false,
}) => {
  /* ── Permission helpers ── */
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access in your device settings.',
      );
      return false;
    }
    return true;
  };

  const requestLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Photo Library Permission Required',
        'Please allow photo library access in your device settings.',
      );
      return false;
    }
    return true;
  };

  /* ── Image picker launchers ── */
  const handleCamera = async () => {
    if (!(await requestCameraPermission())) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onImagePicked(asset.uri, asset.mimeType ?? 'image/jpeg');
    }
  };

  const handleLibrary = async () => {
    if (!(await requestLibraryPermission())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onImagePicked(asset.uri, asset.mimeType ?? 'image/jpeg');
    }
  };

  /* ── Action sheet ── */
  const showOptions = () => {
    Alert.alert('Change Profile Photo', undefined, [
      { text: 'Take Photo', onPress: handleCamera },
      { text: 'Choose from Library', onPress: handleLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={showOptions}
      activeOpacity={0.85}
      disabled={uploading}
    >
      {/* Avatar image */}
      <View style={styles.avatarRing}>
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={52} color={COLORS.text.tertiary} />
          </View>
        )}

        {/* Upload spinner overlay */}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color={COLORS.white} />
          </View>
        )}
      </View>

      {/* Camera badge */}
      <View style={[styles.cameraBadge, uploading && styles.cameraBadgeDimmed]}>
        <Ionicons name="camera" size={16} color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 8,
  },
  avatarRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 3,
    borderColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.white,
  },
  cameraBadgeDimmed: {
    opacity: 0.5,
  },
});
