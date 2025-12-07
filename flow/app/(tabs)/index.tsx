import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Clipboard,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const BOTTOM_SHEET_MIN_HEIGHT = 220; // Preview height
const BOTTOM_SHEET_MAX_HEIGHT = height - 200; // Full height

export default function DashboardScreen() {
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [copiedRIB, setCopiedRIB] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [balanceHidden, setBalanceHidden] = useState(false);
  
  // Bottom sheet animation
  const bottomSheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const cards = [
    { id: 1, type: 'main', title: 'Standard', balance: '12,450.00 DH' },
    { id: 2, type: 'pot', title: 'Salary', balance: '8,500.00 DH', color: ['#00A0E1', '#0080C0'], icon: 'wallet' },
    { id: 3, type: 'pot', title: 'Expenses', balance: '2,340.00 DH', color: ['#FF6B35', '#F37021'], icon: 'cart' },
    { id: 4, type: 'pot', title: 'Reserve', balance: '5,200.00 DH', color: ['#00C853', '#00A040'], icon: 'lock-closed' },
  ];

  const transactions = [
    { id: 1, title: 'Client Payment', subtitle: '22 Feb 20:37 · Completed', amount: '+2,719 DH', icon: 'arrow-down-circle', color: '#00C853' },
    { id: 2, title: 'Upwork Transfer', subtitle: '6 Dec 2024, 22:21 · Completed', amount: '+2,719 DH', icon: 'arrow-down-circle', color: '#F37021' },
    { id: 3, title: 'Freelance Invoice', subtitle: '5 Dec 2023, 22:21 · Completed', amount: '+2,719 DH', icon: 'arrow-down-circle', color: '#F37021' },
    { id: 4, title: 'Grocery Shopping', subtitle: '3 Dec 2023, 15:30 · Completed', amount: '-450 DH', icon: 'arrow-up-circle', color: '#FF3B30' },
    { id: 5, title: 'Restaurant', subtitle: '2 Dec 2023, 20:15 · Completed', amount: '-320 DH', icon: 'arrow-up-circle', color: '#FF3B30' },
  ];

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = BOTTOM_SHEET_MIN_HEIGHT - gestureState.dy;
        if (newHeight >= BOTTOM_SHEET_MIN_HEIGHT && newHeight <= BOTTOM_SHEET_MAX_HEIGHT) {
          bottomSheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          // Swipe up - expand
          expandBottomSheet();
        } else if (gestureState.dy > 50) {
          // Swipe down - collapse
          collapseBottomSheet();
        } else {
          // Return to nearest state
          const currentHeight = (bottomSheetHeight as any)._value;
          if (currentHeight > (BOTTOM_SHEET_MIN_HEIGHT + BOTTOM_SHEET_MAX_HEIGHT) / 2) {
            expandBottomSheet();
          } else {
            collapseBottomSheet();
          }
        }
      },
    })
  ).current;

  const expandBottomSheet = () => {
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const collapseBottomSheet = () => {
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const handleCopyRIB = () => {
    Clipboard.setString('MA64 230 000 123 456 789 012 345');
    setCopiedRIB(true);
    setTimeout(() => setCopiedRIB(false), 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A111F', '#1a1a2e', '#0A111F']} style={styles.gradient}>
        {/* Static Content */}
        <View style={styles.staticContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.5)" />
              <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="rgba(255,255,255,0.5)" />
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Balance with Hide/Show */}
          <TouchableOpacity style={styles.balanceSection} onPress={() => setBalanceHidden(!balanceHidden)} activeOpacity={0.7}>
            <Text style={styles.balanceLabel}>Main - MAD</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>{balanceHidden ? '••••••' : '12,450.00 DH'}</Text>
              <Ionicons name={balanceHidden ? "eye-off" : "eye"} size={24} color="rgba(255,255,255,0.5)" style={styles.eyeIcon} />
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setAddMoneyModal(true)}>
              <View style={styles.actionCircle}>
                <Ionicons name="add" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>Add money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setTransferModal(true)}>
              <View style={styles.actionCircle}>
                <Ionicons name="sync" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setMoreModal(true)}>
              <View style={styles.actionCircle}>
                <Ionicons name="ellipsis-horizontal" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>More</Text>
            </TouchableOpacity>
          </View>

          {/* Card Carousel */}
          <View style={styles.cardCarouselSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }], {
                useNativeDriver: false,
                listener: (event: any) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setActiveCardIndex(index);
                }
              })}
              scrollEventThrottle={16}
            >
              {cards.map((card) => (
                <View key={card.id} style={styles.cardWrapper}>
                  <View style={styles.virtualCard}>
                    <LinearGradient
                      colors={card.type === 'main' ? ['#323232', '#1a1a1a', '#0d0d0d'] : card.color}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardGradient}
                    >
                      {/* Glossy overlay */}
                      <View style={styles.cardGlowTop} />
                      
                      <View style={styles.cardInner}>
                        {card.type === 'main' ? (
                          <>
                            {/* Top Row */}
                            <View style={styles.cardTop}>
                              <View style={styles.cihBadge}>
                                <Text style={styles.cihBadgeText}>CIH</Text>
                                <Text style={styles.bankText}>BANK</Text>
                              </View>
                              <View style={styles.debitBadge}>
                                <Text style={styles.debitText}>DEBIT</Text>
                              </View>
                            </View>

                            {/* Middle - Chip */}
                            <View style={styles.cardChipSection}>
                              <View style={styles.chipContainerNew}>
                                <LinearGradient
                                  colors={['#F4E4A0', '#D4AF37', '#FFE082']}
                                  style={styles.chipNew}
                                >
                                  <View style={styles.chipPatternNew} />
                                </LinearGradient>
                              </View>
                            </View>

                            {/* Card Number */}
                            <View style={styles.cardNumberRow}>
                              <View style={styles.numberDots}>
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                              </View>
                              <View style={styles.numberDots}>
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                              </View>
                              <View style={styles.numberDots}>
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                                <View style={styles.dotSmall} />
                              </View>
                              <Text style={styles.lastFourDigits}>4321</Text>
                            </View>

                            {/* Bottom Row */}
                            <View style={styles.cardBottomRow}>
                              <View>
                                <Text style={styles.cardholderLabel}>CARDHOLDER</Text>
                                <Text style={styles.cardholderName}>YOUR NAME</Text>
                              </View>
                              <View style={styles.mastercardLogoNew}>
                                <View style={[styles.circle, styles.circleLeft]} />
                                <View style={[styles.circle, styles.circleRight]} />
                              </View>
                            </View>
                          </>
                        ) : (
                          <View style={styles.potCardContent}>
                            <View style={styles.cardGlowTop} />
                            <View style={styles.potHeader}>
                              <View style={styles.potIconCircle}>
                                <Ionicons name={card.icon as any} size={28} color="#FFFFFF" />
                              </View>
                              <Text style={styles.potTitle}>{card.title}</Text>
                            </View>
                            <Text style={styles.potBalance}>{card.balance}</Text>
                            <TouchableOpacity style={styles.managePotButton}>
                              <Text style={styles.managePotText}>Manage</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {cards.map((_, index) => (
                <View key={index} style={[styles.paginationDot, index === activeCardIndex && styles.paginationDotActive]} />
              ))}
            </View>
          </View>
        </View>

        {/* Swipeable Transaction Bottom Sheet */}
        <Animated.View 
          style={[
            styles.bottomSheet,
            { height: bottomSheetHeight }
          ]}
        >
          {/* Pull Handle */}
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Transaction Header */}
          <View style={styles.transactionHeaderSection}>
            <View style={styles.transactionTitleRow}>
              <Text style={styles.transactionTitle}>Transactions</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.transactionDateRow}>
              <Text style={styles.transactionDate}>4 Feb 2025</Text>
              <View style={styles.transactionIcons}>
                <Ionicons name="stats-chart-outline" size={16} color="rgba(255,255,255,0.5)" style={{ marginRight: 12 }} />
                <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.5)" />
              </View>
            </View>
          </View>

          {/* Transactions List */}
          <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
            {transactions.map((tx) => (
              <TouchableOpacity key={tx.id} style={styles.transactionItem}>
                <View style={[styles.txIcon, { backgroundColor: `${tx.color}20` }]}>
                  <Ionicons name={tx.icon as any} size={20} color={tx.color} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSubtitle}>{tx.subtitle}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Modals */}
      <Modal visible={addMoneyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setAddMoneyModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Money</Text>
            <TouchableOpacity style={styles.optionCard}>
              <View style={styles.optionIcon}>
                <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Apple Pay</Text>
                <Text style={styles.optionSubtitle}>Instant top-up</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(235,0,27,0.15)' }]}>
                <Text style={styles.mastercardText}>MC</Text>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Mastercard</Text>
                <Text style={styles.optionSubtitle}>Credit/Debit card</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard} onPress={handleCopyRIB}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(0,160,225,0.15)' }]}>
                <Ionicons name="business" size={24} color="#00A0E1" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Bank Transfer</Text>
                <Text style={styles.optionSubtitle}>{copiedRIB ? '✓ RIB Copied!' : 'MA64 230 000 123 456...'}</Text>
              </View>
              <Ionicons name={copiedRIB ? "checkmark-circle" : "copy-outline"} size={20} color={copiedRIB ? "#00C853" : "rgba(255,255,255,0.5)"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(243,112,33,0.15)' }]}>
                <Ionicons name="qr-code" size={24} color="#F37021" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>CIH Cash Deposit</Text>
                <Text style={styles.optionSubtitle}>Scan QR at ATM</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={transferModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setTransferModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Transfer</Text>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(0,160,225,0.15)' }]}>
                <Ionicons name="people" size={24} color="#00A0E1" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>To Flow User</Text>
                <Text style={styles.optionSubtitle}>Instant & Free</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(243,112,33,0.15)' }]}>
                <Ionicons name="business" size={24} color="#F37021" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Bank Transfer</Text>
                <Text style={styles.optionSubtitle}>RIB/IBAN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(255,107,53,0.15)' }]}>
                <Ionicons name="globe" size={24} color="#FF6B35" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>International</Text>
                <Text style={styles.optionSubtitle}>SWIFT Transfer</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={moreModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setMoreModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>More Actions</Text>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(0,160,225,0.15)' }]}>
                <Ionicons name="card" size={24} color="#00A0E1" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Order Physical Card</Text>
                <Text style={styles.optionSubtitle}>Premium metal - 299 DH</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(243,112,33,0.15)' }]}>
                <Ionicons name="document-text" size={24} color="#F37021" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Request Statement</Text>
                <Text style={styles.optionSubtitle}>PDF or Email</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(255,107,53,0.15)' }]}>
                <Ionicons name="help-circle" size={24} color="#FF6B35" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Get Help</Text>
                <Text style={styles.optionSubtitle}>24/7 Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  staticContent: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter' },
  settingsButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  balanceSection: { alignItems: 'center', paddingVertical: 20 },
  balanceLabel: { fontSize: 14, fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  balanceAmount: { fontSize: 42, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: -1 },
  eyeIcon: { marginTop: 4 },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 40, marginBottom: 28, gap: 24 },
  actionButton: { alignItems: 'center' },
  actionCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  actionText: { fontSize: 13, fontFamily: 'Inter', color: 'rgba(255,255,255,0.8)' },
  
  cardCarouselSection: { paddingBottom: 24 },
  cardWrapper: { width: width, paddingHorizontal: 20 },
  virtualCard: { width: CARD_WIDTH, height: 214, borderRadius: 20, overflow: 'hidden', shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  cardGradient: { flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  cardGlowTop: { position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(243, 112, 33, 0.15)', opacity: 0.6 },
  cardInner: { flex: 1, padding: 24, justifyContent: 'space-between' },
  
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cihBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  cihBadgeText: { fontSize: 16, fontWeight: '900', fontFamily: 'Inter', color: '#0A111F', letterSpacing: 1.5 },
  bankText: { fontSize: 8, fontWeight: '700', fontFamily: 'Inter', color: '#0A111F', letterSpacing: 1, marginTop: -2 },
  debitBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  debitText: { fontSize: 11, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 0.5 },
  
  cardChipSection: { marginTop: 20 },
  chipContainerNew: { shadowColor: '#FFD700', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4 },
  chipNew: { width: 48, height: 38, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  chipPatternNew: { width: 38, height: 28, borderRadius: 5, borderWidth: 1.5, borderColor: 'rgba(0, 0, 0, 0.2)' },
  
  cardNumberRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  numberDots: { flexDirection: 'row', gap: 4 },
  dotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  lastFourDigits: { fontSize: 22, fontWeight: '500', fontFamily: 'Inter', color: '#E8E8E8', letterSpacing: 3 },
  
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardholderLabel: { fontSize: 9, fontFamily: 'Inter', color: '#999999', marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  cardholderName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', letterSpacing: 0.5 },
  mastercardLogoNew: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  circle: { width: 24, height: 24, borderRadius: 12 },
  circleLeft: { backgroundColor: '#EB001B', marginRight: -8, zIndex: 1 },
  circleRight: { backgroundColor: '#F79E1B', zIndex: 2 },
  
  potCardContent: { flex: 1, justifyContent: 'space-between' },
  potHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  potIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  potTitle: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF' },
  potBalance: { fontSize: 32, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', marginTop: 20 },
  managePotButton: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  managePotText: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF' },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  paginationDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  paginationDotActive: { width: 20, backgroundColor: '#F37021' },
  
  // Bottom Sheet Styles
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#16182E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderTopWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  transactionHeaderSection: { marginBottom: 20 },
  transactionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  transactionTitle: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF' },
  paginationInline: { flexDirection: 'row', gap: 4 },
  pageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  pageDotActive: { width: 16, backgroundColor: '#F37021' },
  filterButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  transactionDateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transactionDate: { fontSize: 13, fontFamily: 'Inter', color: 'rgba(255,255,255,0.5)' },
  transactionIcons: { flexDirection: 'row', alignItems: 'center' },
  transactionsList: { flex: 1 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', marginBottom: 4 },
  txSubtitle: { fontSize: 12, fontFamily: 'Inter', color: 'rgba(255,255,255,0.4)' },
  txAmount: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter' },
  seeAllButton: { marginTop: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  seeAllText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter', color: '#00A0E1' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalBackdrop: { flex: 1 },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter', color: '#FFFFFF', marginBottom: 20 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  optionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionInfo: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter', color: '#FFFFFF', marginBottom: 4 },
  optionSubtitle: { fontSize: 13, fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)' },
  mastercardText: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter', color: '#EB001B' },
});
