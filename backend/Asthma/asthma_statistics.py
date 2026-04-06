# Asthma/asthma_statistics.py

# ✅ Use relative imports for package compatibility
from pathlib import Path
import pandas as pd

try:
    from .asthma_model import load_and_clean_data, load_model
except ImportError:
    from asthma_model import load_and_clean_data, load_model

# ---------------------------
# Compare ZIPs to County & State Percentiles
# ---------------------------
def add_percentile_rankings(df, pred_col='pred_asthma_pctl'):
    """
    Adds percentile rankings at the state and county level,
    and flags for top 5% (state) and top 10% (county).
    """
    df = df.copy()
    
    # --- State-level percentile ---
    df['state_percentile'] = df[pred_col].rank(pct=True) * 100
    
    # --- County-level percentile ---
    df['county_percentile'] = df.groupby('California County')[pred_col] \
                                .rank(pct=True) * 100
    
    # --- Top n% flags ---
    df['top_5_state'] = df['state_percentile'] >= 95
    df['top_10_county'] = df['county_percentile'] >= 90
    
    return df


# ---------------------------
# Example usage if run as a module
# ---------------------------
if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parents[2]
    DATA_PATH = BASE_DIR / "data" / "data.csv"
    MODEL_PATH = BASE_DIR / "models" / "best_xgb_model.pkl"
    
    # 1️⃣ Load and clean data
    df_clean, X, y = load_and_clean_data(DATA_PATH)
    
    # 2️⃣ Load trained model
    xgb_model = load_model(MODEL_PATH)
    
    # 3️⃣ Predict asthma percentiles
    df_clean["pred_asthma_pctl"] = xgb_model.predict(X)
    
    # 4️⃣ Add state/county percentiles
    df_ranked = add_percentile_rankings(df_clean, pred_col='pred_asthma_pctl')
    
    # 5️⃣ View top 5% state-wide
    print("Top 5% State-Wide ZIPs:")
    print(df_ranked[df_ranked['top_5_state']]
          .sort_values('pred_asthma_pctl', ascending=False)
          .head(10))
    
    # 6️⃣ View top 10% in county
    print("\nTop 10% County ZIPs:")
    print(df_ranked[df_ranked['top_10_county']]
          .sort_values(['California County','pred_asthma_pctl'], ascending=[True,False])
          .head(10))
