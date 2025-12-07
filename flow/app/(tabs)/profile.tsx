import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [podsEnabled, setPodsEnabled] = useState(false);
  const [autoEntrepreneurEnabled, setAutoEntrepreneurEnabled] = useState(false);
  const [podsModalVisible, setPodsModalVisible] = useState(false);
  const [salaryThreshold, setSalaryThreshold] = useState('5000');

  const cards = [
    { id: 1, type: 'Disposable', balance: '2.50 DH', gradient: ['#9D7BEA', '#7B5FD3'], logo: 'mastercard' },
    { id: 2, type: 'Virtual', balance: '2.50 DH', gradient: ['#F3A69A', '#E57373'], logo: 'mastercard' },
    { id: 3, type: 'Standard', balance: '960.00 DH', gradient: ['#81C4E8', '#5DADE2'], logo: 'mastercard' },
    { id: 4, type: 'add', balance: '', gradient: ['#4A5568', '#2D3748'], logo: 'add' },
  ];

  const menuItems = [
    { id: 1, icon: 'person-circle-outline', title: 'Profile settings', color: '#FFFFFF' },
    { id: 2, icon: 'document-text-outline', title: 'Documents & Statements', color: '#FFFFFF' },
    { id: 3, icon: 'color-palette-outline', title: 'Appearance', color: '#FFFFFF' },
    { id: 4, icon: 'mail-outline', title: 'Inbox', color: '#FFFFFF' },
    { id: 5, icon: 'headset-outline', title: 'Help 24/7', color: '#FFFFFF' },
    { id: 6, icon: 'location-outline', title: 'ATM', color: '#FFFFFF' },
    { id: 7, icon: 'log-out-outline', title: 'Log out', color: '#FFFFFF' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A111F', '#1a1a2e', '#0A111F']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6', '#1E3A8A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeCard}
            >
              <View style={styles.welcomeGlow} />
              <Text style={styles.welcomeLabel}>Welcome</Text>
              <Text style={styles.userName}>Hamza EL Kajam</Text>
            </LinearGradient>
          </View>

          {/* Card Carousel */}
          <View style={styles.cardSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardCarousel}
              snapToInterval={90}
              decelerationRate="fast"
            >
              {cards.map((card) => (
                <View key={card.id} style={styles.miniCardWrapper}>
                  <LinearGradient
                    colors={card.gradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.miniCard}
                  >
                    {card.type === 'add' ? (
                      <View style={styles.addCardContent}>
                        <View style={styles.addCircle}>
                          <Ionicons name="add" size={20} color="#FFFFFF" />
                        </View>
                      </View>
                    ) : (
                      <>
                        <View style={styles.cardLogoContainer}>
                          {card.logo === 'visa' && (
                            <Text style={styles.visaLogo}>VISA</Text>
                          )}
                          {card.logo === 'mastercard' && (
                            <View style={styles.mastercardMini}>
                              <View style={[styles.mcCircle, styles.mcLeft]} />
                              <View style={[styles.mcCircle, styles.mcRight]} />
                            </View>
                          )}
                        </View>
                      </>
                    )}
                  </LinearGradient>
                  <Text style={styles.cardType}>{card.type}</Text>
                  {card.balance && <Text style={styles.cardBalance}>{card.balance}</Text>}
                  {card.type === 'add' && <Text style={styles.cardBalance}>Add new</Text>}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Business Controls Section */}
          <View style={styles.controlsSection}>
            {/* Pods Control */}
            <TouchableOpacity style={styles.controlCard} onPress={() => setPodsModalVisible(true)} activeOpacity={0.7}>
              <View style={styles.controlLeft}>
                <View style={[styles.controlIcon, { backgroundColor: 'rgba(0, 200, 83, 0.15)' }]}>
                  <Ionicons name="wallet-outline" size={24} color="#00C853" />
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Pods Control</Text>
                  <Text style={styles.controlSubtitle}>
                    {podsEnabled ? `Threshold: ${salaryThreshold} DH` : 'Set salary threshold'}
                  </Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: podsEnabled ? '#00C853' : 'rgba(255,255,255,0.3)' }]} />
                <Text style={styles.statusText}>{podsEnabled ? 'On' : 'Off'}</Text>
              </View>
            </TouchableOpacity>

            {/* Auto Entrepreneur Control */}
            <View style={styles.controlCard}>
              <View style={styles.controlLeft}>
                <View style={[styles.controlIcon, { backgroundColor: 'rgba(0, 160, 225, 0.15)' }]}>
                  <Ionicons name="briefcase-outline" size={24} color="#00A0E1" />
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Auto Entrepreneur</Text>
                  <Text style={styles.controlSubtitle}>Business & freelancer tools</Text>
                </View>
              </View>
              <Switch
                value={autoEntrepreneurEnabled}
                onValueChange={setAutoEntrepreneurEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#F37021' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="rgba(255,255,255,0.2)"
              />
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconCircle}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                {item.id !== 7 && (
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>

      {/* Pods Threshold Modal */}
      <Modal visible={podsModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setPodsModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Pods Control Settings</Text>
            <Text style={styles.modalDescription}>
              Set a monthly salary threshold. When your balance exceeds this amount, excess funds will be automatically distributed to your pots.
            </Text>
            
            <View style={styles.thresholdSection}>
              <Text style={styles.thresholdLabel}>Salary Threshold (DH)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.thresholdInput}
                  value={salaryThreshold}
                  onChangeText={setSalaryThreshold}
                  keyboardType="numeric"
                  placeholder="5000"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
                <Text style={styles.currencyLabel}>DH</Text>
              </View>
            </View>

            <View style={styles.toggleSection}>
              <Text style={styles.toggleLabel}>Enable Pods Control</Text>
              <Switch
                value={podsEnabled}
                onValueChange={setPodsEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#F37021' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="rgba(255,255,255,0.2)"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setPodsModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Settings</Text>
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
  scrollContent: { paddingTop: 60 },
  
  // Welcome Section
  welcomeSection: { paddingHorizontal: 20, marginBottom: 24 },
  welcomeCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  welcomeGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
  },
  welcomeLabel: {
    fontSize: 15,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  // Card Carousel
  cardSection: { marginBottom: 28 },
  cardCarousel: { paddingHorizontal: 20, gap: 16 },
  miniCardWrapper: { alignItems: 'center' },
  miniCard: {
    width: 80,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    justifyContent: 'space-between',
  },
  cardLogoContainer: { alignSelf: 'flex-start' },
  visaLogo: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mastercardMini: { flexDirection: 'row', alignItems: 'center' },
  mcCircle: { width: 10, height: 10, borderRadius: 5 },
  mcLeft: { backgroundColor: '#EB001B', marginRight: -4, zIndex: 1 },
  mcRight: { backgroundColor: '#F79E1B', zIndex: 2 },
  addCardContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginTop: 8,
  },
  cardBalance: {
    fontSize: 11,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },

  // Business Controls
  controlsSection: { paddingHorizontal: 20, marginBottom: 24, gap: 12 },
  controlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  controlLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  controlIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  controlInfo: { flex: 1 },
  controlTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  controlSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: 20,
    backgroundColor: 'rgba(30, 30, 46, 0.6)',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
    marginBottom: 24,
  },
  thresholdSection: {
    marginBottom: 24,
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  thresholdInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  currencyLabel: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 8,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#F37021',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#F37021',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
});
