import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyAcceptanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fullName = params.fullName as string;

  const handleAccept = () => {
    router.push({
      pathname: '/pin-creation',
      params: { fullName: fullName }
    });
  };

  const handleDecline = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A111F', '#1a1a2e']}
        style={styles.gradient}
      >
        <View style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify your identity</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.mainTitle}>
              Notice, Release, and Acceptance of Flow's Identity Verification and Terms of Service
            </Text>

            <View style={styles.section}>
              <Text style={styles.paragraph}>
                Your privacy is important to us. It is Flow's policy to respect your privacy regarding any information we may collect from you through our app and services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.paragraph}>
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.paragraph}>
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.paragraph}>
                For identity verification purposes, we may collect biometric data including facial recognition. This data is encrypted and securely stored in compliance with banking regulations.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.paragraph}>
                By continuing, you agree to Flow's{' '}
                <Text style={styles.link}>Privacy Policy</Text> and{' '}
                <Text style={styles.link}>Terms of Service</Text>.
              </Text>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#F37021', '#FF8C42']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.acceptGradient}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}
              activeOpacity={0.7}
            >
              <Text style={styles.declineText}>Do not accept</Text>
            </TouchableOpacity>
          </View>
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
  safeArea: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    lineHeight: 34,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  link: {
    color: '#00A0E1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  acceptButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#F37021',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  acceptGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  declineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  declineText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
