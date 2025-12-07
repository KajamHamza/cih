import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function SignInScreen() {
  const router = useRouter();

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      const firstName = credential.fullName?.givenName || '';
      const lastName = credential.fullName?.familyName || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'User';
      
      router.push({
        pathname: '/data-enrichment',
        params: { fullName: fullName }
      });
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        console.log('User canceled Apple Sign In');
      } else {
        console.error('Apple Sign In error:', e);
      }
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      'Google Sign In',
      'Google Sign In requires additional setup. Please use Apple or Create Manually.',
      [{ text: 'OK' }]
    );
  };

  const handleManualSignUp = () => {
    router.push('/signup');
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
        <View style={styles.header}>
          <Text style={styles.logo}>Flow</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.headline}>
            Welcome to the{'\n'}Future of Banking.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.appleButton}
              onPress={handleAppleSignIn}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#000000" style={styles.buttonIcon} />
              <Text style={styles.appleButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.manualButton}
              onPress={handleManualSignUp}
              activeOpacity={0.8}
            >
              <Text style={styles.manualButtonText}>Create Manually</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>Login to Existing Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you accept our <Text style={styles.footerLink}>Terms</Text>.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingTop: 80, paddingBottom: 40, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 60 },
  logo: { fontSize: 32, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: -0.5 },
  content: { flex: 1, justifyContent: 'center' },
  headline: { fontSize: 36, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', lineHeight: 44, marginBottom: 60 },
  buttonContainer: { gap: 16 },
  appleButton: { backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  buttonIcon: { marginRight: 10 },
  appleButtonText: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter', color: '#000000' },
  googleButton: { backgroundColor: '#2D2D2D', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  googleButtonText: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF' },
  manualButton: { backgroundColor: 'transparent', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, borderWidth: 2, borderColor: '#F37021', alignItems: 'center', justifyContent: 'center' },
  manualButtonText: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter', color: '#F37021' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  dividerText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter', color: 'rgba(255, 255, 255, 0.5)', marginHorizontal: 16 },
  loginButton: { backgroundColor: 'transparent', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', textDecorationLine: 'underline' },
  footer: { alignItems: 'center', paddingTop: 20 },
  footerText: { fontSize: 14, fontFamily: 'Inter', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' },
  footerLink: { color: '#FFFFFF', fontWeight: '600', textDecorationLine: 'underline' },
});
