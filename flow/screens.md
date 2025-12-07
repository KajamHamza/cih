

This is the **Definitive Design Bible** for **FLOW**.

It is structured for a high-end UI/UX Designer or a Frontend Developer (React Native/Expo). Every pixel is accounted for. The vibe is **"Cyber-Corporate"**—the reliability of CIH Bank meets the futuristic speed of a Gen-Z fintech.

---

### **0. The Design System (Global)**
* **Palette (Dark Mode Only):**
    * **Canvas:** `#0A111F` (Deep Navy - The Void).
    * **Surface (Cards):** `#162032` (Lighter Navy - The Structure).
    * **Primary Accent:** `#F37021` (CIH Orange - The Energy).
    * **Secondary Accent:** `#005DAA` (CIH Blue - The Trust).
    * **Text Primary:** `#FFFFFF` (White - Inter SemiBold).
    * **Text Secondary:** `#94A3B8` (Slate Grey - Inter Regular).
    * **Success:** `#00C853` (Neon Green).
    * **Error:** `#FF3D00` (Red).
* **Typography:** **Inter** (Google Fonts). Clean, legible, variable weight.
* **Shapes:**
    * **Cards:** 16px corner radius.
    * **Buttons:** Fully rounded (Pill shape).
    * **Icons:** 1.5px stroke width (outline style).

---

### **Module 1: Onboarding (The Hook)**
*Goal: Zero friction. Maximum trust. Convert in < 2 minutes.*

#### **1.0 Splash Screen**
* **Visual:** Pitch black background. A subtle "constellation" of blue dots connects in the background (faint opacity).
* **Center:** The **FLOW** logo pulses rhythmically in White.
* **Bottom:** "Powered by" (Small text) + **CIH Bank Logo** (Full Color).
* **Animation:** The logo slides up, revealing the "Get Started" button.

#### **1.1 The Gateway (Sign In)**
* **Header:** "Welcome to the Future of Banking."
* **Buttons (Stacked):**
    1.  **"Continue with Apple"** (White Button, Black Text, Apple Icon).
    2.  **"Continue with Google"** (Dark Grey Button `#2D2D2D`, White Text, Google "G" Icon).
    3.  **"Create Manually"** (Transparent Button, Orange Border, Orange Text).
* **Footer:** "By continuing, you accept our Terms."

#### **1.2 Data Enrichment (The "Know Your Customer")**
* **Header:** "Let's set up your profile."
* **Input Fields (Floating Label Style):**
    1.  **Phone Number:** Pre-filled `+212` (Moroccan Flag icon). User types `6...`.
    2.  **CIN Number:** Capitalized auto-input.
    3.  **Date of Birth:** DD/MM/YYYY mask.
* **Interaction:** As the user types, the bottom border of the active field glows **CIH Orange**.

#### **1.3 OTP Verification**
* **Header:** "Check your SMS."
* **Subtext:** "Code sent to +212 6XX-XX-XX-89".
* **Visual:** 6 Large Rounded Squares.
    * *Empty:* Grey Border.
    * *Active:* **Orange Glow**.
    * *Filled:* White Border.
* **Logic:** Auto-reads SMS. Upon 6th digit, borders flash **Green** and screen slides left.

#### **1.4 Code 30 Security**
* **Header:** "Create your Access PIN."
* **Visual:** 4 Empty Circles (Outlined).
* **Keypad:** Custom Navy background. White numbers.
* **Feedback:** Tapping a number fills a circle with an **Orange Dot**.
* **Biometric Prompt (Bottom Sheet):** "Enable FaceID for instant login?" -> [Enable] / [Skip].

#### **1.5 Success (The Dopamine Hit)**
* **Visual:** A 3D render of the **Black Metal Card** spins into view from darkness. Confetti particles (Orange/Blue) rain down.
* **H1 Text:** "Account Ready."
* **H2 Text:** "IBAN: MA64 230..." (Copy icon).
* **Button:** "Enter FLOW" (Pulsing Orange).

---

### **Module 2: Dashboard (The Daily Driver)**
*Goal: Income Smoothing. "Safe to Spend" is the only number that matters.*

#### **2.0 Main Dashboard**
* **Top Bar:**
    * *Left:* User Avatar (Circle) with "Pro" Badge.
    * *Right:* Notification Bell (Orange dot if unread).
* **Hero Section (The Ring):**
    * **Visual:** A large Donut Chart centered.
        * *70%:* **Bright Orange** (Safe to Spend).
        * *30%:* **Dark Blue** (Tax/Savings - visually receeding).
    * **Center Text:** **12,400 DH** (White, Bold, 42px).
    * **Label:** "Safe to Spend" (Green text).
    * **Interaction:** Tapping the ring flips the text to: "Total: 16,800 DH" (Grey).
* **Action Row (Floating beneath the ring):**
    * Three Glassmorphic Circles (Blur background).
    * **[+]** (Add Money - Orange).
    * **[↑]** (Transfer - Orange).
    * **[Doc]** (Invoice - Orange).
* **Transaction List (Draggable Bottom Sheet):**
    * **Header:** "Today".
    * **List Item:**
        * *Icon:* Logo (e.g., Glovo, Marjane).
        * *Title:* Merchant Name.
        * *Subtitle:* Time (e.g., 14:30).
        * *Right Side:* **-150 DH** (White).
        * *CIH Transfers:* Show the **CIH Logo** instead of a generic icon.

#### **2.1 Sub-Screen: Add Money**
* **UI:** Half-screen modal.
* **Options:**
    1.  **Card Top-up:** Apple Pay / mastercard logo.
    2.  **Bank Transfer:** Displays RIB with "Copy" button.
    3.  **CIH Cash Deposit:** "Scan QR at ATM".

---

### **Module 3: Business Hub (The Freelance Engine)**
*Goal: Automate Taxes & Get Paid.*

#### **3.0 Business Overview**
* **Top Card (The Tax Engine):**
    * **Background:** Horizontal Gradient (Deep Blue to Navy).
    * **Content:** A horizontal progress bar.
        * *Left Text:* "Turnover: 140k DH".
        * *Right Text:* "Limit: 200k DH".
    * **Status:** "Auto-Entrepreneur Status: Active".
* **The "Tax Pot" Widget:**
    * **Visual:** A glass jar icon partially filled with gold coins (flat vector).
    * **Text:** "3,450 DH Reserved".
    * **Action:** "Pay Authorities" (Button active only during tax season).
* **Grid Menu (2x2):**
    1.  **New Invoice** (Primary).
    2.  **Expenses** (Scan Receipt).
    3.  **Clients** (CRM).
    4.  **Documents** (Attestations).

#### **3.1 Invoice Creator (The 8-Second Flow)**
* **Step 1:** "Who is this for?" -> Select from Contact List or "Add Client".
* **Step 2:** "What did you do?" -> Input Service (e.g., "Web Dev") & Amount (e.g., "5000").
* **Step 3:** "Review".
    * **Visual:** Shows a mini-preview of the PDF invoice.
    * **Button:** "Generate Link" (Orange).
    * **Action:** Opens native share sheet (WhatsApp, Email).

---

### **Module 4: Transfers (The Money Mover)**
*Goal: Fast, frictionless payments.*

#### **4.0 Transfer Hub**
* **Search Bar:** "Name, Phone, or RIB".
* **Fast Pay (Horizontal Scroll):** Circular avatars of recent contacts.
    * *Indicator:* Small CIH logo on avatars who are also on CIH (Instant transfer).
* **List Options:**
    * "To a Bank Account" (RIB).
    * "Pay a Bill" (Fatourati Integration).
    * "International Transfer".

#### **4.1 The "Pay" Screen**
* **Visual:** Minimalist.
* **Input:** Huge central text cursor. User types **500**.
* **Currency:** "DH" fixed on the right.
* **Note Field:** "What's this for?" (Optional).
* **Slider:** "Slide to Send" (Instead of a button).
    * *Animation:* As you slide, the button turns from Orange to Green.
    * *Success:* Screen flashes Green, "Sent!" sound plays.

---

### **Module 5: AI Guardian (The Smart Companion)**
*Goal: Advice, not just data.*

#### **5.0 Agent Chat**
* **Header:** "FLOW Agent" (Green 'Online' dot).
* **UI:** Chat bubble interface.
* **Bot Message:** "Salam Younes! You spent 500 DH on dining this week. That's 20% higher than usual."
* **Interactive Cards (The 'Agentic' UI):**
    * Instead of typing, the user sees buttons inside the chat.
    * **[Move 200 DH to Savings]** (Orange Border).
    * **[Ignore Alert]** (Grey Border).
* **Input:** User can type: "Do I have enough for a new laptop?"
    * *Response:* "You have 12,000 DH 'Safe to Spend'. A MacBook Air is 11,500 DH. You can afford it, but it will leave you with 500 DH."

---

### **Module 6: Cards (The Wallet)**
*Goal: Flex & Control.*

#### **6.0 Card Carousel**
* **Background:** Slight vignette to focus on the cards.
* **Interaction:** Horizontal Swipe with 3D perspective (cards tilt).
* **Cards:**
    1.  **Code 30 Digital:** Gradient Orange/Red. (Virtual).
    2.  **FLOW Black:** Matte Black texture, Silver text. (Physical).
    3.  **Ghost Card:** Translucent White. (Single-use).
* **Controls (Below Card):**
    * **Freeze:** Snowflake Icon (Toggles Blue when active).
    * **Reveal:** Eye Icon (Long press to see numbers).
    * **Settings:** Gear Icon (Limits, Pin).

---

### **Module 7: Profile (The Admin + Easter Egg)**
*Goal: Boring stuff + Hidden gem.*

#### **7.0 Profile Menu**
* **Header:** Big Profile Photo. Name. "Member since 2025".
* **List Items (Chevron on right):**
    * **My Plan:** "FLOW Pro" (Gold text).
    * **Documents:** (Download RIB).
    * **Security:** (FaceID, Change PIN).
    * **Appearance:** (Dark Mode - Locked to On).
    * **Support:** (Chat with Human).
* **Footer:** App Version 1.0.0.

#### **7.1 The Easter Egg (Flow Shield)**
* **Trigger:** User taps their Profile Photo **5 times rapidly**.
* **Interaction:**
    * Screen dims to black.
    * Haptic feedback rumbles.
    * **Visual:** A **3D Holographic Shield** (Cyberpunk style) spins into the center.
    * **Text:** "Founder's Status: Active."
    * **Reward:** "You are an early adopter. Your 'Shield' is minted on Solana." (Just text/visual, no complex wallet interaction).
    * **Button:** "Close" (Returns to normal profile).

---

### **Developer/Implementation Notes**
1.  **Glassmorphism:** Use `BlurView` (React Native) heavily on the "Floating Action Row" and "Tax Pot" widgets to give depth.
2.  **Haptics:** Every button press, slide, and toggle must have haptic feedback (`expo-haptics`).
3.  **Animations:** Use `Reanimated` for the Ring Chart (smooth filling) and the Card Carousel (3D tilt).
4.  **Charts:** The "Safe to Spend" ring is not a standard pie chart. It is a **progress ring** with a gap at the bottom.

This specification is ready to be handed to a designer to build the Figma prototype. It hits every requirement: CIH Branding, Freelancer Utility, and Gen-Z Cool Factor.