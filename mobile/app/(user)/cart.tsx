import React from 'react';
import { View, Text } from 'react-native';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

/** Placeholder — will be implemented in a later phase */
export default function CartScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold text-gray-400">Cart</Text>
        <Text className="text-sm text-gray-300 mt-2">Coming soon</Text>
      </View>
    </ScreenWrapper>
  );
}
