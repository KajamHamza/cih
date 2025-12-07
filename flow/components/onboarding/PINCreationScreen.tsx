import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

export default function PINCreationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fullName = params.fullName as string;
  const PIN_LENGTH = 6;
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handlePinChange = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    
    if (!isConfirming) {
      if (numbers.length <= PIN_LENGTH) {
        setPin(numbers);
        
        if (numbers.length === PIN_LENGTH) {
          setTimeout(() => {
            setIsConfirming(true);
            setConfirmPin('');
            setError('');
            inputRef.current?.focus();
          }, 300);
        }
      }
    } else {
      if (numbers.length <= PIN_LENGTH) {
        setConfirmPin(numbers);
        
        if (numbers.length === PIN_LENGTH) {
          setTimeout(() => {
            if (numbers === pin) {
              setShowBiometric(true);
            } else {
              setError('PINs do not match. Try again.');
              setTimeout(() => {
                setPin('');
                setConfirmPin('');
                setIsConfirming(false);
                setError('');
                inputRef.current?.focus();
              }, 1500);
            }
          }, 300);
        }
      }
    }
  };

  const handleEnableBiometric = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (compatible && enrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable Face ID',
          fallbackLabel: 'Use PIN instead',
        });
        
        if (result.success) {
          setShowBiometric(false);
          router.push({
            pathname: '/success',
            params: { name: fullName }
          });
        }
      } else {
        setShowBiometric(false);
        router.push({
          pathname: '/success',
          params: { name: fullName }
        });
      }
    } catch (error) {
      console.error('Biometric error:', error);
      setShowBiometric(false);
      router.push({
        pathname: '/success',
        params: { name: fullName }
      });
    }
  };

  const handleSkipBiometric = () => {
    setShowBiometric(false);
    router.push({
      pathname: '/success',
      params: { name: fullName }
    });
  };

  const currentPin = isConfirming ? confirmPin : pin;
  const headerText = isConfirming ? 'Confirm passcode' : 'Create passcode';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.content}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{headerText}</Text>
          <Text style={styles.subtitle}>
            Passcode should be 6 digits
          </Text>
        </View>

        {/* Error Message */}
        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* PIN Circles */}
        <View style={styles.circlesContainer}>
          {Array(PIN_LENGTH).fill(0).map((_, index) => (
            <View
              key={index}
              style={[
                styles.circle,
                currentPin[index] && styles.circleFilled,
              ]}
            />
          ))}
        </View>

        {/* Hidden Input - Uses Phone Keyboard */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={currentPin}
          onChangeText={handlePinChange}
          keyboardType="number-pad"
          maxLength={PIN_LENGTH}
          autoFocus
          caretHidden
          selectionColor="transparent"
        />

        <Text style={styles.tapInstruction}>Tap to enter PIN</Text>
      </TouchableOpacity>

      {/* Biometric Bottom Sheet */}
      <Modal
        visible={showBiometric}
        transparent
        animationType="slide"
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleSkipBiometric}
          />
          <View style={styles.bottomSheet}>
            <LinearGradient
              colors={['#1a1a2e', '#2a2a3e']}
              style={styles.bottomSheetContent}
            >
              <View style={styles.handleBar} />

              <View style={styles.biometricIconLarge}>
                <Ionicons name="scan" size={56} color="#F37021" />
              </View>

              <Text style={styles.bottomSheetTitle}>Enable Face ID?</Text>
              
              <Text style={styles.bottomSheetText}>
                Use Face ID to securely and instantly access Flow without entering your PIN every time.
              </Text>
              
              <View style={styles.bottomSheetButtons}>
                <TouchableOpacity
                  style={styles.enableButtonSheet}
                  onPress={handleEnableBiometric}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#F37021', '#FF8C42']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.enableButtonGradient}
                  >
                    <Ionicons name="scan-circle" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.enableButtonText}>Enable Face ID</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.skipButtonSheet}
                  onPress={handleSkipBiometric}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipButtonSheetText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A111F',
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  circleFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  tapInstruction: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 20,
  },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  bottomSheetContent: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  biometricIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(243, 112, 33, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(243, 112, 33, 0.3)',
  },
  bottomSheetTitle: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  bottomSheetText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  bottomSheetButtons: {
    gap: 12,
  },
  enableButtonSheet: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#F37021',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  enableButtonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  enableButtonText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  skipButtonSheet: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonSheetText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
