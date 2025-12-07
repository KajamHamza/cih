import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingWelcome() {
  const router = useRouter();
  
  // Animation values for floating circles
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create floating animations
    const createFloatAnimation = (animValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start all animations
    createFloatAnimation(float1, 3000).start();
    createFloatAnimation(float2, 4000).start();
    createFloatAnimation(float3, 3500).start();
    pulseAnimation.start();
  }, []);

  // Interpolate animation values
  const float1TranslateY = float1.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  const float2TranslateY = float2.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -20],
  });

  const float3TranslateY = float3.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 15],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00A0E1', '#005F8C', '#1a1a2e', '#2a1a1e', '#FF6B35']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Logo Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>Flow</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.headline}>
            Ready to change{'\n'}the way you{'\n'}money!
          </Text>

          {/* Animated Floating Circles Visual */}
          <View style={styles.visualContainer}>
            {/* Large outer circle */}
            <Animated.View
              style={[
                styles.circle,
                styles.circleLarge,
                {
                  transform: [
                    { scale: pulse },
                    { translateY: float1TranslateY },
                  ],
                },
              ]}
            />
            
            {/* Medium circle */}
            <Animated.View
              style={[
                styles.circle,
                styles.circleMedium,
                {
                  transform: [{ translateY: float2TranslateY }],
                },
              ]}
            />
            
            {/* Small accent circle */}
            <Animated.View
              style={[
                styles.circle,
                styles.circleSmall,
                {
                  transform: [{ translateY: float3TranslateY }],
                },
              ]}
            />

            {/* Center dot */}
            <View style={styles.centerDot} />
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/signin')}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 60,
  },
  visualContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
  },
  circleLarge: {
    width: 200,
    height: 200,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circleMedium: {
    width: 140,
    height: 140,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    right: -20,
    top: 30,
  },
  circleSmall: {
    width: 80,
    height: 80,
    borderColor: 'rgba(0, 160, 225, 0.4)',
    backgroundColor: 'rgba(0, 160, 225, 0.15)',
    left: -10,
    bottom: 20,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  footer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#1a1a2e',
  },
});
