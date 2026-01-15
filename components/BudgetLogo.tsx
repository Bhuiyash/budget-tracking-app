import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BudgetLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
}

export default function BudgetLogo({ 
  size = 'medium', 
  showText = true, 
  color = '#3b82f6' 
}: BudgetLogoProps) {
  const sizeConfig = {
    small: { iconSize: 24, fontSize: 16, containerSize: 40 },
    medium: { iconSize: 32, fontSize: 20, containerSize: 50 },
    large: { iconSize: 48, fontSize: 24, containerSize: 70 },
  };

  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View style={[
        styles.logoContainer,
        {
          width: config.containerSize,
          height: config.containerSize,
          backgroundColor: color,
        }
      ]}>
        <Ionicons 
          name="wallet" 
          size={config.iconSize} 
          color="white" 
        />
      </View>
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.appName, { fontSize: config.fontSize, color }]}>
            Budget
          </Text>
          <Text style={[styles.appSubtitle, { fontSize: config.fontSize - 4, color }]}>
            Tracker
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  appName: {
    fontWeight: '900',
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  appSubtitle: {
    fontWeight: '600',
    opacity: 0.8,
    letterSpacing: 0.3,
    marginTop: -2,
  },
});
