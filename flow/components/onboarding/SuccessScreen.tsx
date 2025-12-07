import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Clipboard, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  
  const confettiRef = useRef<any>(null);
  const cardRotateY = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardTranslateY = useRef(new Animated.Value(-100)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => confettiRef.current?.start(), 600);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(cardScale, { toValue: 1, tension: 12, friction: 7, useNativeDriver: true }),
        Animated.spring(cardTranslateY, { toValue: 0, tension: 12, friction: 7, useNativeDriver: true }),
        Animated.timing(cardRotateY, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(contentSlide, { toValue: 0, tension: 15, friction: 7, useNativeDriver: true }),
      ]),
    ]).start(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(buttonPulse, { toValue: 1.04, duration: 1400, useNativeDriver: true }),
        Animated.timing(buttonPulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])).start();
    });
  }, []);

  const rotateY = cardRotateY.interpolate({ inputRange: [0, 1], outputRange: ['95deg', '0deg'] });
  const handleCopyIBAN = () => {
    Clipboard.setString('MA64 230 XXX XXX XXX XXX');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A111F', '#1a1a2e', '#0A111F']} locations={[0, 0.5, 1]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ConfettiCannon ref={confettiRef} count={200} origin={{ x: width / 2, y: -10 }} fadeOut explosionSpeed={380} fallSpeed={2600} colors={['#F37021', '#00A0E1', '#FFFFFF', '#FF8C42']} />

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: cardScale }, { translateY: cardTranslateY }, { perspective: 1500 }, { rotateY: rotateY }] }]}>
            <View style={styles.cardShadow} />
            <LinearGradient colors={['#2d2d2d', '#1d1d1d', '#0d0d0d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              <View style={styles.cardGlow} />
              <View style={styles.cardInner}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardBrand}>FLOW</Text>
                  <View style={styles.chipContainer}>
                    <View style={styles.chip}><View style={styles.chipPattern} /></View>
                  </View>
                </View>
                <View style={styles.cardMiddle}><Text style={styles.cardNumber}>•••• •••• •••• 4321</Text></View>
                <View style={styles.cardBottom}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>CARDHOLDER</Text>
                    <Text style={styles.cardHolder} numberOfLines={1}>YOUR NAME</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>EXPIRES</Text>
                    <Text style={styles.cardExpiry}>12/28</Text>
                  </View>
                  <View style={styles.mastercardLogo}>
                    <View style={[styles.circle, styles.circleLeft]} />
                    <View style={[styles.circle, styles.circleRight]} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>You're All Set!</Text>
              <Text style={styles.subtitle}>Your Flow account is ready</Text>
            </View>

            <TouchableOpacity style={styles.ibanCard} onPress={handleCopyIBAN} activeOpacity={0.7}>
              <View style={styles.ibanHeader}>
                <View style={styles.ibanIconCircle}><Ionicons name="card-outline" size={20} color="#F37021" /></View>
                <Text style={styles.ibanTitle}>Your IBAN</Text>
              </View>
              <View style={styles.ibanBody}>
                <Text style={styles.ibanNumber}>MA64 230 XXX XXX XXX XXX</Text>
                <View style={styles.copyIndicator}>
                  {copied ? (
                    <View style={styles.copiedBadge}>
                      <Ionicons name="checkmark-circle" size={18} color="#00C853" />
                      <Text style={styles.copiedText}>Copied</Text>
                    </View>
                  ) : <Ionicons name="copy-outline" size={18} color="#F37021" />}
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.noticeCard}>
              <View style={styles.noticeHeader}>
                <View style={styles.noticeIconCircle}><Ionicons name="call" size={18} color="#FFFFFF" /></View>
                <Text style={styles.noticeTitle}>Final Verification</Text>
              </View>
              <Text style={styles.noticeText}>CIH Bank will call you within 24-48 hours to verify your identity and fully activate your account.</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonPulse }] }]}>
            <TouchableOpacity style={styles.enterButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
              <LinearGradient colors={['#F37021', '#FF8C42']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Enter Flow</Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingHorizontal: 20, paddingBottom: 30 },
  cardWrapper: { alignItems: 'center', marginBottom: 40 },
  cardShadow: { position: 'absolute', width: 340, height: 214, borderRadius: 20, backgroundColor: '#000000', opacity: 0.4, top: 8, left: 0, right: 0, marginHorizontal: 'auto' },
  card: { width: 340, height: 214, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  cardGlow: { position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(243, 112, 33, 0.15)', opacity: 0.6 },
  cardInner: { flex: 1, padding: 24, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 3 },
  chipContainer: { shadowColor: '#FFD700', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4 },
  chip: { width: 48, height: 38, borderRadius: 8, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center' },
  chipPattern: { width: 38, height: 28, borderRadius: 5, borderWidth: 1.5, borderColor: 'rgba(0, 0, 0, 0.2)' },
  cardMiddle: { marginTop: 20 },
  cardNumber: { fontSize: 22, fontWeight: '500', fontFamily: 'Inter', color: '#E8E8E8', letterSpacing: 3 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardInfo: { flex: 1 },
  cardLabel: { fontSize: 9, fontFamily: 'Inter', color: '#999999', marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  cardHolder: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 0.5 },
  cardExpiry: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 0.5 },
  mastercardLogo: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  circle: { width: 24, height: 24, borderRadius: 12 },
  circleLeft: { backgroundColor: '#EB001B', marginRight: -8, zIndex: 1 },
  circleRight: { backgroundColor: '#F79E1B', zIndex: 2 },
  content: { paddingHorizontal: 4 },
  titleSection: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 32, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 15, fontFamily: 'Inter', color: 'rgba(255, 255, 255, 0.6)' },
  ibanCard: { backgroundColor: 'rgba(255, 255, 255, 0.06)', borderWidth: 1, borderColor: 'rgba(243, 112, 33, 0.25)', borderRadius: 18, padding: 18, marginBottom: 14 },
  ibanHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  ibanIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(243, 112, 33, 0.15)', justifyContent: 'center', alignItems: 'center' },
  ibanTitle: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF' },
  ibanBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ibanNumber: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 0.5 },
  copyIndicator: { marginLeft: 12 },
  copiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copiedText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter', color: '#00C853' },
  noticeCard: { backgroundColor: 'rgba(243, 112, 33, 0.08)', borderWidth: 1, borderColor: 'rgba(243, 112, 33, 0.2)', borderRadius: 18, padding: 18, marginBottom: 28 },
  noticeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  noticeIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F37021', justifyContent: 'center', alignItems: 'center' },
  noticeTitle: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF' },
  noticeText: { fontSize: 13, fontFamily: 'Inter', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 20 },
  buttonWrapper: { marginTop: 8 },
  enterButton: { borderRadius: 26, overflow: 'hidden', shadowColor: '#F37021', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 10 },
  buttonGradient: { paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonText: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 0.3 },
});
