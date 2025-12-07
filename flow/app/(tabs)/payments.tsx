import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import ActionExecutionModal from '../../components/flow/ActionExecutionModal';

const { width } = Dimensions.get('window');

export default function FlowScreen() {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [executedCards, setExecutedCards] = useState<string[]>([]);

  const aiDecisionCards = [
    {
      id: 'shortfall',
      gradient: ['#FF3B30', '#8E44AD'],
      icon: 'shield-checkmark',
      title: 'Shortfall prévu dans 12 jours',
      amount: '-2,100 DH',
      confidence: '93% confiance',
      action: 'Réserver 20% + envoyer rappel à Karim Design',
      successRate: '98%',
      context: 'Karim est en moyenne 11 jours en retard',
      actions: [
        'Envoyer rappel poli à Karim',
        'Réserver 20% du prochain paiement',
        'Mettre à jour ton salaire du 30',
      ],
    },
    {
      id: 'salary',
      gradient: ['#00C853', '#00A040'],
      icon: 'calendar',
      title: 'Ton salaire du 30 décembre',
      amount: '18,000 DH',
      status: 'prêt',
      progress: 89,
      remaining: '1,800 DH',
      context: 'Encore 1,800 DH à sécuriser',
      actions: [
        'Vérifier les paiements restants',
        'Optimiser les réserves automatiques',
      ],
    },
    {
      id: 'tax',
      gradient: ['#FFD700', '#FFA500'],
      icon: 'document-text',
      title: 'Taxe & CNSS',
      amount: '3,450 DH',
      deadline: '15 janvier',
      context: 'à payer avant le 15 janvier',
      action: 'Payer en 1 clic',
      actions: [
        'Préparer le paiement de 3,450 DH',
        'Vérifier les montants CNSS',
        'Programmer le virement automatique',
      ],
    },
    {
      id: 'advance',
      gradient: ['#8E44AD', '#5B21B6'],
      icon: 'cash',
      title: 'Besoin d\'argent maintenant ?',
      amount: '12,000 DH',
      rate: '2.9%',
      context: 'Tu peux prendre jusqu\'à 12,000 DH à 2.9%',
      action: 'Obtenir l\'avance',
      actions: [
        'Calculer les mensualités de remboursement',
        'Vérifier ton éligibilité complète',
        'Débloquer l\'avance sur ton compte',
      ],
    },
    {
      id: 'late',
      gradient: ['#F37021', '#FF8A50'],
      icon: 'time',
      title: 'Karim Design',
      amount: '8,000 DH',
      days: '11 jours de retard',
      context: '11 jours de retard',
      action: 'Envoyer rappel maintenant',
      actions: [
        'Envoyer rappel poli automatique',
        'Proposer un plan de paiement facilité',
      ],
    },
  ];

  const handleCardPress = (card: any) => {
    if (executedCards.includes(card.id)) return;
    setSelectedCard(card);
    setModalVisible(true);
  };

  const handleExecute = () => {
    if (selectedCard) {
      setExecutedCards([...executedCards, selectedCard.id]);
    }
    setModalVisible(false);
    setSelectedCard(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A111F', '#1a1a2e', '#0A111F']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Bonjour Hamza</Text>
              <View style={styles.aiStatus}>
                <View style={styles.aiDot} />
                <Text style={styles.aiStatusText}>FLOW AI Active</Text>
              </View>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCardContainer}>
            <BlurView intensity={40} tint="dark" style={styles.balanceCard}>
              <LinearGradient
                colors={['rgba(22, 24, 46, 0.8)', 'rgba(26, 26, 46, 0.6)']}
                style={styles.balanceGradient}
              >
                <View style={styles.balanceTop}>
                  <Text style={styles.balanceLabel}>Solde disponible</Text>
                  <TouchableOpacity>
                    <Ionicons name="eye-outline" size={20} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.balanceAmount}>18,400 DH</Text>
                <Text style={styles.salaryGuarantee}>
                  Salaire garanti le 30 : 18,000 DH
                </Text>
              </LinearGradient>
            </BlurView>
          </View>

          {/* AI Decision Cards */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recommandations IA</Text>
            
            {aiDecisionCards.map((card) => {
              const isExecuted = executedCards.includes(card.id);
              
              return (
                <TouchableOpacity
                  key={card.id}
                  style={styles.decisionCard}
                  activeOpacity={0.85}
                  onPress={() => handleCardPress(card)}
                  disabled={isExecuted}
                >
                  <BlurView intensity={40} tint="dark" style={styles.decisionCardBlur}>
                    <LinearGradient
                      colors={isExecuted ? ['rgba(0, 200, 83, 0.25)', 'rgba(0, 160, 64, 0.2)'] : card.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.decisionGradient}
                    >
                      {isExecuted ? (
                        <View style={styles.executedState}>
                          <Ionicons name="checkmark-circle" size={48} color="#00C853" />
                          <Text style={styles.executedText}>Protégé ✅</Text>
                        </View>
                      ) : (
                        <>
                          <View style={styles.cardHeader}>
                            <View style={styles.cardIconCircle}>
                              <Ionicons name={card.icon as any} size={28} color="#FFFFFF" />
                            </View>
                            {card.confidence && (
                              <View style={styles.confidenceBadge}>
                                <Text style={styles.confidenceText}>{card.confidence}</Text>
                              </View>
                            )}
                          </View>

                          <Text style={styles.cardTitle}>{card.title}</Text>
                          <Text style={styles.cardAmount}>{card.amount}</Text>

                          {card.progress !== undefined && (
                            <View style={styles.progressContainer}>
                              <View style={styles.progressBg}>
                                <LinearGradient
                                  colors={['#FFFFFF', 'rgba(255,255,255,0.8)']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={[styles.progressFill, { width: `${card.progress}%` }]}
                                />
                              </View>
                            </View>
                          )}

                          {card.context && (
                            <Text style={styles.cardContext}>{card.context}</Text>
                          )}

                          {card.action && (
                            <View style={styles.actionButtonContainer}>
                              <View style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>{card.action}</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                              </View>
                              {card.successRate && (
                                <Text style={styles.successRateText}>Taux de succès: {card.successRate}</Text>
                              )}
                            </View>
                          )}
                        </>
                      )}
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Action Execution Modal */}
        <ActionExecutionModal
          visible={modalVisible}
          card={selectedCard}
          onClose={() => setModalVisible(false)}
          onExecute={handleExecute}
        />
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

  // Header
  header: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  aiStatusText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
  },

  // Balance Card
  balanceCardContainer: {
    marginBottom: 32,
  },
  balanceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceGradient: {
    padding: 24,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1.5,
  },
  salaryGuarantee: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
  },

  // Section
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 20,
  },

  // AI Decision Cards
  decisionCard: {
    marginBottom: 20,
  },
  decisionCardBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  decisionGradient: {
    padding: 24,
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 28,
  },
  cardAmount: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -1,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  cardContext: {
    fontSize: 15,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 20,
    lineHeight: 22,
  },
  actionButtonContainer: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  successRateText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  executedState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  executedText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#00C853',
    marginTop: 16,
  },
});
