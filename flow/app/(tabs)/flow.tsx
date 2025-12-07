import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function PaymentsScreen() {
  const [activeInsight, setActiveInsight] = useState(0);

  const weeklyPaymentsTotal = 45250; // Sum of all weekly payments

  const aiInsights = [
    {
      id: 1,
      title: 'Meilleur jour pour payer',
      description: 'Les paiements le lundi ont 35% plus de succès',
      icon: 'calendar',
      gradient: ['#00C853', '#00A040'],
    },
    {
      id: 2,
      title: 'Économisez sur les frais',
      description: 'Regroupez vos paiements pour réduire de 15%',
      icon: 'trending-down',
      gradient: ['#F37021', '#FF8A50'],
    },
    {
      id: 3,
      title: 'Paiement optimal',
      description: 'Le montant idéal par transaction: 5,000 DH',
      icon: 'stats-chart',
      gradient: ['#8E44AD', '#5B21B6'],
    },
  ];

  const paymentTools = [
    {
      id: 1,
      icon: 'link',
      title: 'Payment Link',
      description: 'Générer lien W2W',
      color: '#00C853',
    },
    {
      id: 2,
      icon: 'storefront',
      title: 'Merchant Tools',
      description: 'Outils professionnels',
      color: '#F37021',
    },
    {
      id: 3,
      icon: 'receipt',
      title: 'Auto Invoice',
      description: 'Facturation automatique',
      color: '#FFD700',
    },
    {
      id: 4,
      icon: 'globe',
      title: 'Foreign Currency',
      description: 'Réception multi-devises',
      color: '#8E44AD',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A111F', '#1a1a2e', '#0A111F']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header Search */}
          <View style={styles.searchContainer}>
            <BlurView intensity={40} tint="dark" style={styles.searchBlur}>
              <View style={styles.searchInner}>
                <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un paiement..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </BlurView>
            <TouchableOpacity style={styles.settingsButton}>
              <BlurView intensity={40} tint="dark" style={styles.settingsBlur}>
                <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Weekly Payments Total */}
          <View style={styles.totalContainer}>
            <View style={styles.totalContent}>
              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmount}>{(weeklyPaymentsTotal / 1000).toFixed(0)}K</Text>
                <View style={styles.totalIconCircle}>
                  <Ionicons name="swap-horizontal" size={24} color="#F37021" />
                </View>
              </View>
              <Text style={styles.totalLabel}>Paiements cette semaine</Text>
              <TouchableOpacity style={styles.generateButton}>
                <LinearGradient
                  colors={['rgba(243, 112, 33, 0.2)', 'rgba(243, 112, 33, 0.1)']}
                  style={styles.generateGradient}
                >
                  <Text style={styles.generateText}>Générer Rapport</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Insights Carousel */}
          <View style={styles.insightsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                setActiveInsight(index);
              }}
              scrollEventThrottle={16}
            >
              {aiInsights.map((insight) => (
                <View key={insight.id} style={styles.insightCardWrapper}>
                  <BlurView intensity={40} tint="dark" style={styles.insightCard}>
                    <LinearGradient
                      colors={['rgba(22, 24, 46, 0.8)', 'rgba(26, 26, 46, 0.6)']}
                      style={styles.insightGradient}
                    >
                      <TouchableOpacity style={styles.closeInsight}>
                        <Ionicons name="close" size={16} color="rgba(255,255,255,0.5)" />
                      </TouchableOpacity>
                      <View style={styles.insightContent}>
                        <View style={[styles.insightIcon, { backgroundColor: `${insight.gradient[0]}20` }]}>
                          <Ionicons name={insight.icon as any} size={32} color={insight.gradient[0]} />
                        </View>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <Text style={styles.insightDescription}>{insight.description}</Text>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {aiInsights.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeInsight && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Payment Tools */}
          <View style={styles.toolsSection}>
            <Text style={styles.toolsTitle}>Outils de Paiement</Text>
            {paymentTools.map((tool) => (
              <TouchableOpacity key={tool.id} style={styles.toolItem} activeOpacity={0.85}>
                <BlurView intensity={40} tint="dark" style={styles.toolBlur}>
                  <LinearGradient
                    colors={['rgba(22, 24, 46, 0.8)', 'rgba(26, 26, 46, 0.6)']}
                    style={styles.toolGradient}
                  >
                    <View style={styles.toolLeft}>
                      <View style={[styles.toolIconCircle, { backgroundColor: `${tool.color}20` }]}>
                        <Ionicons name={tool.icon as any} size={24} color={tool.color} />
                      </View>
                      <View style={styles.toolInfo}>
                        <Text style={styles.toolTitle}>{tool.title}</Text>
                        <Text style={styles.toolDescription}>{tool.description}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  // Search Header
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  searchBlur: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 52,
    height: 52,
  },
  settingsBlur: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Total Container
  totalContainer: {
    marginBottom: 32,
  },
  totalContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 72,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    letterSpacing: -3,
  },
  totalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(243, 112, 33, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  generateButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  generateGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(243, 112, 33, 0.3)',
    borderRadius: 24,
  },
  generateText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#F37021',
  },

  // AI Insights
  insightsSection: {
    marginBottom: 32,
  },
  insightCardWrapper: {
    width: width - 40,
    paddingRight: 0,
  },
  insightCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 16,
  },
  insightGradient: {
    padding: 24,
    minHeight: 160,
  },
  closeInsight: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    alignItems: 'center',
  },
  insightIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: '#F37021',
  },

  // Payment Tools
  toolsSection: {
    marginBottom: 24,
  },
  toolsTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  toolItem: {
    marginBottom: 12,
  },
  toolBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  toolGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  toolLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  toolIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
  },
});
