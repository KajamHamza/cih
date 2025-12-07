import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OTP_LENGTH = 6;

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string; // 'email' or 'phone'
  const contact = params.contact as string; // email or phone number
  const fullName = params.fullName as string; // user's full name
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const borderAnimations = useRef(
    Array(OTP_LENGTH).fill(0).map(() => new Animated.Value(0))
  ).current;

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValues = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedValues.forEach((val, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = val;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedValues.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '') && index === OTP_LENGTH - 1) {
      // Flash green animation
      flashGreen();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const flashGreen = () => {
    // Animate all borders to green
    Animated.parallel(
      borderAnimations.map(anim =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      )
    ).start(() => {
      // Navigate to next screen
      setTimeout(() => {
        if (type === 'email') {
          router.push({
            pathname: '/data-enrichment',
            params: { fullName: fullName }
          });
        } else {
          // Phone verification complete - go to privacy acceptance
          router.push({
            pathname: '/privacy-acceptance',
            params: { fullName: fullName }
          });
        }
      }, 300);
    });
  };

  const getBorderColor = (index: number) => {
    const animValue = borderAnimations[index];
    
    if (otp.every(digit => digit !== '')) {
      // All filled - green flash
      return animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255, 0.8)', '#00C853'],
      });
    } else if (focusedIndex === index) {
      // Active - orange glow
      return '#F37021';
    } else if (otp[index]) {
      // Filled - white border
      return 'rgba(255, 255, 255, 0.8)';
    } else {
      // Empty - grey border
      return 'rgba(255, 255, 255, 0.2)';
    }
  };

  const getHeaderText = () => {
    if (type === 'email') {
      return 'Check your email.';
    }
    return 'Check your SMS.';
  };

  const getSubtext = () => {
    if (type === 'email') {
      return `Code sent to ${contact}`;
    }
    // Format phone: +212 6XX-XX-XX-89
    const formatted = contact.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3-$4');
    return `Code sent to +212 ${formatted}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00A0E1', '#005F8C', '#1a1a2e', '#2a1a1e', '#FF6B35']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.header}>
            <Text style={styles.logo}>Flow</Text>
          </View>

          {/* Header */}
          <View style={styles.textContainer}>
            <Text style={styles.headline}>{getHeaderText()}</Text>
            <Text style={styles.subtext}>{getSubtext()}</Text>
          </View>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.otpBox,
                  {
                    borderColor: getBorderColor(index),
                    shadowColor: focusedIndex === index ? '#F37021' : 'transparent',
                  },
                ]}
              >
                <TextInput
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={otp[index]}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              </Animated.View>
            ))}
          </View>

          {/* Resend Code */}
          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>
              Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
            </Text>
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
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  textContainer: {
    marginBottom: 50,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  otpBox: {
    width: 52,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  otpInput: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  resendLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
