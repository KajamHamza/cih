import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface InvoiceCreatorModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InvoiceCreatorModal({ visible, onClose }: InvoiceCreatorModalProps) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');

  const clients = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com' },
    { id: 2, name: 'TechStart SA', email: 'info@techstart.ma' },
    { id: 3, name: 'Design Studio', email: 'hello@designstudio.com' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
      resetForm();
    }
  };

  const handleGenerateAndShare = async () => {
    try {
      const invoiceDetails = `Invoice for ${selectedClient}\nService: ${service}\nAmount: ${amount} DH`;
      await Share.share({
        message: invoiceDetails,
        title: 'Invoice',
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error sharing invoice:', error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedClient('');
    setService('');
    setAmount('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#16182E', '#1a1a2e']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Invoice</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={[
                    styles.progressDot,
                    s <= step && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Step 1: Client Selection */}
              {step === 1 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>Who is this for?</Text>
                  <Text style={styles.stepSubtitle}>Select a client or add a new one</Text>

                  {clients.map((client) => (
                    <TouchableOpacity
                      key={client.id}
                      style={[
                        styles.clientCard,
                        selectedClient === client.name && styles.clientCardActive,
                      ]}
                      onPress={() => setSelectedClient(client.name)}
                    >
                      <View style={styles.clientAvatar}>
                        <Text style={styles.clientInitial}>{client.name[0]}</Text>
                      </View>
                      <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>{client.name}</Text>
                        <Text style={styles.clientEmail}>{client.email}</Text>
                      </View>
                      {selectedClient === client.name && (
                        <Ionicons name="checkmark-circle" size={24} color="#F37021" />
                      )}
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.addClientButton}>
                    <Ionicons name="add-circle-outline" size={24} color="#F37021" />
                    <Text style={styles.addClientText}>Add New Client</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Step 2: Service & Amount */}
              {step === 2 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>What did you do?</Text>
                  <Text style={styles.stepSubtitle}>Describe the service and amount</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Service Description</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Web Development"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={service}
                      onChangeText={setService}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Amount (DH)</Text>
                    <View style={styles.amountInputContainer}>
                      <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                      />
                      <Text style={styles.currencyLabel}>DH</Text>
                    </View>
                  </View>

                  {amount && (
                    <View style={styles.taxInfo}>
                      <View style={styles.taxRow}>
                        <Text style={styles.taxLabel}>Subtotal</Text>
                        <Text style={styles.taxValue}>{amount} DH</Text>
                      </View>
                      <View style={styles.taxRow}>
                        <Text style={styles.taxLabel}>TVA (20%)</Text>
                        <Text style={styles.taxValue}>{(parseFloat(amount) * 0.2).toFixed(2)} DH</Text>
                      </View>
                      <View style={[styles.taxRow, styles.taxRowTotal]}>
                        <Text style={styles.taxLabelTotal}>Total</Text>
                        <Text style={styles.taxValueTotal}>{(parseFloat(amount) * 1.2).toFixed(2)} DH</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>Review Invoice</Text>
                  <Text style={styles.stepSubtitle}>Check details before sending</Text>

                  <View style={styles.previewCard}>
                    <LinearGradient
                      colors={['rgba(243, 112, 33, 0.1)', 'rgba(243, 112, 33, 0.05)']}
                      style={styles.previewGradient}
                    >
                      <View style={styles.previewHeader}>
                        <View style={styles.previewLogo}>
                          <Text style={styles.previewLogoText}>CIH</Text>
                        </View>
                        <View style={styles.invoiceBadge}>
                          <Text style={styles.invoiceBadgeText}>INVOICE</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Client</Text>
                        <Text style={styles.previewValue}>{selectedClient}</Text>
                      </View>

                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Service</Text>
                        <Text style={styles.previewValue}>{service}</Text>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabelBold}>Total Amount</Text>
                        <Text style={styles.previewValueBold}>
                          {(parseFloat(amount) * 1.2).toFixed(2)} DH
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>

                  <TouchableOpacity style={styles.generateButton} onPress={handleGenerateAndShare}>
                    <LinearGradient
                      colors={['#F37021', '#FF8A50']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.generateGradient}
                    >
                      <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.generateButtonText}>Generate & Share</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {/* Bottom Action Button */}
            {step < 3 && (
              <View style={styles.bottomAction}>
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    (step === 1 && !selectedClient) || (step === 2 && (!service || !amount))
                      ? styles.nextButtonDisabled
                      : null,
                  ]}
                  onPress={handleNext}
                  disabled={(step === 1 && !selectedClient) || (step === 2 && (!service || !amount))}
                >
                  <Text style={styles.nextButtonText}>
                    {step === 1 ? 'Continue' : 'Review'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: '#F37021',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
  },

  // Client Selection
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  clientCardActive: {
    borderColor: '#F37021',
    backgroundColor: 'rgba(243, 112, 33, 0.1)',
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F37021',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientInitial: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.5)',
  },
  addClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(243, 112, 33, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(243, 112, 33, 0.3)',
    borderStyle: 'dashed',
    gap: 8,
  },
  addClientText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#F37021',
  },

  // Service & Amount
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.5)',
    paddingRight: 16,
  },
  taxInfo: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taxRowTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginBottom: 0,
  },
  taxLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
  },
  taxValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  taxLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  taxValueTotal: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#F37021',
  },

  // Review
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  previewGradient: {
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewLogo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  previewLogoText: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Inter',
    color: '#0A111F',
    letterSpacing: 1.5,
  },
  invoiceBadge: {
    backgroundColor: 'rgba(243, 112, 33, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  invoiceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#F37021',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  previewLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  previewValueBold: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#F37021',
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },

  // Bottom Action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#16182E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F37021',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
});
