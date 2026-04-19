import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const PromoCodeInput: React.FC = () => {
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter promo code"
        placeholderTextColor={COLORS.text.tertiary}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
      />
      <TouchableOpacity 
        style={styles.applyButton} 
        activeOpacity={0.8}
        onPress={() => {
          // Implement promo validation logic here
        }}
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.accent, // Using brand accent as requested
    padding: 6,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.text.primary,
  },
  applyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  applyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2A00', // Deep olive/black color for contrast over the lime accent
  },
});
