import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface OrderSummaryProps {
  subTotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subTotal,
  deliveryCharge,
  discount,
  total,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Sub Total</Text>
        <Text style={styles.value}>${subTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Charge</Text>
        <Text style={styles.value}>${deliveryCharge.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={styles.value}>${discount.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB', // softer background matching screenshot's card vibe
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
});
