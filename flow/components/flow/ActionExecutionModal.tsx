import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ActionExecutionModalProps {
  visible: boolean;
  card: any;
  onClose: () => void;
  onExecute: () => void;
}

export default function ActionExecutionModal({
  visible,
  card,
  onClose,
  onExecute,
}: ActionExecutionModalProps) {
  const [checkmarks, setCheckmarks] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const confettiAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      setCheckmarks([]);
      setShowSuccess(false);
      scaleAnim.setValue(0);
      confettiAnim.setValue(0);
    }
  }, [visible]);

  const handleExecute = () => {
    // Start animated checkmarks
    if (card?.actions && Array.isArray(card.actions)) {
      card.actions.forEach((_action: string, index: number) => {
        setTimeout(() => {
          setCheckmarks((prev) => [...prev, index]);
        }, index * 400);
      });

      // Show success after all checkmarks
      setTimeout(() => {
        setShowSuccess(true);
        
        // Success animation
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();

        // Close modal and execute after animation
        setTimeout(() => {
          onExecute();
        }, 1500);
      }, (card.actions.length * 400) + 500);
    }
  };

  if (!card) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#16182E', '#1a1a2e']}
            style={styles.modalGradient}
          >
            {!showSuccess ? (
              <>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                </View>

                {/* Summary */}
                <Text style={styles.summaryTitle}>Je vais faire ça pour toi :</Text>

                <View style={styles.actionsList}>
                  {card.actions && card.actions.map((action: string, index: number) => (
                    <View key={index} style={styles.actionItem}>
                      <View style={styles.actionCheckContainer}>
                        {checkmarks.includes(index) ? (
                          <Ionicons name="checkmark-circle" size={24} color="#00C853" />
                        ) : (
                          <View style={styles.emptyCheckCircle} />
                        )}
                      </View>
                      <Text style={[
                        styles.actionText,
                        checkmarks.includes(index) && styles.actionTextCompleted
                      ]}>
                        {action}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Execute Button */}
                <TouchableOpacity
                  style={styles.executeButton}
                  onPress={handleExecute}
                  disabled={checkmarks.length > 0}
                >
                  <LinearGradient
                    colors={['#F37021', '#FF8A50']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.executeGradient}
                  >
                    <Text style={styles.executeButtonText}>
                      {checkmarks.length > 0 ? 'En cours...' : 'Exécuter maintenant'}
                    </Text>
                    {checkmarks.length === 0 && (
                      <Ionicons name="flash" size={24} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              // Success Screen
              <View style={styles.successContainer}>
                <Animated.View
                  style={[
                    styles.successContent,
                    {
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <View style={styles.successIconCircle}>
                    <Ionicons name="checkmark-circle" size={80} color="#00C853" />
                  </View>
                  <Text style={styles.successTitle}>C'est fait ! ✨</Text>
                  <Text style={styles.successSubtitle}>Ton argent est protégé</Text>
                </Animated.View>

                {/* Confetti Effect */}
                <Animated.View
                  style={[
                    styles.confettiContainer,
                    {
                      opacity: confettiAnim,
                      transform: [{
                        translateY: confettiAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -100],
                        }),
                      }],
                    },
                  ]}
                >
                  {[...Array(12)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.confetti,
                        {
                          left: `${(i * 8) + 10}%`,
                          backgroundColor: i % 3 === 0 ? '#F37021' : i % 3 === 1 ? '#00C853' : '#FFD700',
                        },
                      ]}
                    />
                  ))}
                </Animated.View>
              </View>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  actionsList: {
    flex: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  actionCheckContainer: {
    marginRight: 16,
  },
  emptyCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.8)',
  },
  actionTextCompleted: {
    color: '#00C853',
    fontWeight: '600',
  },
  executeButton: {
    marginTop: 16,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  executeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  executeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
  },
  successIconCircle: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
