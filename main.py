from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd
import joblib

from Asthma.asthma_statistics import add_percentile_rankings
from Asthma.asthma_model import load_model, load_and_clean_data

# ---------------------------
# Initialize FastAPI
# ---------------------------
app = FastAPI(title="Healthy Home API", version="1.0")

# ---------------------------
# Load ASTHMA data & model
# ---------------------------
ASTHMA_DATA_PATH = "Asthma/data.csv"
ASTHMA_MODEL_PATH = "Asthma/best_xgb_model.pkl"

asthma_df, asthma_X, _ = load_and_clean_data(ASTHMA_DATA_PATH)
asthma_model = load_model(ASTHMA_MODEL_PATH)

# Add asthma predictions & percentiles
asthma_df["pred_asthma_pctl"] = asthma_model.predict(asthma_X)
asthma_df = add_percentile_rankings(asthma_df, pred_col="pred_asthma_pctl")

# ---------------------------
# Load CARDIO model
# ---------------------------
CARDIO_MODEL_PATH = "Cardiovascular/cardiovascular_model.pkl"
CARDIO_FEATURES = [
    "Ozone", "PM2.5", "Diesel PM", "Drinking Water", "Lead", "Pesticides",
    "Traffic", "Cleanup Sites", "Groundwater Threats", "Haz. Waste",
    "Imp. Water Bodies", "Solid Waste", "Education", "Linguistic Isolation",
    "Poverty", "Unemployment", "Housing Burden"
]

cardio_model = joblib.load(CARDIO_MODEL_PATH)

# ---------------------------
# Add cardiovascular predictions directly to asthma_df
# ---------------------------
# Make sure all required features exist
missing_features = set(CARDIO_FEATURES) - set(asthma_df.columns)
if missing_features:
    raise ValueError(f"Missing features in asthma_df for cardio prediction: {missing_features}")

cardio_X = asthma_df[CARDIO_FEATURES]
asthma_df["pred_cardio"] = cardio_model.predict(cardio_X)
asthma_df = add_percentile_rankings(asthma_df, pred_col="pred_cardio")

# ---------------------------
# Request / Response Models
# ---------------------------
class ZIPRequest(BaseModel):
    zip_codes: List[str]

# ---------------------------
# API Endpoints
# ---------------------------
@app.get("/")
def read_root():
    return {"message": "Healthy Home API running!"}

# ----- Asthma -----
@app.post("/predict-asthma")
def predict_asthma(request: ZIPRequest):
    zips = request.zip_codes
    result = asthma_df[asthma_df["ZIP"].isin(zips)]
    return result[[
        "ZIP", "pred_asthma_pctl",
        "state_percentile", "county_percentile",
        "top_5_state", "top_10_county"
    ]].to_dict(orient="records")

@app.get("/top-risk-asthma")
def top_risk_asthma(percentile: float = 90):
    top_df = asthma_df[asthma_df["pred_asthma_pctl"] >= percentile].copy()
    return top_df[[
        "ZIP", "pred_asthma_pctl",
        "state_percentile", "county_percentile",
        "top_5_state", "top_10_county"
    ]].to_dict(orient="records")

# ----- Cardiovascular -----
@app.post("/predict-cardiovascular")
def predict_cardiovascular(request: ZIPRequest):
    zips = request.zip_codes
    result = asthma_df[asthma_df["ZIP"].isin(zips)]
    return result[[
        "ZIP", "pred_cardio",
        "state_percentile", "county_percentile",
        "top_5_state", "top_10_county"
    ]].to_dict(orient="records")