# CIH Banking Platform

A comprehensive banking solution combining a modern mobile application with AI-powered financial insights and predictions.

## 📱 Project Structure

This repository contains two main components:

### 1. **Flow** - Mobile Banking Application
A premium mobile banking app built with Expo and React Native, featuring:
- 🎨 Modern glassmorphism UI with dark mode support
- 🔐 Secure authentication (PIN, biometric, SSO)
- 💳 Virtual card management
- 💸 Quick payments and transfers
- 📊 Transaction history and insights
- 🤖 AI-powered financial predictions
- 👤 User profile management

**Tech Stack:**
- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- TypeScript
- Expo Router for navigation
- React Native Reanimated for animations

### 2. **AI Model LSTM (For Now)** - Financial Prediction Engine
Machine learning system for financial forecasting and insights:
- 📈 LSTM-based transaction prediction
- 🤖 AI agent for financial recommendations (`Flow_agent.py`)
- 📊 Time series analysis
- 💾 Model training and inference pipeline

**Components:**
- `trainLSTM.py` - Model training script
- `Flow_agent.py` - AI agent for financial insights
- `tsf.csv` - Training dataset
- `models/` - Saved model checkpoints
- `outputs/` - Prediction results
- `plots/` - Visualization outputs

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Mobile App Setup

```bash
# Navigate to the Flow directory
cd flow

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

### AI Model Setup

```bash
# Navigate to the AI Model directory
cd "AI Model LSTM (For Now)"

# Install Python dependencies (create requirements.txt first)
pip install tensorflow pandas numpy scikit-learn matplotlib

# Train the model
python trainLSTM.py

# Run the AI agent
python Flow_agent.py
```

---

## 📱 Mobile App Features

### Authentication & Onboarding
- Phone number/email signup
- OTP verification
- PIN creation
- Biometric authentication
- Privacy acceptance
- Data enrichment
- Success screen with confetti

### Main Features
- **Dashboard**: Balance overview, virtual card, quick actions, recent transactions
- **Cards**: Manage multiple virtual cards
- **Payments**: Quick transfers and bill payments
- **Flow**: AI-powered insights and predictions
- **Profile**: Account settings and preferences

### UI/UX Highlights
- Smooth animations with Reanimated
- Haptic feedback
- Parallax scrolling
- Blur effects
- Linear gradients
- Dark mode support

---

## 🤖 AI Model Features

### Capabilities
- Time series forecasting for transactions
- Cash flow predictions
- Spending pattern analysis
- Financial recommendations
- Anomaly detection

### Training Pipeline
1. Load historical transaction data
2. Preprocess and normalize
3. Train LSTM model
4. Validate and save checkpoints
5. Generate predictions

---

## 📂 Key Files

### Mobile App
- `flow/app/(tabs)/` - Main app screens (dashboard, cards, payments, flow, profile)
- `flow/app/onboarding.tsx` - Onboarding flow entry point
- `flow/components/onboarding/` - Onboarding screens
- `flow/constants/theme.ts` - Theme configuration

### AI Model
- `trainLSTM.py` - LSTM model training
- `Flow_agent.py` - AI agent implementation
- `tsf.csv` - Transaction dataset

---

## 🛠️ Development

### Code Style
The mobile app uses:
- ESLint for code linting
- TypeScript for type safety
- Expo's recommended configuration

```bash
# Run linter
cd flow
npm run lint
```

### Testing
```bash
# Start dev server for testing
cd flow
npm start
```

---

## 📄 License

Private project - All rights reserved

---

## 👥 Contributing

This is a private repository. Contact the project maintainer for collaboration opportunities.

---

## 📧 Support

For questions or issues, please contact the development team.

---

**Last Updated:** December 2025
