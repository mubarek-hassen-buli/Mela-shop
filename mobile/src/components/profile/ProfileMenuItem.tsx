import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ProfileMenuItemProps {
  /** Icon name from Ionicons */
  icon: IoniconsName;
  /** Menu item label */
  label: string;
  /** Optional trailing text (e.g. "English (US)") */
  trailingText?: string;
  /** If true, shows a Switch instead of chevron */
  isToggle?: boolean;
  /** Toggle value (only used when isToggle is true) */
  toggleValue?: boolean;
  /** Called when the toggle changes (only used when isToggle is true) */
  onToggleChange?: (value: boolean) => void;
  /** Called when the row is pressed (not used when isToggle is true) */
  onPress?: () => void;
}

/**
 * A single row item for the Profile menu list.
 * Supports three variants:
 *  1. Chevron row (default) — navigates somewhere
 *  2. Trailing-text row — shows info + chevron
 *  3. Toggle row — shows a Switch control
 */
export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  trailingText,
  isToggle = false,
  toggleValue = false,
  onToggleChange,
  onPress,
}) => {
  const content = (
    <View style={styles.container}>
      {/* Leading icon */}
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={22} color={COLORS.text.primary} />
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Trailing content */}
      <View style={styles.trailingWrapper}>
        {isToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggleChange}
            trackColor={{
              false: COLORS.border,
              true: COLORS.accent,
            }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.border}
          />
        ) : (
          <>
            {trailingText && (
              <Text style={styles.trailingText}>{trailingText}</Text>
            )}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.text.tertiary}
            />
          </>
        )}
      </View>
    </View>
  );

  if (isToggle) {
    return content;
  }

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  trailingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trailingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '400',
  },
});
