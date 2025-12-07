import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import InvoiceCreatorModal from '../../components/business/InvoiceCreatorModal';

const { width } = Dimensions.get('window');

export default function BusinessHubScreen() {
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  const promoCards = [
    {
      id: 1,
      title: 'Invoice in 8 seconds',
      subtitle: 'Fast, professional invoicing',
      icon: 'flash',
      color: '#F37021',
    },
    {
      id: 2,
      title: 'Track your expenses',
      subtitle: 'Scan receipts instantly',
      icon: 'receipt',
      color: '#00A0E1',
    },
    {
      id: 3,
      title: 'Manage clients easily',
      subtitle: 'CRM built for freelancers',
      icon: 'people',
      color: '#00C853',
    },
    {
      id: 4,
      title: 'Auto tax calculation',
      subtitle: 'Never miss a payment',
      icon: 'calculator',
      color: '#FF6B35',
    },
  ];

  const businessData = {
    turnover: 140000,
    turnoverLimit: 200000,
    taxReserved: 3450,
    status: 'Active',
    taxSeasonActive: false,
  };

  const menuItems = [
    { id: 1, title: 'New Invoice', subtitle: 'Create & send', icon: 'document-text', color: '#F37021' },
    { id: 2, title: 'Expenses', subtitle: 'Scan receipts', icon: 'receipt', color: '#00A0E1' },
    { id: 3, title: 'Clients', subtitle: 'Manage CRM', icon: 'people', color: '#00C853' },
    { id: 4, title: 'Documents', subtitle: 'Attestations', icon: 'folder', color: '#FF6B35' },
  ];

  const progress = (businessData.turnover / businessData.turnoverLimit) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A111F', '#1a1a2e', '#0A111F']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Business Hub</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Promo Banner Carousel */}
          <View style={styles.promoBannerContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              decelerationRate="fast"
              onScroll={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setActivePromoIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {promoCards.map((card) => (
                <View key={card.id} style={styles.promoCardWrapper}>
                  <View style={styles.promoCard}>
                    <LinearGradient
                      colors={[`${card.color}26`, `${card.color}0D`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.promoGradient}
                    >
                      <View style={styles.promoContent}>
                        <View style={[styles.promoIconCircle, { backgroundColor: `${card.color}33` }]}>
                          <Ionicons name={card.icon as any} size={24} color={card.color} />
                        </View>
                        <View style={styles.promoText}>
                          <Text style={styles.promoTitle}>{card.title}</Text>
                          <Text style={styles.promoSubtitle}>{card.subtitle}</Text>
                        </View>
                        <TouchableOpacity>
                          <Ionicons name="close" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              ))}
            </ScrollView>
            {/* Pagination dots */}
            <View style={styles.promoPagination}>
              {promoCards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.promoDot,
                    index === activePromoIndex && styles.promoDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Tax Engine Card */}
          <View style={styles.taxEngineCard}>
            <LinearGradient
              colors={['#1a3a5c', '#0d1f35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.taxEngineGradient}
            >
              <View style={styles.taxEngineHeader}>
                <Text style={styles.taxEngineTitle}>Tax Engine</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{businessData.status}</Text>
                </View>
              </View>

              <View style={styles.turnoverSection}>
                <View style={styles.turnoverLabels}>
                  <Text style={styles.turnoverLabel}>
                    Turnover: <Text style={styles.turnoverValue}>{businessData.turnover.toLocaleString()} DH</Text>
                  </Text>
                  <Text style={styles.limitLabel}>
                    Limit: {businessData.turnoverLimit.toLocaleString()} DH
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <LinearGradient
                      colors={['#F37021', '#FF8A50']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressBarFill, { width: `${progress}%` }]}
                    />
                  </View>
                </View>
                <Text style={styles.autoEntrepreneurStatus}>Auto-Entrepreneur Status</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Tax Pot Widget */}
          <View style={styles.taxPotCard}>
            <View style={styles.taxPotLeft}>
              <View style={styles.jarIconContainer}>
                <Ionicons name="wallet" size={32} color="#FFD700" />
                <View style={styles.coinIndicator}>
                  <View style={[styles.coin, { bottom: 8, left: 4 }]} />
                  <View style={[styles.coin, { bottom: 16, left: 12 }]} />
                  <View style={[styles.coin, { bottom: 24, left: 8 }]} />
                </View>
              </View>
              <View style={styles.taxPotTextContainer}>
                <Text style={styles.taxPotLabel}>Tax Reserve</Text>
                <Text style={styles.taxPotAmount}>{businessData.taxReserved.toLocaleString()} DH</Text>
                <Text style={styles.taxPotSubtext}>Reserved for authorities</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.payButton,
                !businessData.taxSeasonActive && styles.payButtonDisabled,
              ]}
              disabled={!businessData.taxSeasonActive}
            >
              <Text
                style={[
                  styles.payButtonText,
                  !businessData.taxSeasonActive && styles.payButtonTextDisabled,
                ]}
              >
                Pay Now
              </Text>
            </TouchableOpacity>
          </View>

          {/* Business Tools Grid */}
          <View style={styles.gridContainer}>
            <Text style={styles.sectionTitle}>Business Tools</Text>
            <View style={styles.grid}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.id === 1) {
                      setInvoiceModalVisible(true);
                    }
                  }}
                >
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" style={styles.menuChevron} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Invoice Creator Modal */}
        <InvoiceCreatorModal
          visible={invoiceModalVisible}
          onClose={() => setInvoiceModalVisible(false)}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { paddingTop: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Promo Banner
  promoBannerContainer: { marginBottom: 24 },
  promoCardWrapper: {
    width: width,
    paddingHorizontal: 20,
  },
  promoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promoGradient: { padding: 16 },
  promoContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  promoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoText: { flex: 1 },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
  },
  promoPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  promoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  promoDotActive: { width: 20, backgroundColor: '#F37021' },

  // Tax Engine Card
  taxEngineCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  taxEngineGradient: { padding: 20 },
  taxEngineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  taxEngineTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#00C853',
  },
  turnoverSection: {},
  turnoverLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  turnoverLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
  },
  turnoverValue: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  limitLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.5)',
  },
  progressBarContainer: { marginBottom: 12 },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: 8, borderRadius: 4 },
  autoEntrepreneurStatus: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.5)',
  },

  // Tax Pot Widget
  taxPotCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#16182E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  taxPotLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  jarIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coinIndicator: { position: 'absolute', width: 56, height: 56 },
  coin: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  taxPotTextContainer: { flex: 1 },
  taxPotLabel: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  taxPotAmount: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  taxPotSubtext: {
    fontSize: 11,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.4)',
  },
  payButton: {
    backgroundColor: '#F37021',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  payButtonDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  payButtonText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  payButtonTextDisabled: { color: 'rgba(255,255,255,0.3)' },

  // Business Tools Grid
  gridContainer: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuCard: {
    width: (width - 52) / 2,
    backgroundColor: '#16182E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  menuChevron: { position: 'absolute', top: 16, right: 16 },
});
