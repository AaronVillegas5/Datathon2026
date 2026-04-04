import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error
import shap
import math
import joblib  # for saving/loading models
from Asthma.asthma_model import load_model, load_and_clean_data   # Import the load_model function from asthma_model.py


# ---------------------------
# Compare ZIPs to County & State Percentiles
# ---------------------------
def add_percentile_rankings(df, pred_col='pred_asthma_pctl'):
    df = df.copy()
    
    # --- 1️⃣ State-level percentile ---
    # Rank all ZIPs in CA
    df['state_percentile'] = df[pred_col].rank(pct=True) * 100
    
    # --- 2️⃣ County-level percentile ---
    df['county_percentile'] = df.groupby('California County')[pred_col] \
                                .rank(pct=True) * 100
    
    # --- 3️⃣ Optional: Top n% flags ---
    df['top_5_state'] = df['state_percentile'] >= 95
    df['top_10_county'] = df['county_percentile'] >= 90
    
    return df

# ---------------------------
# Example Usage
# ---------------------------
if __name__ == "__main__":
    # Load and clean data
    df_clean, X, y = load_and_clean_data("data.csv")
    
    # Load trained model
    xgb_model = load_model("best_xgb_model.pkl")
    
    # Predict using only the feature columns
    df_clean["pred_asthma_pctl"] = xgb_model.predict(X)
    
    # Add percentile rankings
    df_ranked = add_percentile_rankings(df_clean, pred_col='pred_asthma_pctl')
    
    # View top 5% state-wide
    print(df_ranked[df_ranked['top_5_state']].sort_values('pred_asthma_pctl', ascending=False).head(10))
    print(df_ranked)
    # # View top 10% within each county
    #print(df_ranked[df_ranked['top_10_county']].sort_values(['California County','pred_asthma_pctl'], ascending=[True,False]).head(10))