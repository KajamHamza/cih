import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DataEnrichmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fullName = params.fullName as string;
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [ifNumber, setIfNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handlePhoneChange = (text: string) => {
    // Only allow numbers and limit to 9 digits after +212
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 9) {
      setPhoneNumber(numbers);
    }
  };

  const handleCinChange = (text: string) => {
    // Capitalize and limit to 8 characters
    const formatted = text.toUpperCase().slice(0, 8);
    setCinNumber(formatted);
  };

  const handleIfChange = (text: string) => {
    // Capitalize and limit to 8 characters
    const formatted = text.toUpperCase().slice(0, 8);
    setIfNumber(formatted);
  };

  const handleDobChange = (text: string) => {
    // Format as DD/MM/YYYY
    const numbers = text.replace(/[^0-9]/g, '');
    let formatted = numbers;
    
    if (numbers.length >= 2) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 4) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    setDateOfBirth(formatted);
  };

  const handleContinue = () => {
    // TODO: Validate and send OTP
    if (phoneNumber.length === 9 && cinNumber.length === 8 && ifNumber.length === 8 && dateOfBirth.length === 10) {
      // Navigate to phone OTP verification with full name
      router.push({
        pathname: '/otp-verification',
        params: { type: 'phone', contact: phoneNumber, fullName: fullName }
      });
    }
  };

  const isFormValid = phoneNumber.length === 9 && cinNumber.length === 8 && ifNumber.length === 8 && dateOfBirth.length === 10;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00A0E1', '#005F8C', '#1a1a2e', '#2a1a1e', '#FF6B35']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>Flow</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.headline}>Let's set up your profile.</Text>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                {/* Phone Number */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View
                    style={[
                      styles.phoneInputBox,
                      focusedField === 'phone' && styles.inputFocused,
                    ]}
                  >
                    <View style={styles.countryCode}>
                      <Text style={styles.flag}>🇲🇦</Text>
                      <Text style={styles.prefix}>+212</Text>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      value={phoneNumber}
                      onChangeText={handlePhoneChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="6XX XXX XXX"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="phone-pad"
                      maxLength={9}
                    />
                  </View>
                </View>

                {/* CIN Number */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>CIN Number</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === 'cin' && styles.inputFocused,
                    ]}
                    value={cinNumber}
                    onChangeText={handleCinChange}
                    onFocus={() => setFocusedField('cin')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="XX123456"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    autoCapitalize="characters"
                    maxLength={8}
                  />
                </View>

                {/* Identifiant Fiscal (IF) */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Identifiant Fiscal (Auto-Entrepreneur)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === 'if' && styles.inputFocused,
                    ]}
                    value={ifNumber}
                    onChangeText={handleIfChange}
                    onFocus={() => setFocusedField('if')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="IF123456"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    autoCapitalize="characters"
                    maxLength={8}
                  />
                </View>

                {/* Date of Birth */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === 'dob' && styles.inputFocused,
                    ]}
                    value={dateOfBirth}
                    onChangeText={handleDobChange}
                    onFocus={() => setFocusedField('dob')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !isFormValid && styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>

              {/* Footer */}
              <Text style={styles.footerText}>
                This information helps us verify your identity and comply with banking regulations.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 24,
    marginBottom: 32,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  phoneInputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 20,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#FFFFFF',
    padding: 0,
  },
  inputFocused: {
    borderColor: '#F37021',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#1a1a2e',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
