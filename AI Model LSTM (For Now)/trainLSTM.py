"""
train_business_lstm.py - FLOW LSTM Training on Real Business Data
Trains cashflow prediction model using actual business transactions
This version uses REAL data patterns (not synthetic random data)
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import joblib
import os
import logging
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)

os.makedirs('models', exist_ok=True)
os.makedirs('plots', exist_ok=True)

# ==========================================
# CONFIG
# ==========================================
class Config:
    # Model architecture
    SEQ_LENGTH = 8  # Look back 8 weeks
    FORECAST_HORIZON = 4  # Predict next 4 weeks
    HIDDEN_SIZE = 64
    NUM_LSTM_LAYERS = 2
    EMBED_DIM = 4
    DROPOUT = 0.3
    
    # Training
    BATCH_SIZE = 16
    LEARNING_RATE = 0.001
    EPOCHS = 100
    EARLY_STOPPING_PATIENCE = 15
    
    # Features from your dataset
    FEATURE_COLS = [
        'season_type',           # 0, 1, 2 (categorical but works as numeric)
        'distributers',          # Number of distributors
        'fixed_pay',            # Fixed payments
        'cost_of_raw_materials', # Variable costs
        'other_expenditure',     # Other expenses
        'cash_out',             # Total expenditure
        'net_profit_margin',    # Profitability indicator
        'week_of_year',         # Temporal feature
        'cash_flow',            # Derived: cash_in - cash_out
        'profit_trend_4w',      # Rolling 4-week profit trend
        'cash_in_lag1',         # Previous week's cash_in
        'cash_out_lag1'         # Previous week's cash_out
    ]
    
    # Target variable
    TARGET_COL = 'cash_in'

config = Config()

# ==========================================
# DATA LOADING & PREPROCESSING
# ==========================================
logger.info("=== Loading Real Business Data ===")

# Load your CSV
# Adjust path to your actual file location
df = pd.read_csv("C:/Users/Dell/Desktop/flow/tsf.csv")  # Change this path!

logger.info(f"Loaded {len(df)} records")
logger.info(f"Date range: {df['date of week start'].min()} to {df['date of week start'].max()}")

# Convert date column
df['date'] = pd.to_datetime(df['date of week start'])
df = df.sort_values('date').reset_index(drop=True)

# Create snake_case aliases for training (Config expects these)
df['cash_in'] = df['cash in']
df['cash_out'] = df['cash out']
df['net_profit_margin'] = df['net profit margin']
df['season_type'] = df['season type']
df['fixed_pay'] = df['fixed pay']
df['cost_of_raw_materials'] = df['cost of raw materails']  # Note CSV typo
df['other_expenditure'] = df['other expenditure']

# ==========================================
# FEATURE ENGINEERING
# ==========================================
logger.info("\n=== Feature Engineering ===")

# 1. Temporal features
df['week_of_year'] = df['date'].dt.isocalendar().week
df['month'] = df['date'].dt.month
df['quarter'] = df['date'].dt.quarter

# 2. Derived financial features
df['cash_flow'] = df['cash in'] - df['cash out']
df['expense_ratio'] = df['cash out'] / df['cash in'].replace(0, 1)  # Avoid division by 0
df['profit_per_distributer'] = df['cash_flow'] / df['distributers'].replace(0, 1)

# 3. Rolling features (trends)
df['profit_trend_4w'] = df['net profit margin'].rolling(4, min_periods=1).mean()
df['cash_in_ma_4w'] = df['cash in'].rolling(4, min_periods=1).mean()
df['cash_out_ma_4w'] = df['cash out'].rolling(4, min_periods=1).mean()

# 4. Lag features (what happened last week)
df['cash_in_lag1'] = df['cash in'].shift(1).fillna(df['cash in'].mean())
df['cash_out_lag1'] = df['cash out'].shift(1).fillna(df['cash out'].mean())
df['cash_flow_lag1'] = df['cash_flow'].shift(1).fillna(df['cash_flow'].mean())

# 5. Volatility features
df['cash_in_volatility'] = df['cash in'].rolling(4, min_periods=1).std().fillna(0)

logger.info(f"Created {len(df.columns)} total features")
logger.info(f"Using {len(config.FEATURE_COLS)} features for training")

# ==========================================
# TRAIN/VAL/TEST SPLIT (Temporal)
# ==========================================
logger.info("\n=== Splitting Data (Temporal) ===")

# For time series: NO random split! Use temporal order
n = len(df)
train_size = int(0.7 * n)
val_size = int(0.15 * n)

train_df = df.iloc[:train_size].copy()
val_df = df.iloc[train_size:train_size+val_size].copy()
test_df = df.iloc[train_size+val_size:].copy()

logger.info(f"Train: {len(train_df)} weeks | Val: {len(val_df)} | Test: {len(test_df)}")
logger.info(f"Train period: {train_df['date'].min()} to {train_df['date'].max()}")
logger.info(f"Test period: {test_df['date'].min()} to {test_df['date'].max()}")

# Scale features (fit only on train)
scaler = StandardScaler()
train_df[config.FEATURE_COLS] = scaler.fit_transform(train_df[config.FEATURE_COLS])
val_df[config.FEATURE_COLS] = scaler.transform(val_df[config.FEATURE_COLS])
test_df[config.FEATURE_COLS] = scaler.transform(test_df[config.FEATURE_COLS])

# Scale target separately
target_scaler = StandardScaler()
train_df[[config.TARGET_COL]] = target_scaler.fit_transform(train_df[[config.TARGET_COL]])
val_df[[config.TARGET_COL]] = target_scaler.transform(val_df[[config.TARGET_COL]])
test_df[[config.TARGET_COL]] = target_scaler.transform(test_df[[config.TARGET_COL]])

logger.info(f"Target scaling - Mean: {target_scaler.mean_[0]:.2f}, Std: {target_scaler.scale_[0]:.2f}")

# ==========================================
# SEQUENCE CREATION
# ==========================================
logger.info("\n=== Creating Sequences ===")

def create_sequences(df, seq_len=8, horizon=4):
    """
    Creates sequences for multi-step forecasting
    
    Returns:
        X: [N, seq_len, num_features] - Past 8 weeks of features
        y: [N, horizon] - Next 4 weeks of cash_in to predict
    """
    X_list, y_list = [], []
    
    features = df[config.FEATURE_COLS].values
    targets = df[config.TARGET_COL].values
    
    for i in range(len(features) - seq_len - horizon + 1):
        X_list.append(features[i:i+seq_len])
        y_list.append(targets[i+seq_len:i+seq_len+horizon])
    
    X_array = np.array(X_list)
    y_array = np.array(y_list)
    
    return torch.FloatTensor(X_array), torch.FloatTensor(y_array)

X_train, y_train = create_sequences(train_df, config.SEQ_LENGTH, config.FORECAST_HORIZON)
X_val, y_val = create_sequences(val_df, config.SEQ_LENGTH, config.FORECAST_HORIZON)
X_test, y_test = create_sequences(test_df, config.SEQ_LENGTH, config.FORECAST_HORIZON)

logger.info(f"Train sequences: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")
logger.info(f"Input shape: {X_train.shape} | Output shape: {y_train.shape}")

# DataLoaders
train_loader = DataLoader(
    torch.utils.data.TensorDataset(X_train, y_train),
    batch_size=config.BATCH_SIZE, 
    shuffle=True
)
val_loader = DataLoader(
    torch.utils.data.TensorDataset(X_val, y_val),
    batch_size=config.BATCH_SIZE
)
test_loader = DataLoader(
    torch.utils.data.TensorDataset(X_test, y_test),
    batch_size=config.BATCH_SIZE
)

# ==========================================
# MODEL DEFINITION
# ==========================================
class BusinessLSTM(nn.Module):
    """
    LSTM for business cashflow forecasting
    Predicts next 4 weeks of cash_in based on past 8 weeks
    """
    
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
        # x: [batch, seq_len, features]
        lstm_out, _ = self.lstm(x)
        last_hidden = lstm_out[:, -1, :]  # [batch, hidden]
        
        x = self.relu(self.fc1(self.dropout(last_hidden)))
        predictions = self.fc2(self.dropout(x))  # [batch, 4 weeks]
        
        return predictions

model = BusinessLSTM(
    num_features=len(config.FEATURE_COLS),
    hidden=config.HIDDEN_SIZE,
    forecast_weeks=config.FORECAST_HORIZON,
    num_layers=config.NUM_LSTM_LAYERS,
    dropout=config.DROPOUT
)

num_params = sum(p.numel() for p in model.parameters())
logger.info(f"\nModel created: {num_params:,} parameters")

criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=config.LEARNING_RATE)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5, factor=0.5, verbose=False)

# ==========================================
# TRAINING LOOP
# ==========================================
logger.info("\n=== Training Started ===")

best_val_loss = float('inf')
patience_counter = 0
history = {'train': [], 'val': []}

for epoch in range(config.EPOCHS):
    # Train
    model.train()
    train_loss = 0
    for X, y in train_loader:
        optimizer.zero_grad()
        pred = model(X)
        loss = criterion(pred, y)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        train_loss += loss.item()
    
    # Validate
    model.eval()
    val_loss = 0
    with torch.no_grad():
        for X, y in val_loader:
            pred = model(X)
            val_loss += criterion(pred, y).item()
    
    avg_train = train_loss / len(train_loader)
    avg_val = val_loss / len(val_loader)
    history['train'].append(avg_train)
    history['val'].append(avg_val)
    
    if (epoch + 1) % 10 == 0:
        logger.info(f"Epoch {epoch+1:03d}/{config.EPOCHS} | Train: {avg_train:.6f} | Val: {avg_val:.6f}")
    
    scheduler.step(avg_val)
    
    # Early stopping
    if avg_val < best_val_loss:
        best_val_loss = avg_val
        patience_counter = 0
        torch.save(model.state_dict(), 'models/business_lstm.pt')
        if (epoch + 1) % 10 == 0:
            logger.info("  ✓ Best model saved")
    else:
        patience_counter += 1
        if patience_counter >= config.EARLY_STOPPING_PATIENCE:
            logger.info(f"\n⏹ Early stopping at epoch {epoch+1}")
            break

# Load best model
model.load_state_dict(torch.load('models/business_lstm.pt', weights_only=True))
logger.info("\n=== Training Complete - Best Model Loaded ===")

# ==========================================
# EVALUATION
# ==========================================
logger.info("\n=== Evaluating on Test Set ===")

def inverse_transform_target(scaled_values):
    """Convert scaled predictions back to real currency"""
    real_values = scaled_values * target_scaler.scale_[0] + target_scaler.mean_[0]
    return real_values

model.eval()
all_preds = []
all_actuals = []

with torch.no_grad():
    for X, y in test_loader:
        preds = model(X)
        all_preds.append(preds.numpy())
        all_actuals.append(y.numpy())

all_preds = np.concatenate(all_preds)
all_actuals = np.concatenate(all_actuals)

# Convert to real currency
pred_flat = all_preds.flatten()
actual_flat = all_actuals.flatten()
pred_real = inverse_transform_target(pred_flat)
actual_real = inverse_transform_target(actual_flat)

mae = mean_absolute_error(actual_real, pred_real)
rmse = np.sqrt(mean_squared_error(actual_real, pred_real))
r2 = r2_score(actual_real, pred_real)
mape = np.mean(np.abs((actual_real - pred_real) / actual_real)) * 100

logger.info(f"\nOverall Performance:")
logger.info(f"  MAE:  {mae:,.2f} (currency units)")
logger.info(f"  RMSE: {rmse:,.2f}")
logger.info(f"  R²:   {r2:.4f}")
logger.info(f"  MAPE: {mape:.2f}%")

# Week-specific accuracy
logger.info(f"\nWeek-Specific Accuracy:")
for week in range(1, config.FORECAST_HORIZON + 1):
    week_preds = inverse_transform_target(all_preds[:, week-1])
    week_actuals = inverse_transform_target(all_actuals[:, week-1])
    week_mae = mean_absolute_error(week_actuals, week_preds)
    week_mape = np.mean(np.abs((week_actuals - week_preds) / week_actuals)) * 100
    logger.info(f"  Week {week}: MAE = {week_mae:,.2f} | MAPE = {week_mape:.2f}%")

# Sanity check
logger.info(f"\nSanity Check:")
logger.info(f"  Actual cash_in range: {actual_real.min():,.0f} to {actual_real.max():,.0f}")
logger.info(f"  Predicted cash_in range: {pred_real.min():,.0f} to {pred_real.max():,.0f}")

# ==========================================
# SAVE ARTIFACTS
# ==========================================
logger.info("\n=== Saving Production Artifacts ===")

joblib.dump(scaler, 'models/business_scaler.pkl')
joblib.dump(target_scaler, 'models/business_target_scaler.pkl')
logger.info("✓ Scalers saved")

metadata = {
    'version': '1.0',
    'trained_at': datetime.now().isoformat(),
    'data_type': 'real_business_transactions',
    'config': {
        'seq_length': config.SEQ_LENGTH,
        'forecast_horizon': config.FORECAST_HORIZON,
        'hidden_size': config.HIDDEN_SIZE,
        'num_layers': config.NUM_LSTM_LAYERS,
        'feature_cols': config.FEATURE_COLS,
        'target_col': config.TARGET_COL
    },
    'scaler_params': {
        'target_mean': float(target_scaler.mean_[0]),
        'target_std': float(target_scaler.scale_[0])
    },
    'performance': {
        'test_mae': float(mae),
        'test_rmse': float(rmse),
        'test_r2': float(r2),
        'test_mape': float(mape)
    },
    'epochs_trained': len(history['train']),
    'best_val_loss': float(best_val_loss)
}

with open('models/business_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
logger.info("✓ Metadata saved")

# ==========================================
# VISUALIZATION
# ==========================================
logger.info("\n=== Creating Visualizations ===")

fig, axes = plt.subplots(2, 2, figsize=(16, 10))

# Training history
ax = axes[0, 0]
ax.plot(history['train'], label='Train Loss', linewidth=2)
ax.plot(history['val'], label='Val Loss', linewidth=2)
ax.set_title('Training History (Real Business Data)', fontsize=14, fontweight='bold')
ax.set_xlabel('Epoch')
ax.set_ylabel('MSE Loss')
ax.legend()
ax.grid(True, alpha=0.3)

# Scatter plot
ax = axes[0, 1]
ax.scatter(actual_real, pred_real, alpha=0.5, s=30)
min_val, max_val = actual_real.min(), actual_real.max()
ax.plot([min_val, max_val], [min_val, max_val], 'r--', linewidth=2)
ax.set_title(f'Predictions vs Actuals (R²={r2:.3f})', fontsize=14, fontweight='bold')
ax.set_xlabel('Actual Cash In')
ax.set_ylabel('Predicted Cash In')
ax.grid(True, alpha=0.3)

# Example forecast
ax = axes[1, 0]
sample_idx = 0
sample_pred = inverse_transform_target(all_preds[sample_idx])
sample_actual = inverse_transform_target(all_actuals[sample_idx])
weeks = np.arange(1, config.FORECAST_HORIZON + 1)
ax.plot(weeks, sample_actual, 'bo-', label='Actual', linewidth=2, markersize=8)
ax.plot(weeks, sample_pred, 'rs--', label='Predicted', linewidth=2, markersize=8)
ax.set_title('Example 4-Week Forecast', fontsize=14, fontweight='bold')
ax.set_xlabel('Weeks Ahead')
ax.set_ylabel('Cash In')
ax.legend()
ax.grid(True, alpha=0.3)

# Week-specific MAE
ax = axes[1, 1]
week_maes = []
for week in range(config.FORECAST_HORIZON):
    week_preds = inverse_transform_target(all_preds[:, week])
    week_actuals = inverse_transform_target(all_actuals[:, week])
    week_maes.append(mean_absolute_error(week_actuals, week_preds))
ax.plot(range(1, config.FORECAST_HORIZON + 1), week_maes, 'o-', linewidth=2, markersize=8)
ax.set_title('Prediction Accuracy by Week', fontsize=14, fontweight='bold')
ax.set_xlabel('Weeks Ahead')
ax.set_ylabel('MAE')
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('plots/business_training_results.png', dpi=300, bbox_inches='tight')
logger.info("✓ Plots saved")
plt.close()

logger.info("\n" + "="*60)
logger.info("🎉 TRAINING COMPLETE!")
logger.info("="*60)
logger.info("\nProduction artifacts ready:")
logger.info("  📦 models/business_lstm.pt")
logger.info("  📦 models/business_scaler.pkl")
logger.info("  📦 models/business_target_scaler.pkl")
logger.info("  📦 models/business_metadata.json")
logger.info("  📊 plots/business_training_results.png")
logger.info("\nNext: Use business_agent.py for predictions")
logger.info("="*60)