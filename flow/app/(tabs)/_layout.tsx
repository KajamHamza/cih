import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint="dark"
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: 'hidden',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              backgroundColor: 'rgba(10, 17, 31, 0.9)',
              borderTopWidth: 1,
              borderLeftWidth: 0.5,
              borderRightWidth: 0.5,
              borderColor: 'rgba(255, 255, 255, 0.15)',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          />
        ),
        tabBarActiveTintColor: '#F37021',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Inter',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={focused ? 26 : 24} 
                color={color}
                style={{ zIndex: 10 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Hub',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Ionicons 
                name={focused ? 'briefcase' : 'briefcase-outline'} 
                size={focused ? 26 : 24} 
                color={color}
                style={{ zIndex: 10 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Flow',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.centerButton}>
              <View style={styles.centerButtonInner}>
                <Ionicons name="water" size={28} color="#FFFFFF" style={{ zIndex: 10 }} />
              </View>
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            fontFamily: 'Inter',
            marginTop: 4,
          },
        }}
      />
      <Tabs.Screen
        name="flow"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Ionicons 
                name={focused ? 'send' : 'send-outline'} 
                size={focused ? 26 : 24} 
                color={color}
                style={{ zIndex: 10 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={focused ? 26 : 24} 
                color={color}
                style={{ zIndex: 10 }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    // No background - icon visibility through color only
  },
  inactiveIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -32,
    backgroundColor: 'rgba(10, 17, 31, 0.9)',
    borderWidth: 4,
    borderColor: 'rgba(10, 17, 31, 0.9)',
    shadowColor: '#F37021',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F37021',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
