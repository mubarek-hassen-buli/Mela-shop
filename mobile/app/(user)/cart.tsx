import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { PromoCodeInput } from '@/components/cart/PromoCodeInput';
import { OrderSummary } from '@/components/cart/OrderSummary';

export default function CartScreen() {
  const router = useRouter();
  
  // Connect to Zustand store
  const { items, updateQuantity, getSubTotal, getTotal } = useCartStore();

  const subTotal = getSubTotal();
  const total = getTotal();
  const deliveryCharge = items.length > 0 ? 7 : 0;
  const discount = 0;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(user)/index');
            }
          }}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cart</Text>

        <View style={styles.iconButton}>
          <Ionicons name="cart-outline" size={22} color={COLORS.black} />
          {items.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={COLORS.text.tertiary} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrement={() => updateQuantity(item.id, 1)}
                onDecrement={() => updateQuantity(item.id, -1)}
                onPress={() => router.push(`/product/${item.product.id}`)}
              />
            ))}
          </View>
        )}

        {items.length > 0 && (
          <View>
            <PromoCodeInput />
            <OrderSummary
              subTotal={subTotal}
              deliveryCharge={deliveryCharge}
              discount={discount}
              total={total}
            />
          </View>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {items.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.8} style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#F3F4F6', // Matching screenshot light subtle borders
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB', // softer background matching header vibe
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 180, // Accommodate the checkout button + custom bottom tab bar
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginTop: 16,
    fontWeight: '500',
  },
  itemsList: {
    marginBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 110, // Float right above the iOS tab view bar
    left: 16,
    right: 16,
  },
  checkoutBtn: {
    backgroundColor: COLORS.black,
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: 'center',
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
