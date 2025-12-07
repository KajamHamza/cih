
# FLOW – Official Technical & Functional Specification Document

**Version 1.0 – December 2025**

**Product:** FLOW – The Digital Bank for Moroccan Freelancers

**Company:** Team FluxMasters

**Status:** Ready for Development – MVP Launch March 2026

### 1. Product Vision

FLOW is the first and only complete digital bank built exclusively for Morocco’s 1.5 million+ freelancers, auto-entrepreneurs, delivery riders, creators, and micro-businesses.

It is not a feature inside CIH app.

It is the **default banking app** every freelancer in Morocco will have on their home screen in 2026.

### 2. Core Functionalities (MVP – March 2026)

### 2.1 Instant Banking Infrastructure (CIH-powered)

- Instant opening of a real bank account with CIH IBAN (even if previously unbanked)
- Unlimited virtual debit cards (one per client/project)
- Premium physical metal card (optional, black matte, 299 DH)
- Apple Pay / Google Pay / Samsung Pay
- Zero-fee transfers under 20 000 DH

### 2.2 Professional Invoicing & Payment Collection

- Create beautiful invoice in 8 seconds (Arabic / French / English)
- Generate payment link (W2W or merchant)
- Send via WhatsApp, SMS, email, Instagram DM
- Client pays → money lands in 3 seconds
- Automatic reminder system: +7 days (polite), +14 days (firmer), +21 days (final notice)
- Foreign currency reception (USD/EUR) with best rate

### 2.3 Automatic Tax & CNSS Management

- Auto-detection of auto-entrepreneur regime
- Real-time calculation of tax (0.5% or 1%) and CNSS
- One-tap payment of tax + CNSS directly to authorities
- Generates official declaration PDF ready for Barid Al-Maghrib
- Alert 60 days and 30 days before 200k/500k turnover ceiling
- Automatic suggestion to create SARL when limit approached

### 2.4 AI Financial Guardian (Agentic – The Killer Feature)

- Real-time cash-flow prediction engine (7–30 days ahead)
- When risk detected → AI sends proactive message:
    
    > "Salam Hamza, ghadi ykoun shortfall dyal 2 100 DH f 12 yum. Bghiti n-dir chi haja?"
    > 
- Proposes 3 ranked options with real success probability:
    1. Recommended (Safe): Reserve 20% + send reminder → 98% success
    2. Balanced: Take 8 000 DH salary advance at 2.9%
    3. Aggressive: Wait and risk it
- User taps “Execute Option 1” → AI performs all actions automatically

### 2.5 Income Smoothing – Fixed Salary Every 30th

- User chooses: “I want 15 000 DH net every 30th of the month”
- AI automatically creates smart pots and moves money
- On the 30th at 9:00 AM: notification “Your salary is here – 15 000 DH 🎉”

### 2.6 Salary Advance (Instant Micro-Credit)

- Up to 70% of predicted monthly income
- Instant approval, no paperwork
- Special rate for FLOW users (2.9–4.9%)
- Repaid automatically when client pays

### 2.7 Smart Pots System

- Tax Pot (locked until payment)
- Emergency Pot (target: 3 months expenses)
- Vacation Pot
- Investment Pot (future CIH products)
- AI suggests allocation every time money arrives

### 2.8 FLOW Shield – Blockchain-Verified Identity (Already Built)

- Every important action recorded on Solana Devnet
- Generate “Verified FLOW Freelancer” certificate (PDF + QR code)
- Contains: payment reliability score, tax compliance, total income proof
- Usable for loans, apartments, new clients, visa applications

### 2.9 Additional Daily Tools

- Client CRM (payment delay tracking, risk score)
- Gig rate calculator by city/skill
- Tax-deductible expense tracking
- Contract templates with e-signature

### 3. Technical Stack (Production-Ready)

| Layer | Technology |
| --- | --- |
| Mobile App | React Native Expo SDK 51 + NativeWind (Apple UI) |
| Authentication | Clerk (biometrics, magic link, JWT) |
| Backend | FastAPI (Python) + PyTorch LSTM |
| Database | Neon (serverless PostgreSQL) |
| AI Agentic Layer | SmolAgents + Phi-3-mini fine-tuned (local first) |
| CIH API Integration | Real endpoints + simulation mode |
| Blockchain | Solana Devnet (Rust/Anchor) – toggleable |
| Deployment | Expo EAS + Railway/Render + Neon |
| Analytics | PostHog (open-source) |

### 4. User Journey Example – Younes, Delivery Rider in Casablanca

1. Downloads FLOW → opens account in 3 minutes with CIN photo
2. Sets desired salary: 18 000 DH every 30th
3. Receives 22 000 DH from Glovo → AI puts 18k in salary pot + 3k tax + 1k reserve
4. Bad week: only 8 000 DH earned → AI pulls 10k from reserve → Younes still gets 18k on 30th
5. Client late → AI sends reminder + reserves extra 20%
6. Needs new phone → generates FLOW Shield certificate → gets loan approved in 2 hours

Younes never worries about money again.

### 5. Compliance & Security

- Full compliance with auto-entrepreneur regime
- Bank Al-Maghrib compliant via CIH partnership
- Data encrypted at rest + in transit
- Biometric authentication mandatory for actions > 5 000 DH