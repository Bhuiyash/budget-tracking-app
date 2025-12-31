import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BudgetIconProps {
  size?: number;
  backgroundColor?: string;
}

// Simple React Native icon using Ionicons - for immediate use
export function SimpleBudgetIcon({ size = 80, backgroundColor = '#3b82f6' }: BudgetIconProps) {
  return (
    <View style={[
      styles.simpleContainer, 
      { 
        width: size, 
        height: size, 
        backgroundColor,
        borderRadius: size * 0.15 
      }
    ]}>
      <Ionicons 
        name="wallet" 
        size={size * 0.6} 
        color="white" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  simpleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
