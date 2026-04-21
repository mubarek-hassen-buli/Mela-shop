import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface AvatarPickerProps {
  /** Current avatar URI — can be a remote URL or a local file:// URI */
  uri?: string;
  /** Called with the chosen local image URI after the user picks one */
  onImagePicked: (uri: string) => void;
}

/**
 * Circular avatar with a camera-badge overlay.
 *
 * On press it shows an action sheet (native iOS sheet / Android alert)
 * with "Take Photo" and "Choose from Library" options.
 *
 * Image-picker integration is stubbed — replace the TODO bodies
 * with expo-image-picker calls when the package is installed.
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  uri,
  onImagePicked,
}) => {
  const showOptions = () => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
          title: 'Change Profile Photo',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) handleCamera();
          if (buttonIndex === 1) handleLibrary();
        },
      );
    } else {
      // Android fallback — simple Alert
      Alert.alert('Change Profile Photo', undefined, [
        { text: 'Take Photo', onPress: handleCamera },
        { text: 'Choose from Library', onPress: handleLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleCamera = () => {
    // TODO: launch expo-image-picker camera
    // const result = await ImagePicker.launchCameraAsync({ ... });
    // if (!result.canceled) onImagePicked(result.assets[0].uri);
  };

  const handleLibrary = () => {
    // TODO: launch expo-image-picker media library
    // const result = await ImagePicker.launchImageLibraryAsync({ ... });
    // if (!result.canceled) onImagePicked(result.assets[0].uri);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={showOptions}
      activeOpacity={0.85}
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
      </View>

      {/* Camera badge */}
      <View style={styles.cameraBadge}>
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
});
