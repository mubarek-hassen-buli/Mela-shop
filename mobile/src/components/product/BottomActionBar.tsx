import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface BottomActionBarProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
}

/**
 * Fixed bottom bar with a quantity stepper on the left and an
 * "Add to Cart" pill button on the right. Sits above safe-area.
 */
export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
}) => {
  const formattedQty = String(quantity).padStart(2, '0');

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {/* Quantity stepper */}
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={onDecrement}
            activeOpacity={0.7}
            style={styles.stepperButton}
          >
            <Ionicons name="remove" size={20} color={COLORS.black} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{formattedQty}</Text>

          <TouchableOpacity
            onPress={onIncrement}
            activeOpacity={0.7}
            style={styles.stepperButton}
          >
            <Ionicons name="add" size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        {/* Add to Cart button */}
        <TouchableOpacity
          onPress={onAddToCart}
          activeOpacity={0.8}
          style={styles.cartButton}
        >
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderLight,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    minWidth: 28,
    textAlign: 'center',
  },
  cartButton: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
