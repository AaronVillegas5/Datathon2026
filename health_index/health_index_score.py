# health_index_score.py
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

DATA_PATH = "Asthma/data.csv"
df = pd.read_csv(DATA_PATH, dtype={"ZIP": str})
df.columns = df.columns.str.strip()
df["ZIP"] = df["ZIP"].astype(str).str.strip().str.zfill(5)

HEALTH_COLS = ["Asthma Pctl", "Cardiovascular Disease Pctl", "Low Birth Weight Pctl"]
ENV_COLS = ["Pollution Burden Score"]
SDOH_COLS = ["Education Pctl", "Poverty Pctl", "Linguistic Isolation Pctl", "Unemployment Pctl", "Housing Burden Pctl"]

ALL_COLS = HEALTH_COLS + ENV_COLS + SDOH_COLS

# Fill missing values with mean
df[ALL_COLS] = df[ALL_COLS].apply(pd.to_numeric, errors='coerce')
# Mean imputation is used for missing values to retain all rows and because these columns are continuous variables.
df[ALL_COLS] = df[ALL_COLS].fillna(df[ALL_COLS].mean(axis=0))
df[ALL_COLS] = df[ALL_COLS].fillna(df[ALL_COLS].mean(axis=0))

# Normalize columns
scaler = MinMaxScaler()
df_scaled = df.copy()
df_scaled[ALL_COLS] = scaler.fit_transform(df[ALL_COLS])

# Subscores and HVI
df_scaled["Health Subscore"] = df_scaled[HEALTH_COLS].mean(axis=1)
df_scaled["Environment Subscore"] = df_scaled[ENV_COLS].mean(axis=1)
df_scaled["SDOH Subscore"] = df_scaled[SDOH_COLS].mean(axis=1)
df_scaled["HVI"] = df_scaled[["Health Subscore", "Environment Subscore", "SDOH Subscore"]].mean(axis=1)
df_scaled["HVI_Pctl"] = df_scaled["HVI"].rank(pct=True) * 100

def compute_hvi_for_zips(zip_codes: list):
    zips = [z.zfill(5) for z in zip_codes]
    result = df_scaled[df_scaled["ZIP"].isin(zips)].copy()
    return result[[
        "ZIP", "California County", "HVI", "HVI_Pctl",
        "Health Subscore", "Environment Subscore", "SDOH Subscore"
    ]].to_dict(orient="records")

def get_top_hvi(n: int = 10):
    top_df = df_scaled.sort_values("HVI", ascending=False).head(n)
    return top_df[[
        "ZIP", "California County", "HVI", "HVI_Pctl",
        "Health Subscore", "Environment Subscore", "SDOH Subscore"
    ]].to_dict(orient="records")

