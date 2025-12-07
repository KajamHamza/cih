"""
focused_agent.py - FLOW AI Cashflow Agent (Hackathon Version)

Core Features:
1. Predicts cashflow for next 4 weeks using LSTM
2. Detects risks (shortfalls, declining trends)
3. Auto-reserve excess money above desired salary to Emergency Pot
4. Uses REAL CIH API for money transfers

Usage:
    from focused_agent import FlowAgent
    
    agent = FlowAgent()
    result = agent.analyze(recent_data, user_config)
    print(result['report'])
"""

import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import joblib
import json
import requests
from typing import Dict, List
from datetime import datetime
import logging
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# ==========================================
# MODEL DEFINITION
# ==========================================
class BusinessLSTM(nn.Module):
    """LSTM for cashflow forecasting"""
    
    def __init__(self, num_features, hidden=64, forecast_weeks=4, num_layers=2, dropout=0.3):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=num_features,
            hidden_size=hidden,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        self.fc1 = nn.Linear(hidden, hidden // 2)
        self.fc2 = nn.Linear(hidden // 2, forecast_weeks)
        self.dropout = nn.Dropout(dropout)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_hidden = lstm_out[:, -1, :]
        x = self.relu(self.fc1(self.dropout(last_hidden)))
        return self.fc2(self.dropout(x))


# ==========================================
# CIH API INTEGRATION
# ==========================================
class CIHWalletAPI:
    """Real CIH API integration for wallet operations"""
    
    def __init__(self, base_url="https://api.cih.ma", demo_mode=False):
        self.base_url = base_url
        self.demo_mode = demo_mode  # Toggle for hackathon demo
        
    def reserve_to_pot(self, user_contract_id: str, user_phone: str, 
                       pot_phone: str, amount: float) -> Dict:
        """
        Move money to emergency pot using CIH Wallet-to-Wallet API
        
        Args:
            user_contract_id: User's CIH contract ID (e.g., "LAN193541347060000000001")
            user_phone: User's phone number (e.g., "212666233333")
            pot_phone: Emergency pot phone number (e.g., "212666999999")
            amount: Amount to transfer in MAD
            
        Returns:
            Transaction result dict
        """
        
        if self.demo_mode:
            logger.info(f"[DEMO MODE] Simulating transfer of {amount:.2f} MAD to pot")
            time.sleep(1)  # Simulate API delay
            return {
                'success': True,
                'amount': amount,
                'transaction_ref': f'DEMO_{int(time.time())}',
                'balance_after': 0,  # Would be real in production
                'message': f'Successfully reserved {amount:.2f} MAD to Emergency Pot'
            }
        
        try:
            # STEP 1: Simulate W2W Transfer
            logger.info(f"Step 1/3: Simulating transfer of {amount:.2f} MAD...")
            sim_response = requests.post(
                f"{self.base_url}/wallet/transfer/wallet",
                params={'step': 'simulation'},
                json={
                    'clentNote': 'Auto-reserve by FLOW AI',
                    'contractId': user_contract_id,
                    'amout': str(amount),
                    'fees': '0',
                    'destinationPhone': pot_phone,
                    'mobileNumber': user_phone
                },
                timeout=10
            )
            
            if sim_response.status_code != 200:
                raise Exception(f"Simulation failed: {sim_response.text}")
            
            reference_id = sim_response.json()['result']['referenceId']
            total_fees = sim_response.json()['result']['totalFrai']
            logger.info(f"✓ Simulation successful - Reference: {reference_id}")
            
            # STEP 2: Get OTP
            logger.info("Step 2/3: Requesting OTP...")
            otp_response = requests.post(
                f"{self.base_url}/wallet/transfer/wallet/otp",
                json={'phoneNumber': user_phone},
                timeout=10
            )
            
            if otp_response.status_code != 200:
                raise Exception(f"OTP request failed: {otp_response.text}")
            
            # In production, OTP would be sent to user's phone
            # For hackathon, we use the returned code directly
            otp = otp_response.json()['result'][0]['codeOtp']
            logger.info(f"✓ OTP received: {otp}")
            
            # STEP 3: Confirm Transfer
            logger.info("Step 3/3: Confirming transfer...")
            confirm_response = requests.post(
                f"{self.base_url}/wallet/transfer/wallet",
                params={'step': 'confirmation'},
                json={
                    'mobileNumber': user_phone,
                    'contractId': user_contract_id,
                    'otp': otp,
                    'referenceId': reference_id,
                    'destinationPhone': pot_phone,
                    'fees': total_fees
                },
                timeout=10
            )
            
            if confirm_response.status_code != 200:
                raise Exception(f"Confirmation failed: {confirm_response.text}")
            
            result = confirm_response.json()['result']
            new_balance = float(result['item1']['value'])
            
            logger.info(f"✓ Transfer successful! New balance: {new_balance:.2f} MAD")
            
            return {
                'success': True,
                'amount': amount,
                'fees': float(total_fees),
                'transaction_ref': reference_id,
                'balance_after': new_balance,
                'message': f'Successfully reserved {amount:.2f} MAD to Emergency Pot'
            }
            
        except requests.exceptions.Timeout:
            logger.error("API request timed out")
            return {'success': False, 'error': 'API timeout'}
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            return {'success': False, 'error': str(e)}
        except Exception as e:
            logger.error(f"Transfer failed: {str(e)}")
            return {'success': False, 'error': str(e)}


# ==========================================
# MAIN AGENT CLASS
# ==========================================
class FlowAgent:
    """
    FLOW AI Cashflow Agent
    
    Features:
    1. Predicts next 4 weeks of cashflow
    2. Detects risks automatically
    3. Auto-reserves excess money above desired salary
    """
    
    def __init__(self, model_path='models/business_lstm.pt',
                 scaler_path='models/business_scaler.pkl',
                 target_scaler_path='models/business_target_scaler.pkl',
                 demo_mode=True):
        """
        Initialize agent
        
        Args:
            demo_mode: If True, simulates CIH API calls (for hackathon demo)
        """
        
        logger.info("🚀 Initializing FLOW AI Agent...")
        
        # Load scalers
        self.scaler = joblib.load(scaler_path)
        self.target_scaler = joblib.load(target_scaler_path)
        logger.info("✓ Scalers loaded")
        
        # Load LSTM model
        self.model = BusinessLSTM(num_features=12, hidden=64, forecast_weeks=4)
        self.model.load_state_dict(torch.load(model_path, map_location='cpu', weights_only=True))
        self.model.eval()
        logger.info("✓ LSTM model loaded")
        
        # Initialize CIH API
        self.cih_api = CIHWalletAPI(demo_mode=demo_mode)
        logger.info(f"✓ CIH API initialized ({'DEMO MODE' if demo_mode else 'LIVE MODE'})")
        
        # Config
        self.SEQ_LENGTH = 8
        self.FEATURE_COLS = [
            'season_type', 'distributers', 'fixed_pay',
            'cost_of_raw_materials', 'other_expenditure', 'cash_out',
            'net_profit_margin', 'week_of_year', 'cash_flow',
            'profit_trend_4w', 'cash_in_lag1', 'cash_out_lag1'
        ]
        
        logger.info("✅ FLOW Agent ready!\n")
    
    # ==========================================
    # PREDICTION
    # ==========================================
    
    def predict_cashflow(self, recent_data: pd.DataFrame) -> np.ndarray:
        """
        Predicts next 4 weeks of cash inflow
        
        Args:
            recent_data: Last 8+ weeks of business data
            
        Returns:
            predictions: [4] array of weekly cash_in predictions
        """
        if len(recent_data) < self.SEQ_LENGTH:
            raise ValueError(f"Need at least {self.SEQ_LENGTH} weeks of data")
        
        # Take last 8 weeks
        data = recent_data.tail(self.SEQ_LENGTH).copy()
        
        # Feature engineering
        data = self._engineer_features(data)
        
        # Scale
        features_scaled = self.scaler.transform(data[self.FEATURE_COLS])
        
        # Predict
        with torch.no_grad():
            X = torch.FloatTensor(features_scaled).unsqueeze(0)
            predictions_scaled = self.model(X).numpy()[0]
        
        # Inverse transform
        predictions_real = self._inverse_transform(predictions_scaled)
        
        return predictions_real
    
    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply feature engineering"""
        df = df.copy()
        
        # Temporal
        if 'date' not in df.columns and 'date of week start' in df.columns:
            df['date'] = pd.to_datetime(df['date of week start'])
        df['week_of_year'] = pd.to_datetime(df['date']).dt.isocalendar().week
        
        # Financial
        if 'cash_flow' not in df.columns:
            df['cash_flow'] = df['cash_in'] - df['cash_out']
        
        # Rolling
        df['profit_trend_4w'] = df['net_profit_margin'].rolling(4, min_periods=1).mean()
        
        # Lags
        df['cash_in_lag1'] = df['cash_in'].shift(1).fillna(df['cash_in'].mean())
        df['cash_out_lag1'] = df['cash_out'].shift(1).fillna(df['cash_out'].mean())
        
        return df
    
    def _inverse_transform(self, scaled_values: np.ndarray) -> np.ndarray:
        """Convert scaled predictions to real currency"""
        return scaled_values * self.target_scaler.scale_[0] + self.target_scaler.mean_[0]
    
    # ==========================================
    # RISK DETECTION
    # ==========================================
    
    def detect_risks(self, predictions: np.ndarray, threshold: float = 2000000) -> Dict:
        """
        Detect cashflow risks
        
        Args:
            predictions: [4] weekly predictions
            threshold: Low cashflow threshold (default 2M MAD)
            
        Returns:
            Risk analysis dict
        """
        min_val = predictions.min()
        min_week = predictions.argmin() + 1
        avg_val = predictions.mean()
        
        risks = []
        severity = 'low'
        
        # Check for low cashflow
        if min_val < threshold:
            risks.append({
                'type': 'low_cashflow',
                'week': min_week,
                'amount': float(min_val),
                'message': f'⚠️ Low cash inflow predicted: {min_val:,.0f} MAD in week {min_week}'
            })
            severity = 'high' if min_val < threshold * 0.75 else 'medium'
        
        # Check for declining trend (>15% drop)
        if predictions[-1] < predictions[0] * 0.85:
            drop_pct = ((predictions[0] - predictions[-1]) / predictions[0]) * 100
            risks.append({
                'type': 'declining_trend',
                'drop_percent': float(drop_pct),
                'message': f'📉 Declining trend: {drop_pct:.1f}% drop expected over 4 weeks'
            })
            severity = max(severity, 'medium', key=['low', 'medium', 'high'].index)
        
        return {
            'has_risk': len(risks) > 0,
            'severity': severity,
            'risks': risks,
            'min_predicted': float(min_val),
            'avg_predicted': float(avg_val),
            'worst_week': int(min_week)
        }
    
    # ==========================================
    # AUTO-RESERVE LOGIC
    # ==========================================
    
    def check_and_reserve(self, current_cash_in: float, desired_salary: float,
                          user_contract_id: str, user_phone: str, 
                          pot_phone: str) -> Dict:
        """
        Checks if current cash exceeds desired salary and reserves excess
        
        Args:
            current_cash_in: This week's cash inflow
            desired_salary: User's desired weekly salary
            user_contract_id: CIH contract ID
            user_phone: User's phone number
            pot_phone: Emergency pot phone number
            
        Returns:
            Reservation result
        """
        
        excess = current_cash_in - desired_salary
        
        if excess <= 0:
            return {
                'action': 'no_reserve',
                'current_cash_in': current_cash_in,
                'desired_salary': desired_salary,
                'excess': 0,
                'message': f'✓ No excess - current inflow ({current_cash_in:,.0f} MAD) ≤ desired salary ({desired_salary:,.0f} MAD)'
            }
        
        logger.info(f"\n💰 Excess detected: {excess:,.2f} MAD")
        logger.info(f"   Current cash in: {current_cash_in:,.2f} MAD")
        logger.info(f"   Desired salary:  {desired_salary:,.2f} MAD")
        logger.info(f"   → Reserving excess to Emergency Pot...")
        
        # Execute reserve via CIH API
        transfer_result = self.cih_api.reserve_to_pot(
            user_contract_id=user_contract_id,
            user_phone=user_phone,
            pot_phone=pot_phone,
            amount=excess
        )
        
        if transfer_result['success']:
            return {
                'action': 'reserved',
                'current_cash_in': current_cash_in,
                'desired_salary': desired_salary,
                'excess': excess,
                'transaction': transfer_result,
                'message': f'✅ Reserved {excess:,.2f} MAD to Emergency Pot'
            }
        else:
            return {
                'action': 'failed',
                'current_cash_in': current_cash_in,
                'desired_salary': desired_salary,
                'excess': excess,
                'error': transfer_result.get('error'),
                'message': f'❌ Failed to reserve {excess:,.2f} MAD: {transfer_result.get("error")}'
            }
    
    # ==========================================
    # MAIN ANALYSIS INTERFACE
    # ==========================================
    
    def analyze(self, recent_data: pd.DataFrame, user_config: Dict) -> Dict:
        """
        Complete analysis: predict → detect risks → auto-reserve
        
        Args:
            recent_data: Last 8+ weeks of business data
            user_config: {
                'business_name': str,
                'desired_weekly_salary': float,
                'current_week_cash_in': float,
                'contract_id': str,
                'phone': str,
                'pot_phone': str
            }
            
        Returns:
            Complete analysis with predictions, risks, and auto-reserve result
        """
        
        logger.info(f"\n{'='*70}")
        logger.info(f"🔍 Analyzing cashflow for {user_config.get('business_name', 'Business')}")
        logger.info(f"{'='*70}\n")
        
        # 1. PREDICT CASHFLOW
        logger.info("📊 Step 1/3: Predicting next 4 weeks...")
        predictions = self.predict_cashflow(recent_data)
        logger.info(f"✓ Predictions: {[f'{p:,.0f}' for p in predictions]}")
        
        # 2. DETECT RISKS
        logger.info("\n🔍 Step 2/3: Detecting risks...")
        risk_analysis = self.detect_risks(predictions)
        
        if risk_analysis['has_risk']:
            logger.info(f"⚠️  {len(risk_analysis['risks'])} risk(s) detected ({risk_analysis['severity']} severity)")
            for risk in risk_analysis['risks']:
                logger.info(f"   • {risk['message']}")
        else:
            logger.info("✅ No significant risks detected")
        
        # 3. AUTO-RESERVE CHECK
        logger.info("\n💰 Step 3/3: Checking for excess cash...")
        reserve_result = self.check_and_reserve(
            current_cash_in=user_config['current_week_cash_in'],
            desired_salary=user_config['desired_weekly_salary'],
            user_contract_id=user_config['contract_id'],
            user_phone=user_config['phone'],
            pot_phone=user_config['pot_phone']
        )
        
        logger.info(f"   {reserve_result['message']}")
        
        # 4. GENERATE REPORT
        report = self._generate_report(
            business_name=user_config.get('business_name', 'Business'),
            predictions=predictions,
            risk_analysis=risk_analysis,
            reserve_result=reserve_result
        )
        
        logger.info(f"\n{'='*70}")
        logger.info("✅ Analysis complete!")
        logger.info(f"{'='*70}\n")
        
        return {
            'timestamp': datetime.now().isoformat(),
            'business_name': user_config.get('business_name'),
            'predictions': {
                'weekly_values': predictions.tolist(),
                'min': float(predictions.min()),
                'max': float(predictions.max()),
                'avg': float(predictions.mean()),
                'trend': 'declining' if predictions[-1] < predictions[0] else 'growing'
            },
            'risk_analysis': risk_analysis,
            'auto_reserve': reserve_result,
            'report': report
        }
    
    def _generate_report(self, business_name: str, predictions: np.ndarray,
                        risk_analysis: Dict, reserve_result: Dict) -> str:
        """Generate formatted text report"""
        
        report = f"\n{'='*70}\n"
        report += f"📊 FLOW AI CASHFLOW REPORT - {business_name}\n"
        report += f"{'='*70}\n\n"
        
        # Predictions
        report += "📈 4-WEEK FORECAST:\n"
        for i, pred in enumerate(predictions, 1):
            report += f"   Week {i}: {pred:>12,.2f} MAD\n"
        report += f"\n   Average:  {predictions.mean():>12,.2f} MAD\n"
        report += f"   Trend:    {'📉 Declining' if predictions[-1] < predictions[0] else '📈 Growing'}\n\n"
        
        # Risks
        if risk_analysis['has_risk']:
            severity_emoji = {'low': '⚠️', 'medium': '🔶', 'high': '🔴'}
            report += f"{severity_emoji[risk_analysis['severity']]} RISKS DETECTED ({risk_analysis['severity'].upper()}):\n\n"
            for risk in risk_analysis['risks']:
                report += f"   • {risk['message']}\n"
            report += "\n"
        else:
            report += "✅ NO RISKS DETECTED\n\n"
        
        # Auto-reserve
        report += "💰 AUTO-RESERVE STATUS:\n\n"
        if reserve_result['action'] == 'reserved':
            report += f"   ✅ Successfully reserved {reserve_result['excess']:,.2f} MAD\n"
            report += f"   📍 Current inflow:  {reserve_result['current_cash_in']:,.2f} MAD\n"
            report += f"   🎯 Desired salary:  {reserve_result['desired_salary']:,.2f} MAD\n"
            report += f"   💼 Reserved amount: {reserve_result['excess']:,.2f} MAD\n"
            if 'transaction' in reserve_result and 'transaction_ref' in reserve_result['transaction']:
                report += f"   🔖 Transaction ID:  {reserve_result['transaction']['transaction_ref']}\n"
        elif reserve_result['action'] == 'no_reserve':
            report += f"   ℹ️  No excess to reserve\n"
            report += f"   📍 Current inflow: {reserve_result['current_cash_in']:,.2f} MAD\n"
            report += f"   🎯 Desired salary: {reserve_result['desired_salary']:,.2f} MAD\n"
        else:
            report += f"   ❌ Reserve failed: {reserve_result.get('error', 'Unknown error')}\n"
        
        report += f"\n{'='*70}\n"
        report += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        report += f"{'='*70}\n"
        
        return report


# ==========================================
# DEMO / SHOWCASE SCRIPT
# ==========================================

if __name__ == "__main__":
    """
    Hackathon Demo Script
    Shows the complete workflow with realistic data
    """
    
    print("\n" + "="*70)
    print("🚀 FLOW AI CASHFLOW AGENT - HACKATHON DEMO")
    print("="*70 + "\n")
    
    # Initialize agent (DEMO MODE for hackathon)
    agent = FlowAgent(demo_mode=True)
    
    # Load real business data
    try:
        df = pd.read_csv('C:/Users/Dell/Desktop/flow/tsf.csv')
        
        # Prepare data
        df['date'] = pd.to_datetime(df['date of week start'])
        df = df.sort_values('date')
        
        # Rename columns to match training
        df['cash_in'] = df['cash in']
        df['cash_out'] = df['cash out']
        df['net_profit_margin'] = df['net profit margin']
        df['season_type'] = df['season type']
        df['fixed_pay'] = df['fixed pay']
        df['cost_of_raw_materials'] = df['cost of raw materails']
        df['other_expenditure'] = df['other expenditure']
        
        # Take last 10 weeks
        recent_data = df.tail(10)
        current_week_cash_in = recent_data['cash_in'].iloc[-1]
        
        # User configuration
        user_config = {
            'business_name': 'ABC Trading Company',
            'desired_weekly_salary': 2_500_000,  # 2.5M MAD per week
            'current_week_cash_in': current_week_cash_in,
            'contract_id': 'LAN193541347060000000001',  # Example CIH contract
            'phone': '212666233333',
            'pot_phone': '212666999999'  # Emergency pot wallet
        }
        
        # RUN ANALYSIS
        result = agent.analyze(recent_data, user_config)
        
        # DISPLAY REPORT
        print(result['report'])
        
        # Save results
        import os
        os.makedirs('outputs', exist_ok=True)
        
        with open('outputs/flow_analysis.json', 'w') as f:
            json.dump(result, f, indent=2, default=str)
        
        print("\n💾 Full analysis saved to: outputs/flow_analysis.json")
        
        # Show what happened
        print("\n" + "="*70)
        print("📋 SUMMARY:")
        print("="*70)
        print(f"✓ Predicted next 4 weeks of cashflow")
        print(f"✓ Detected {len(result['risk_analysis']['risks'])} risk(s)")
        print(f"✓ Auto-reserve: {result['auto_reserve']['action']}")
        if result['auto_reserve']['action'] == 'reserved':
            print(f"  → Reserved {result['auto_reserve']['excess']:,.2f} MAD to Emergency Pot")
        print("="*70 + "\n")
        
    except FileNotFoundError:
        print("❌ Error: tsf.csv not found")
        print("\nFor demo, place your business data CSV in the same directory")
        print("Expected columns: date of week start, cash in, cash out, etc.")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()