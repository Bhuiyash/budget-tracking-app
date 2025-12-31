import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BudgetLogo from './BudgetLogo';

const { width, height } = Dimensions.get('window');

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const [slideAnim] = useState(new Animated.Value(-width));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      description: 'App preferences and configuration',
      onPress: () => {
        onClose();
        Alert.alert('Settings', 'Settings page coming soon!');
      },
    },
    {
      id: 'export',
      title: 'Export Data',
      icon: 'download-outline',
      description: 'Download your expense data',
      onPress: () => {
        onClose();
        Alert.alert('Export', 'Export functionality coming soon!');
      },
    },
    {
      id: 'backup',
      title: 'Backup & Sync',
      icon: 'cloud-upload-outline',
      description: 'Backup your data to cloud',
      onPress: () => {
        onClose();
        Alert.alert('Backup', 'Cloud backup coming soon!');
      },
    },
    {
      id: 'categories',
      title: 'Manage Categories',
      icon: 'list-outline',
      description: 'Customize expense categories',
      onPress: () => {
        onClose();
        Alert.alert('Categories', 'Category management coming soon!');
      },
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: 'bar-chart-outline',
      description: 'Detailed expense reports',
      onPress: () => {
        onClose();
        Alert.alert('Reports', 'Advanced reporting coming soon!');
      },
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      description: 'App information and credits',
      onPress: () => {
        onClose();
        Alert.alert(
          'About Budget Tracker',
          'Version 1.0\n\nA modern expense tracking app built with React Native and Expo.\n\nDeveloped by Bhuiyash Kumar\n\nFeatures:\n• Track daily expenses\n• Categorize spending\n• View analytics and insights\n• Export data\n\n© 2026 Budget Tracker'
        );
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.drawerHeader}>
            <BudgetLogo size="medium" showText={true} color="#3b82f6" />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color="#3b82f6"
                  />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerText}>
              Budget Tracker v1.0
            </Text>
            <Text style={styles.footerSubtext}>
              Made with ❤️ by Bhuiyash Kumar
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#ffffff',
    height: height,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 16,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
});
